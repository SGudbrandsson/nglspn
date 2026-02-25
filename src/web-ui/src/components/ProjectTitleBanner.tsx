"use client";

import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/api";

interface ProjectTitleBannerProps {
  project: Project;
}

export function ProjectTitleBanner({ project }: ProjectTitleBannerProps) {
  const authorName =
    [project.owner.first_name, project.owner.last_name]
      .filter(Boolean)
      .join(" ") || "Anonymous";

  const mainImage = project.images?.find((img) => img.is_main) || project.images?.[0];

  return (
    <section className="relative bg-white border-b border-border py-10 px-4 sm:px-6 overflow-visible">
      <div className="max-w-4xl mx-auto flex items-start gap-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground tracking-tight">
            {project.title || "Untitled Project"}
          </h1>
          {project.tagline && (
            <p className="text-muted-foreground text-sm mt-1">{project.tagline}</p>
          )}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground mt-3">
            <Link
              href={`/users/${project.owner.id}`}
              className="text-foreground hover:text-accent transition-colors"
            >
              {authorName}
            </Link>
          </div>
        </div>

        {mainImage && (
          <div className="hidden sm:block relative flex-shrink-0 w-40 h-28 -mt-2 -mb-8 z-10">
            <Image
              src={mainImage.url}
              alt={project.title}
              fill
              sizes="160px"
              className="object-cover rounded-lg shadow-lg border border-border"
              style={{
                transform: "rotate(2deg) translateY(8px)",
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
