import { LayoutGrid, Map, Terminal, Newspaper, BookOpen } from "lucide-react";

export const NAVIGATION_ITEMS = [
  { name: "Templates", href: "/templates", icon: LayoutGrid },
  { name: "Roadmap", href: "/roadmap", icon: Map },
  { name: "Development", href: "/stats", icon: Terminal },
  { name: "Blog", href: "https://blogs.veriworkly.com", external: true, icon: Newspaper },
  { name: "Docs", href: "https://docs.veriworkly.com", external: true, icon: BookOpen },
];
