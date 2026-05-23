import type { ResumeData } from "@/types/resume";

import {
  RESUME_STORAGE_KEY,
  RESUME_ACTIVE_ID_STORAGE_KEY,
  RESUME_COLLECTION_STORAGE_KEY,
} from "@/lib/constants";

import {
  parseResumeDataInput,
  parseResumeCollectionInput,
  type ResumeCollection,
} from "@/features/resume/schemas/resume-storage-schema";

import {
  LocalStorageService,
  type SaveDocumentOptions as SaveResumeOptions,
  type SaveDocumentResult as SaveResumeResult,
} from "@/features/documents/services/local-storage-service";

export type { SaveResumeOptions, SaveResumeResult };

export const RESUME_STORAGE_UPDATED_EVENT = "veriworkly:resume-storage-updated";

export const resumeLocalStorage = new LocalStorageService<ResumeData>({
  collectionKey: RESUME_COLLECTION_STORAGE_KEY,
  activeIdKey: RESUME_ACTIVE_ID_STORAGE_KEY,
  legacyKey: RESUME_STORAGE_KEY,
  updatedEventName: RESUME_STORAGE_UPDATED_EVENT,
  parseItem: parseResumeDataInput,
  parseCollection: parseResumeCollectionInput,
});

export function getActiveResumeIdFromLocalStorage() {
  return resumeLocalStorage.getActiveId();
}

export function setActiveResumeIdInLocalStorage(resumeId: string) {
  resumeLocalStorage.setActiveId(resumeId);
}

export function loadResumeCollectionFromLocalStorage() {
  return resumeLocalStorage.loadCollection();
}

export function saveResumeCollectionToLocalStorage(collection: ResumeCollection) {
  return resumeLocalStorage.saveCollection(collection);
}

export function flushPendingResumeSaveToLocalStorage() {
  return resumeLocalStorage.flush();
}

export function saveResumeToLocalStorage(
  resume: ResumeData,
  options?: SaveResumeOptions,
): SaveResumeResult {
  return resumeLocalStorage.save(resume, options);
}

export function loadResumeFromLocalStorage() {
  return resumeLocalStorage.loadActive();
}

export function loadResumeByIdFromLocalStorage(resumeId: string) {
  return resumeLocalStorage.loadById(resumeId);
}

export function listResumesFromLocalStorage() {
  return resumeLocalStorage.list();
}

export function deleteResumeFromLocalStorage(resumeId: string) {
  return resumeLocalStorage.delete(resumeId);
}

export function clearResumeFromLocalStorage() {
  resumeLocalStorage.clear();
}
