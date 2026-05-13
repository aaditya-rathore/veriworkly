import { describe, expect, it } from "vitest";

import { masterProfilePayloadSchema } from "../../src/validators/masterProfileValidator";

const validPayload = {
  expectedUpdatedAt: "2026-04-10T10:00:00.000Z",
  profile: {
    templateId: "modern",
    basics: {
      fullName: "Test User",
      role: "Engineer",
      headline: "Builds products",
      email: "test@example.com",
      phone: "5550001234",
      location: "Remote",
      linkEmail: true,
      linkPhone: true,
      linkLocation: true,
    },
    links: {
      displayMode: "icon",
      items: [
        {
          id: "link-1",
          type: "github",
          label: "GitHub",
          url: "https://github.com/test",
        },
      ],
    },
    summary: "Summary",
    experience: [],
    education: [],
    projects: [],
    skills: [],
    languages: [],
    interests: [],
    awards: [],
    certificates: [],
    publications: [],
    volunteer: [],
    references: [],
    achievements: [],
    customSections: [],
    sections: [
      {
        id: "basics",
        label: "Basics",
        visible: true,
        order: 0,
      },
    ],
    customization: {
      accentColor: "#2563eb",
      textColor: "#0f172a",
      mutedTextColor: "#64748b",
      pageBackgroundColor: "#ffffff",
      sectionBackgroundColor: "#f8fafc",
      borderColor: "#cbd5e1",
      sectionHeadingColor: "#1e293b",
      fontFamily: "geist",
      sectionSpacing: 24,
      pagePadding: 24,
      bodyLineHeight: 1.5,
      headingLineHeight: 1.2,
    },
    updatedAt: "2026-04-10T10:00:00.000Z",
  },
};

describe("masterProfilePayloadSchema contract", () => {
  it("accepts a valid profile payload", () => {
    const result = masterProfilePayloadSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("rejects unknown keys in root payload", () => {
    const result = masterProfilePayloadSchema.safeParse({
      ...validPayload,
      unexpected: true,
    });

    expect(result.success).toBe(false);
  });

  it("rejects malformed nested fields", () => {
    const result = masterProfilePayloadSchema.safeParse({
      ...validPayload,
      profile: {
        ...validPayload.profile,
        basics: {
          ...validPayload.profile.basics,
          email: "not-an-email",
        },
      },
    });

    expect(result.success).toBe(false);
  });

  it("rejects malformed phone, URL, and dates", () => {
    const result = masterProfilePayloadSchema.safeParse({
      ...validPayload,
      profile: {
        ...validPayload.profile,
        basics: {
          ...validPayload.profile.basics,
          phone: "12345",
        },
        links: {
          ...validPayload.profile.links,
          items: [
            {
              ...validPayload.profile.links.items[0],
              url: "github.com/test",
            },
          ],
        },
        education: [
          {
            id: "edu-1",
            school: "School",
            degree: "Degree",
            field: "Field",
            startDate: "2024-01",
            endDate: "abcd",
            current: false,
            summary: "",
          },
        ],
      },
    });

    expect(result.success).toBe(false);
  });
});
