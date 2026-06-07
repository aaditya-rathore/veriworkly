import { fetchApiData } from "@/utils/fetchApiData";

export function beginCheckout(interval: "seven_day" | "monthly" | "annual") {
  return fetchApiData<{ url: string }>("/billing/checkout", {
    method: "POST",
    body: JSON.stringify({ interval, redirectUrl: "/billing" }),
  });
}
export function openBillingPortal() {
  return fetchApiData<{ url: string }>("/billing/portal", { method: "POST", body: "{}" });
}
