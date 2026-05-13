import { templateRegistry } from "@/templates";

export const templateSummaries = templateRegistry.map((template: any) => ({
  id: template.id,
  name: template.name,
  description: template.description,
  accentColor: template.accentColor || "#000",
  previewImage: template.previewImage || "",
  tags: template.tags || [],
}));
