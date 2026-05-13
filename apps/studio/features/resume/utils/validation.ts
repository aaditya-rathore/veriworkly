import type {
  ResumeBasics,
  ResumeLinkItem,
  ResumeEducationItem,
  ResumeExperienceItem,
  ResumeProjectItem,
  ResumeSkillGroup,
} from "@/types/resume";
import {
  isHttpUrl,
  isMonthDate,
  isTenDigitPhone,
  isYearDate,
} from "@/features/resume/schemas/resume-validation-rules";

export type ValidationErrors<T extends string> = Partial<Record<T, string>>;

export function validateBasics(
  basics: ResumeBasics,
): ValidationErrors<"fullName" | "role" | "headline" | "email" | "phone" | "location"> {
  const errors: ValidationErrors<
    "fullName" | "role" | "headline" | "email" | "phone" | "location"
  > = {};

  if (!basics.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (!basics.headline.trim()) {
    errors.headline = "Headline is required.";
  }

  if (!basics.role.trim()) {
    errors.role = "Role is required.";
  }

  if (!basics.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(basics.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!basics.phone.trim()) {
    errors.phone = "Phone is required.";
  } else if (!isTenDigitPhone(basics.phone)) {
    errors.phone = "Phone number must have exactly 10 digits.";
  }

  if (!basics.location.trim()) {
    errors.location = "Location is required.";
  }

  return errors;
}

export function validateLinkItem(item: ResumeLinkItem): ValidationErrors<"label" | "url"> {
  const errors: ValidationErrors<"label" | "url"> = {};

  if (!isHttpUrl(item.url)) {
    errors.url = "Use a valid URL starting with http:// or https://.";
  }

  return errors;
}

export function validateSummary(summary: string): ValidationErrors<"summary"> {
  const errors: ValidationErrors<"summary"> = {};

  if (!summary.trim()) {
    errors.summary = "Summary is required.";
  } else if (summary.trim().length < 30) {
    errors.summary = "Summary should be at least 30 characters.";
  }

  return errors;
}

export function validateExperience(
  item: ResumeExperienceItem,
): ValidationErrors<"role" | "company" | "location" | "startDate" | "endDate" | "summary"> {
  const errors: ValidationErrors<
    "role" | "company" | "location" | "startDate" | "endDate" | "summary"
  > = {};

  if (!item.role.trim()) {
    errors.role = "Role is required.";
  }

  if (!item.company.trim()) {
    errors.company = "Company is required.";
  }

  if (!item.location.trim()) {
    errors.location = "Location is required.";
  }

  if (!isMonthDate(item.startDate)) {
    errors.startDate = "Use YYYY-MM format.";
  }

  if (!isMonthDate(item.endDate) && !item.current) {
    errors.endDate = "Use YYYY-MM format.";
  }

  if (!item.summary.trim()) {
    errors.summary = "Summary is required.";
  }

  return errors;
}

export function validateEducation(
  item: ResumeEducationItem,
): ValidationErrors<"school" | "degree" | "field" | "startDate" | "endDate"> {
  const errors: ValidationErrors<"school" | "degree" | "field" | "startDate" | "endDate"> = {};

  if (!item.school.trim()) {
    errors.school = "School is required.";
  }

  if (!item.degree.trim()) {
    errors.degree = "Degree is required.";
  }

  if (!item.field.trim()) {
    errors.field = "Field is required.";
  }

  if (!isYearDate(item.startDate)) {
    errors.startDate = "Use YYYY format.";
  }

  if (!isYearDate(item.endDate) && !item.current) {
    errors.endDate = "Use YYYY format.";
  }

  return errors;
}

export function validateProject(
  item: ResumeProjectItem,
): ValidationErrors<"name" | "role" | "link" | "summary"> {
  const errors: ValidationErrors<"name" | "role" | "link" | "summary"> = {};

  if (!item.name.trim()) {
    errors.name = "Project name is required.";
  }

  if (!item.role.trim()) {
    errors.role = "Role is required.";
  }

  if (!isHttpUrl(item.link)) {
    errors.link = "Use a valid URL starting with http:// or https://";
  }

  if (!item.summary.trim()) {
    errors.summary = "Summary is required.";
  }

  return errors;
}

export function validateSkillGroup(item: ResumeSkillGroup): ValidationErrors<"name" | "keywords"> {
  const errors: ValidationErrors<"name" | "keywords"> = {};

  if (!item.name.trim()) {
    errors.name = "Group name is required.";
  }

  if (!item.keywords.length) {
    errors.keywords = "Add at least one skill.";
  }

  return errors;
}
