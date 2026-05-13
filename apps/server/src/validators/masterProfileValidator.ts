import { z } from "zod";

const sectionIdSchema = z.enum([
  "basics",
  "links",
  "summary",
  "experience",
  "education",
  "projects",
  "skills",
  "certifications",
  "awards",
  "publications",
  "languages",
  "interests",
  "volunteer",
  "references",
  "achievements",
  "custom",
]);

const linkTypeSchema = z.enum([
  "github",
  "linkedin",
  "dribbble",
  "twitter",
  "portfolio",
  "behance",
  "medium",
  "youtube",
  "custom",
]);

const customKindSchema = z.enum([
  "certifications",
  "awards",
  "publications",
  "languages",
  "interests",
  "volunteer",
  "references",
  "achievements",
  "custom",
]);

const monthDatePattern = /^\d{4}-(0[1-9]|1[0-2])$/;
const yearDatePattern = /^\d{4}$/;

function isTenDigitPhone(value: string) {
  return value.replace(/\D/g, "").length === 10;
}

function isHttpUrl(value: string) {
  if (!value) return true;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const phoneSchema = z
  .string()
  .max(24)
  .refine(isTenDigitPhone, "Phone number must have exactly 10 digits.");
const urlOrEmptySchema = z
  .string()
  .max(2048)
  .refine(isHttpUrl, "URL must start with http:// or https://.");
const monthDateSchema = z
  .string()
  .max(7)
  .refine((value) => !value || monthDatePattern.test(value), "Use YYYY-MM format.");
const yearDateSchema = z
  .string()
  .max(4)
  .refine((value) => !value || yearDatePattern.test(value), "Use YYYY format.");

const additionalItemSchema = z
  .object({
    id: z.string().trim().min(1).max(128),
    name: z.string().max(200),
    issuer: z.string().max(200),
    date: z.string().max(40),
    link: z.string().max(2048),
    referenceId: z.string().max(200),
    description: z.string().max(5000),
    details: z.array(z.string().max(500)).max(50),
  })
  .strict();

const customSectionSchema = z
  .object({
    id: z.string().trim().min(1).max(128),
    kind: customKindSchema,
    title: z.string().max(120),
    items: z.array(additionalItemSchema).max(200),
    editableTitle: z.boolean().optional(),
  })
  .strict();

const sectionSchema = z
  .object({
    id: sectionIdSchema,
    label: z.string().max(80),
    visible: z.boolean(),
    order: z.number().int().min(0).max(1000),
  })
  .strict();

const masterProfileContentSchema = z
  .object({
    templateId: z.string().trim().min(1).max(64),
    basics: z
      .object({
        fullName: z.string().max(120),
        role: z.string().max(120),
        headline: z.string().max(250),
        email: z.string().email(),
        phone: phoneSchema,
        location: z.string().max(120),
        linkEmail: z.boolean(),
        linkPhone: z.boolean(),
        linkLocation: z.boolean(),
      })
      .strict(),
    links: z
      .object({
        displayMode: z.enum(["icon", "url", "icon-username"]),
        items: z
          .array(
            z
              .object({
                id: z.string().trim().min(1).max(128),
                type: linkTypeSchema,
                label: z.string().max(80),
                url: urlOrEmptySchema,
              })
              .strict(),
          )
          .max(50),
      })
      .strict(),
    summary: z.string().max(8000),
    experience: z
      .array(
        z
          .object({
            id: z.string().trim().min(1).max(128),
            company: z.string().max(160),
            role: z.string().max(160),
            location: z.string().max(120),
            startDate: monthDateSchema,
            endDate: monthDateSchema,
            current: z.boolean(),
            summary: z.string().max(5000),
            highlights: z.array(z.string().max(400)).max(50),
          })
          .strict(),
      )
      .max(200),
    education: z
      .array(
        z
          .object({
            id: z.string().trim().min(1).max(128),
            school: z.string().max(160),
            degree: z.string().max(160),
            field: z.string().max(160),
            startDate: yearDateSchema,
            endDate: yearDateSchema,
            current: z.boolean(),
            summary: z.string().max(5000),
          })
          .strict(),
      )
      .max(200),
    projects: z
      .array(
        z
          .object({
            id: z.string().trim().min(1).max(128),
            name: z.string().max(160),
            role: z.string().max(160),
            link: urlOrEmptySchema,
            linkLabel: z.string().max(80).default("Link"),
            showLinkAsText: z.boolean().default(true),
            summary: z.string().max(5000),
            highlights: z.array(z.string().max(400)).max(50),
            skills: z.array(z.string().max(80)).max(100).default([]),
          })
          .strict(),
      )
      .max(200),
    skills: z
      .array(
        z
          .object({
            id: z.string().trim().min(1).max(128),
            name: z.string().max(120),
            keywords: z.array(z.string().max(80)).max(100),
          })
          .strict(),
      )
      .max(200),
    languages: z
      .array(
        z
          .object({
            id: z.string().trim().min(1).max(128),
            language: z.string().max(80),
            fluency: z.enum(["elementary", "limited", "professional", "fluent", "native"]),
          })
          .strict(),
      )
      .max(200),
    interests: z
      .array(
        z
          .object({
            id: z.string().trim().min(1).max(128),
            name: z.string().max(120),
            keywords: z.array(z.string().max(80)).max(100),
          })
          .strict(),
      )
      .max(200),
    awards: z
      .array(
        z
          .object({
            id: z.string().trim().min(1).max(128),
            title: z.string().max(200),
            awarder: z.string().max(200),
            date: monthDateSchema,
            website: urlOrEmptySchema.optional(),
            description: z.string().max(5000),
            showLink: z.boolean(),
          })
          .strict(),
      )
      .max(200),
    certificates: z
      .array(
        z
          .object({
            id: z.string().trim().min(1).max(128),
            title: z.string().max(200),
            issuer: z.string().max(200),
            date: monthDateSchema,
            website: urlOrEmptySchema.optional(),
            description: z.string().max(5000),
            showLink: z.boolean(),
          })
          .strict(),
      )
      .max(200),
    publications: z
      .array(
        z
          .object({
            id: z.string().trim().min(1).max(128),
            title: z.string().max(200),
            publisher: z.string().max(200),
            date: monthDateSchema,
            website: urlOrEmptySchema.optional(),
            description: z.string().max(5000),
            showLink: z.boolean(),
          })
          .strict(),
      )
      .max(200),
    volunteer: z
      .array(
        z
          .object({
            id: z.string().trim().min(1).max(128),
            organization: z.string().max(200),
            role: z.string().max(160),
            startDate: monthDateSchema,
            endDate: monthDateSchema,
            current: z.boolean(),
            location: z.string().max(120),
            summary: z.string().max(5000),
          })
          .strict(),
      )
      .max(200),
    references: z
      .array(
        z
          .object({
            id: z.string().trim().min(1).max(128),
            name: z.string().max(160),
            title: z.string().max(160),
            organization: z.string().max(200),
            email: z.string().email().or(z.literal("")),
            phone: phoneSchema.or(z.literal("")),
            relationship: z.string().max(200),
          })
          .strict(),
      )
      .max(200),
    achievements: z
      .array(
        z
          .object({
            id: z.string().trim().min(1).max(128),
            title: z.string().max(200),
            description: z.string().max(5000),
          })
          .strict(),
      )
      .max(200),
    customSections: z.array(customSectionSchema).max(200),
    sections: z.array(sectionSchema).max(200),
    customization: z
      .object({
        accentColor: z.string().max(32),
        textColor: z.string().max(32),
        mutedTextColor: z.string().max(32),
        pageBackgroundColor: z.string().max(32),
        sectionBackgroundColor: z.string().max(32),
        borderColor: z.string().max(32),
        sectionHeadingColor: z.string().max(32),
        fontFamily: z.string().trim().min(1).max(32),
        sectionSpacing: z.number().min(0).max(120),
        pagePadding: z.number().min(0).max(120),
        bodyLineHeight: z.number().min(1).max(3),
        headingLineHeight: z.number().min(1).max(3),
      })
      .strict(),
    updatedAt: z.string().datetime().optional(),
  })
  .strict();

export const masterProfilePayloadSchema = z
  .object({
    profile: masterProfileContentSchema,
    expectedUpdatedAt: z.string().datetime().optional(),
  })
  .strict();

export type MasterProfilePayload = z.infer<typeof masterProfilePayloadSchema>;
