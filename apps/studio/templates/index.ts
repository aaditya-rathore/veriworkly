/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  accentColor: string;
  tags: string[];
  renderWeb: (props: any) => React.ReactNode;
}

// Template registry metadata - lazy loads components on demand
// Templates are NOT loaded by default to optimize performance
export const templateRegistry: TemplateDefinition[] = [
  {
    id: "clean-professional",
    name: "Clean Professional",
    description:
      "A modern, single-column ATS-friendly resume with clean typography and professional layout.",
    accentColor: "#0ea5e9",
    tags: ["One column", "ATS-friendly", "Modern", "Professional"],
    renderWeb: (props: any) => {
      const { CleanProfessionalWeb } = require("./clean-professional/web");
      return React.createElement(CleanProfessionalWeb, props);
    },
  },
  {
    id: "compact-ats",
    name: "Compact ATS",
    description:
      "An ultra-optimized single-column layout designed for maximum ATS parsing compatibility with minimal styling.",
    accentColor: "#10b981",
    tags: ["One column", "ATS-friendly", "Compact", "Simple"],
    renderWeb: (props: any) => {
      const { CompactAtsWeb } = require("./compact-ats/web");
      return React.createElement(CompactAtsWeb, props);
    },
  },
];

export const loadTemplateComponentById = (id: string | undefined): React.ComponentType<any> => {
  const match = templateRegistry.find((t) => t.id === id);
  const template = match || templateRegistry[0];

  return (props: any) => {
    return template.renderWeb(props);
  };
};

export const getTemplateById = (id: string | undefined): TemplateDefinition | undefined => {
  return templateRegistry.find((t) => t.id === id);
};
