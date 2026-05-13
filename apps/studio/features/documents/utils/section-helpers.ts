/**
 * Check if a section is visible in a document
 */
export function isSectionVisible(sections: any[], key: string): boolean {
  if (!sections || !Array.isArray(sections)) return true;
  const section = sections.find((item) => item.id === key);
  return section ? section.visible !== false : true;
}
