import type { Metadata } from "next";
import { PortfolioSettingsWorkspace } from "@/components/PortfolioSettingsWorkspace";
import { fetchServerApiData } from "@/lib/server-api";
import type { PortfolioWorkspaceBootstrap } from "@/store/portfolio-store";

export const metadata: Metadata = { title: "Settings", robots: { index: false, follow: false } };
export default async function SettingsPage() {
  const [user, workspace] = await Promise.all([
    fetchServerApiData<PortfolioWorkspaceBootstrap["user"]>("/users/me"),
    fetchServerApiData<PortfolioWorkspaceBootstrap["workspace"]>("/portfolios/me"),
  ]);
  return <PortfolioSettingsWorkspace initialData={{ user, workspace, analytics: null }} />;
}
