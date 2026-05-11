"use client";

import { ReactNode } from "react";

import { Card } from "@veriworkly/ui";

import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
  blurPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export const AuthCard = ({ children, className, blurPosition = "top-left" }: AuthCardProps) => {
  const blurClasses = {
    "top-left": "-top-20 -left-16",
    "top-right": "-top-20 -right-20",
    "bottom-left": "-bottom-20 -left-20",
    "bottom-right": "-bottom-20 -right-20",
  };

  return (
    <Card className={cn("relative min-h-140 overflow-hidden rounded-4xl p-7", className)}>
      <div
        className={cn(
          "bg-accent/12 pointer-events-none absolute h-52 w-52 rounded-full blur-3xl",
          blurClasses[blurPosition],
        )}
      />
      <div className="relative space-y-6">{children}</div>
    </Card>
  );
};
