"use client";

import { normalizeResumeData } from "@/features/resume/utils/normalize-data";
import { parseResumeDataInput } from "@/features/resume/schemas/resume-storage-schema";
import { importDocumentFromFile } from "@/features/documents/services/import-service";

export async function importResumeFromFile(file: File) {
  return importDocumentFromFile(file, parseResumeDataInput, normalizeResumeData);
}
