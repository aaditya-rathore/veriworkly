import type { Metadata } from "next";
import { PortfolioEditorWorkspace } from "@/components/PortfolioEditorWorkspace";
import { fetchServerApiData } from "@/lib/server-api";
import type { PortfolioWorkspaceBootstrap } from "@/store/portfolio-store";

export const metadata: Metadata = { title: "Editor", robots: { index: false, follow: false } };

export default async function EditorPage() {
  const [user, workspace, analytics] = await Promise.all([
    fetchServerApiData<PortfolioWorkspaceBootstrap["user"]>("/users/me"),
    fetchServerApiData<PortfolioWorkspaceBootstrap["workspace"]>("/portfolios/me"),
    fetchServerApiData<PortfolioWorkspaceBootstrap["analytics"]>("/portfolios/analytics"),
  ]);
  return <PortfolioEditorWorkspace initialData={{ user, workspace, analytics }} />;
}
