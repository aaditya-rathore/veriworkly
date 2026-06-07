export type BillingSummary = {
  plan: "FREE" | "PORTFOLIO_PRO";
  status: string;
  interval: "SEVEN_DAY" | "MONTHLY" | "ANNUAL" | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  graceEndsAt: string | null;
  canPublish: boolean;
  eligibleForTrial: boolean;
};
export type BillingActivity = {
  id: string;
  type: string;
  processedAt: string | null;
  createdAt: string;
};
