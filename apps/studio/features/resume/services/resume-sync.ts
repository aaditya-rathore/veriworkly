"use client";

import type { ResumeData } from "@/types/resume";
import type { ResumeSyncStatus } from "@/types/resume";

import {
  RESUME_STORAGE_UPDATED_EVENT,
  setActiveResumeIdInLocalStorage,
  getActiveResumeIdFromLocalStorage,
  saveResumeCollectionToLocalStorage,
  loadResumeCollectionFromLocalStorage,
} from "@/features/resume/services/local-storage";
import { saveResume, loadResumeById } from "@/features/resume/services/resume-service";
import { parseResumeDataInput } from "@/features/resume/schemas/resume-storage-schema";

import { DocumentApi, type CloudDocument } from "@/features/documents/services/document-api";
import {
  SyncEngine,
  type SyncStatus,
  type SyncTelemetry,
} from "@/features/documents/services/sync-engine";

import { backendApiUrl } from "@/lib/constants";

export type ResumeSyncResult = {
  ok: boolean;
  message: string;
  reason?: "conflict" | "auth" | "forbidden" | "not-found" | "network" | "unknown";
};

interface HydrateCloudResumesOptions {
  force?: boolean;
  minIntervalMs?: number;
}

interface SyncNowOptions {
  force?: boolean;
}

interface ResumeSyncWorkerOptions {
  enabled: boolean;
  idleDelayMs?: number;
}

export type ResumeSyncTelemetry = SyncTelemetry;

const CLOUD_HYDRATE_META_KEY = "veriworkly:cloud-hydrate-meta";
export const RESUME_SYNC_OUTBOX_UPDATED_EVENT = "veriworkly:sync-outbox-updated";

const DEFAULT_AUTO_SYNC_IDLE_DELAY_MS = 12_000;
const DEFAULT_MIN_HYDRATE_INTERVAL_MS = 2 * 60 * 1000;

let workerTickTimer: number | null = null;
let workerEnabled = false;
let listenersAttached = false;
let workerTickInFlight = false;
let workerIdleDelayMs = DEFAULT_AUTO_SYNC_IDLE_DELAY_MS;

function isBrowser() {
  return typeof window !== "undefined";
}

