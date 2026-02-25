"use client";

import { useEffect, useState, use } from "react";
import { ProjectTitleBanner } from "@/components/ProjectTitleBanner";
import { ProjectNav } from "@/components/ProjectNav";
import { useAuth } from "@/contexts/auth";
import { api } from "@/lib/api";
import type { Project, Discussion } from "@/lib/api";
import { DiscussionList } from "./DiscussionList";
import { NewDiscussionForm } from "./NewDiscussionForm";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DiscussionsPage({ params }: PageProps) {
  const { id } = use(params);
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.projects
      .get(id)
      .then(setProject)
      .catch(() => setError("Project not found"));
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated || authLoading) return;
    let cancelled = false;
    api.discussions
      .list(id)
      .then((data) => {
        if (!cancelled) setDiscussions(data);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load discussions");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id, isAuthenticated, authLoading]);

  const handleNewDiscussion = async (body: string) => {
    const discussion = await api.discussions.create(id, body);
    setDiscussions((prev) => [discussion, ...prev]);
  };

  const handleReply = async (discussionId: string, body: string) => {
    const reply = await api.discussions.reply(id, discussionId, body);
    setDiscussions((prev) =>
      prev.map((d) =>
        d.id === discussionId
          ? { ...d, replies: [...d.replies, reply] }
          : d
      )
    );
  };

  const handleDelete = async (discussionId: string) => {
    await api.discussions.delete(id, discussionId);
    setDiscussions((prev) => {
      // Remove if it's a root discussion
      const filtered = prev.filter((d) => d.id !== discussionId);
      // Remove if it's a reply
      return filtered.map((d) => ({
        ...d,
        replies: d.replies.filter((r) => r.id !== discussionId),
      }));
    });
  };

  if (!project && !error) {
    return (
      <main className="min-h-screen bg-muted pt-14">
        <div className="bg-white border-b border-border py-10 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="skeleton h-8 w-64 mb-2" />
            <div className="skeleton h-4 w-48" />
          </div>
        </div>
      </main>
    );
  }

  if (error && !project) {
    return (
      <main className="min-h-screen bg-muted pt-14">
        <section className="py-20 px-4 text-center">
          <p className="text-muted-foreground">{error}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted pt-14">
      {project && (
        <>
          <ProjectTitleBanner project={project} />
          <ProjectNav projectId={id} active="discussions" />
        </>
      )}

      <section className="py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {authLoading ? (
            <div className="space-y-4">
              <div className="skeleton h-20 w-full rounded-lg" />
              <div className="skeleton h-20 w-full rounded-lg" />
            </div>
          ) : !isAuthenticated ? (
            <div className="bg-white rounded-xl border border-border p-8 text-center">
              <h2 className="text-lg font-semibold text-foreground mb-2">
                Join the conversation
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                Sign up or log in to view and participate in discussions about
                this project.
              </p>
              <div className="flex justify-center gap-3">
                <Link href="/login" className="btn-primary">
                  Log in
                </Link>
                <Link href="/register" className="btn-secondary">
                  Sign up
                </Link>
              </div>
            </div>
          ) : (
            <>
              <NewDiscussionForm onSubmit={handleNewDiscussion} />

              {loading ? (
                <div className="space-y-4 mt-6">
                  <div className="skeleton h-20 w-full rounded-lg" />
                  <div className="skeleton h-20 w-full rounded-lg" />
                </div>
              ) : (
                <DiscussionList
                  discussions={discussions}
                  currentUserId={user?.id}
                  onReply={handleReply}
                  onDelete={handleDelete}
                />
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
