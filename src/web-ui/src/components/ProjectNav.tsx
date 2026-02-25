"use client";

import Link from "next/link";

interface ProjectNavProps {
  projectId: string;
  active: "info" | "discussions";
}

export function ProjectNav({ projectId, active }: ProjectNavProps) {
  const tabs = [
    { key: "info" as const, label: "Info", href: `/projects/${projectId}` },
    {
      key: "discussions" as const,
      label: "Discussions",
      href: `/projects/${projectId}/discussions`,
    },
  ];

  return (
    <nav className="border-b border-border bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex gap-6">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={tab.href}
            className={`py-3 text-sm font-medium border-b-2 transition-colors ${
              active === tab.key
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
