import { PortfolioAppShell } from "@/components/PortfolioAppShell";
import { fetchServerApiData } from "@/lib/server-api";
import type { PortfolioWorkspaceBootstrap } from "@/store/portfolio-store";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, workspace] = await Promise.all([
    fetchServerApiData<PortfolioWorkspaceBootstrap["user"]>("/users/me"),
    fetchServerApiData<PortfolioWorkspaceBootstrap["workspace"]>("/portfolios/me"),
  ]);

  return <PortfolioAppShell user={user} workspace={workspace}>{children}</PortfolioAppShell>;
}