function toTimestamp(value: string | null | undefined) {
  if (!value) return 0;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

// --- Sync Worker Logic ---

function scheduleWorkerTick(delayMs: number) {
  if (!isBrowser()) return;
  if (workerTickTimer !== null) {
    window.clearTimeout(workerTickTimer);
  }
  workerTickTimer = window.setTimeout(
    () => {
      workerTickTimer = null;
      void runWorkerTick();
    },
    Math.max(0, delayMs),
  );
}

function getNextDueOutboxItem() {
  const now = Date.now();
  const outbox = SyncEngine.getOutbox();
  const items = Object.values(outbox)
    .filter((item) => item.state !== "conflicted")
    .sort((left, right) => left.nextAttemptAt - right.nextAttemptAt);

  if (items.length === 0) return null;
  const first = items[0];
  return {
    item: first,
    delayMs: Math.max(0, first.nextAttemptAt - now),
  };
}

async function runWorkerTick() {
  if (!workerEnabled || workerTickInFlight) return;
  const due = getNextDueOutboxItem();
  if (!due) return;

  if (due.delayMs > 0) {
    scheduleWorkerTick(due.delayMs);
    return;
  }

  workerTickInFlight = true;
  try {
    const resume = loadResumeById(due.item.id);
    if (resume && resume.sync.enabled) {
      await syncResumeNow(due.item.id);
    } else {
      SyncEngine.removeOutboxItem(due.item.id);
    }
  } finally {
    workerTickInFlight = false;
    const nextDue = getNextDueOutboxItem();
    if (workerEnabled && nextDue) scheduleWorkerTick(nextDue.delayMs);
  }
}

function attachWorkerListeners() {
  if (!isBrowser() || listenersAttached) return;
  const requeueAndRun = () => {
    if (!workerEnabled) return;
    queuePendingResumesForSync();
    const nextDue = getNextDueOutboxItem();
    if (nextDue) scheduleWorkerTick(nextDue.delayMs);
  };

  window.addEventListener(RESUME_STORAGE_UPDATED_EVENT, requeueAndRun);
  window.addEventListener("online", requeueAndRun);
  window.addEventListener("focus", requeueAndRun);
  window.addEventListener("visibilitychange", requeueAndRun);
  listenersAttached = true;
}

function queuePendingResumesForSync() {
  const collection = loadResumeCollectionFromLocalStorage();
  const pending = Object.values(collection.items).filter(
    (resume) => resume.sync.enabled && resume.sync.status === "pending",
  );
  for (const resume of pending) {
    SyncEngine.upsertOutboxItem(resume.id);
  }
}

export function startResumeSyncWorker(options: ResumeSyncWorkerOptions) {
  workerEnabled = options.enabled;
  workerIdleDelayMs = Math.max(2_000, options.idleDelayMs ?? DEFAULT_AUTO_SYNC_IDLE_DELAY_MS);
  attachWorkerListeners();

  if (workerEnabled) {
    queuePendingResumesForSync();
    const nextDue = getNextDueOutboxItem();
    if (nextDue) scheduleWorkerTick(nextDue.delayMs);
  }
}

export async function syncAllPendingResumes() {
  const collection = loadResumeCollectionFromLocalStorage();
  const pending = Object.values(collection.items).filter(
    (resume) => resume.sync.enabled && resume.sync.status === "pending",
  );

  const results = await Promise.all(pending.map((resume) => syncResumeNow(resume.id)));

  return results;
}


// --- Sync Actions ---

export async function syncResumeNow(
  resumeId: string,
  options?: SyncNowOptions,
): Promise<ResumeSyncResult> {
  const resume = loadResumeById(resumeId);
  if (!resume) return { ok: false, message: "Resume not found locally.", reason: "not-found" };

  setLocalSyncState(resumeId, "syncing");
  SyncEngine.updateTelemetry(resumeId, { lastAttemptAt: new Date().toISOString() });
  SyncEngine.upsertOutboxItem(resumeId, { state: "syncing" });

  try {
    const isNew = !resume.sync.cloudResumeId;
    let cloud: CloudDocument;

    if (isNew) {
      cloud = await DocumentApi.create({
        id: resume.id,
        type: "RESUME",
        title: resume.basics.fullName || "Untitled Resume",
        content: resume,
        templateId: resume.templateId,
      });
    } else {
      cloud = await DocumentApi.update(resume.id, {
        title: resume.basics.fullName,
        content: resume,
        templateId: resume.templateId,
        revision: resume.sync.revision,
      });
    }

    const updated = applyCloudSyncMetadata(resume, cloud);
    saveResume(updated);
    SyncEngine.removeOutboxItem(resumeId);
    SyncEngine.updateTelemetry(resumeId, { lastSuccessAt: new Date().toISOString() });

    return { ok: true, message: "Resume synced successfully." };
  } catch (error: any) {
    const isConflict = error.message.includes("Conflict");
    setLocalSyncState(resumeId, isConflict ? "conflicted" : "pending");

    SyncEngine.upsertOutboxItem(resumeId, {
      state: isConflict ? "conflicted" : "pending",
      nextAttemptAt: Date.now() + (isConflict ? 60000 : workerIdleDelayMs),
    });

    SyncEngine.updateTelemetry(resumeId, {
      lastErrorAt: new Date().toISOString(),
      lastErrorMessage: error.message,
    });

    return {
      ok: false,
      message: error.message,
      reason: isConflict ? "conflict" : "network",
    };
  }
}

function setLocalSyncState(resumeId: string, status: SyncStatus) {
  const resume = loadResumeById(resumeId);
  if (!resume) return;
  saveResume({
    ...resume,
    sync: { ...resume.sync, status },
  });
}

function applyCloudSyncMetadata(resume: ResumeData, record: CloudDocument): ResumeData {
  return {
    ...resume,
    sync: {
      ...resume.sync,
      enabled: true,
      status: "synced",
      cloudResumeId: record.id,
      lastSyncedAt: record.lastSyncedAt ?? record.updatedAt,
      revision: record.revision,
    },
  };
}

// --- Hydration / Merging ---

export async function hydrateCloudResumeByIdToLocalStorage(
  resumeId: string,
): Promise<ResumeSyncResult> {
  try {
    const record = await DocumentApi.get(resumeId);
    const merged = mergeCloudResumesIntoLocalStorage([record]);
    return merged.ok
      ? { ok: true, message: "Cloud resume loaded successfully." }
      : { ok: false, message: "Unable to merge the cloud resume." };
  } catch (error: any) {
    return { ok: false, message: error.message };
  }
}

export async function hydrateCloudResumesToLocalStorage(
  options?: HydrateCloudResumesOptions,
): Promise<ResumeSyncResult> {
  if (!shouldHydrateCloudResumes(options)) {
    return { ok: true, message: "Fresh enough." };
  }

  try {
    const records = await DocumentApi.list("RESUME");
    const merged = mergeCloudResumesIntoLocalStorage(records);

    setLastCloudHydrateMeta({
      lastHydratedAt: Date.now(),
      lastServerCursor: new Date().toISOString(),
    });

    return merged.ok
      ? { ok: true, message: `Merged ${merged.mergedCount} resumes.` }
      : { ok: false, message: "Merge failed." };
  } catch (error: any) {
    return { ok: false, message: error.message };
  }
}

function mergeCloudResumesIntoLocalStorage(records: CloudDocument[]) {
  let mergedCount = 0;
  const collection = loadResumeCollectionFromLocalStorage();

  for (const record of records) {
    const cloudResume = parseResumeDataInput(record.content);
    if (!cloudResume) continue;

    const localResume = collection.items[cloudResume.id];
    const localUpdatedAt = toTimestamp(localResume?.updatedAt);
    const cloudUpdatedAt = toTimestamp(record.updatedAt);

    if (!localResume || cloudUpdatedAt > localUpdatedAt) {
      collection.items[cloudResume.id] = applyCloudSyncMetadata(cloudResume, record);
      mergedCount += 1;
    }
  }

  if (mergedCount > 0) {
    saveResumeCollectionToLocalStorage(collection);
    window.dispatchEvent(new Event("storage"));
  }

  return { ok: true, mergedCount };
}

// --- Telemetry Helpers ---

export function getResumeSyncTelemetry(resumeId: string): ResumeSyncTelemetry {
  return SyncEngine.getTelemetry(resumeId);
}

export function getResumeSyncTelemetryByIds(
  resumeIds: string[],
): Record<string, ResumeSyncTelemetry> {
  const result: Record<string, ResumeSyncTelemetry> = {};
  for (const id of resumeIds) result[id] = getResumeSyncTelemetry(id);
  return result;
}

export function getWorkspaceSyncTelemetry() {
  const outbox = SyncEngine.getOutbox();
  const values = Object.values(outbox);
  const maxAttempt = Math.max(...values.map((i) => i.updatedAt), 0);
  return {
    lastAttemptAt: maxAttempt ? new Date(maxAttempt).toISOString() : null,
    lastSuccessAt: null, // Simplified for now
  };
}

// --- Lifecycle Actions ---

export function keepResumeLocalOnly(resumeId: string): ResumeSyncResult {
  const resume = loadResumeById(resumeId);
  if (!resume) return { ok: false, message: "Resume not found.", reason: "not-found" };
  saveResume({
    ...resume,
    sync: {
      ...resume.sync,
      enabled: false,
      status: "local-only",
      cloudResumeId: null,
      revision: 1,
    },
  });
  SyncEngine.removeOutboxItem(resumeId);
  return { ok: true, message: "Sync disabled for this resume." };
}


export async function resolveConflictUseLocal(resumeId: string) {
  return syncResumeNow(resumeId, { force: true });
}

export async function resolveConflictUseCloud(resumeId: string) {
  const result = await hydrateCloudResumeByIdToLocalStorage(resumeId);
  if (result.ok) SyncEngine.removeOutboxItem(resumeId);
  return result;
}

// --- Internal Helpers ---

function getCloudHydrateMeta() {
  if (!isBrowser()) return { lastHydratedAt: 0 };
  const raw = localStorage.getItem(CLOUD_HYDRATE_META_KEY);
  return raw ? JSON.parse(raw) : { lastHydratedAt: 0 };
}

function setLastCloudHydrateMeta(meta: any) {
  if (!isBrowser()) return;
  localStorage.setItem(CLOUD_HYDRATE_META_KEY, JSON.stringify(meta));
}

function shouldHydrateCloudResumes(options?: HydrateCloudResumesOptions) {
  if (options?.force) return true;
  const minInterval = options?.minIntervalMs ?? DEFAULT_MIN_HYDRATE_INTERVAL_MS;
  return Date.now() - getCloudHydrateMeta().lastHydratedAt >= minInterval;
}
