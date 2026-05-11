/**
 * Generic Sync Engine for local-first document management.
 * This handles the "Outbox" (queue of changes to be synced) and
 * the background worker coordination.
 */

export type SyncStatus = "local-only" | "pending" | "syncing" | "synced" | "conflicted";

export interface SyncTelemetry {
  lastAttemptAt: string | null;
  lastSuccessAt: string | null;
  lastErrorAt: string | null;
  lastErrorMessage: string | null;
}

export interface OutboxItem {
  id: string;
  state: "pending" | "syncing" | "conflicted";
  attempts: number;
  nextAttemptAt: number;
  updatedAt: number;
}

const STORAGE_KEYS = {
  OUTBOX: "veriworkly:sync-outbox",
  TELEMETRY: "veriworkly:sync-telemetry",
};

export class SyncEngine {
  private static isBrowser() {
    return typeof window !== "undefined";
  }

  // --- Outbox Management ---

  static getOutbox(): Record<string, OutboxItem> {
    if (!this.isBrowser()) return {};
    const raw = localStorage.getItem(STORAGE_KEYS.OUTBOX);
    return raw ? JSON.parse(raw).items : {};
  }

  static saveOutbox(items: Record<string, OutboxItem>) {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEYS.OUTBOX, JSON.stringify({ items }));
    window.dispatchEvent(new Event("veriworkly:sync-outbox-updated"));
  }

  static upsertOutboxItem(id: string, patch: Partial<OutboxItem> = {}) {
    const outbox = this.getOutbox();
    const existing = outbox[id];
    const now = Date.now();

    outbox[id] = {
      id,
      state: patch.state ?? existing?.state ?? "pending",
      attempts: patch.attempts ?? existing?.attempts ?? 0,
      nextAttemptAt: patch.nextAttemptAt ?? now,
      updatedAt: now,
    };
    this.saveOutbox(outbox);
  }

  static removeOutboxItem(id: string) {
    const outbox = this.getOutbox();
    delete outbox[id];
    this.saveOutbox(outbox);
  }

  // --- Telemetry Management ---

  static getTelemetry(id: string): SyncTelemetry {
    if (!this.isBrowser()) return this.defaultTelemetry();
    const raw = localStorage.getItem(STORAGE_KEYS.TELEMETRY);
    const state = raw ? JSON.parse(raw).byDocumentId : {};
    return state[id] || this.defaultTelemetry();
  }

  static updateTelemetry(id: string, patch: Partial<SyncTelemetry>) {
    if (!this.isBrowser()) return;
    const raw = localStorage.getItem(STORAGE_KEYS.TELEMETRY);
    const state = raw ? JSON.parse(raw) : { byDocumentId: {} };

    state.byDocumentId[id] = {
      ...(state.byDocumentId[id] || this.defaultTelemetry()),
      ...patch,
    };

    localStorage.setItem(STORAGE_KEYS.TELEMETRY, JSON.stringify(state));
  }

  private static defaultTelemetry(): SyncTelemetry {
    return {
      lastAttemptAt: null,
      lastSuccessAt: null,
      lastErrorAt: null,
      lastErrorMessage: null,
    };
  }
}
