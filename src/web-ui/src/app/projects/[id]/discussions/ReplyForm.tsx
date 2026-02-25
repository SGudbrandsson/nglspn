"use client";

import { useState } from "react";

interface ReplyFormProps {
  onSubmit: (body: string) => Promise<void>;
  onCancel: () => void;
}

export function ReplyForm({ onSubmit, onCancel }: ReplyFormProps) {
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit(body.trim());
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write a reply..."
        rows={2}
        className="input flex-1 resize-none text-sm"
        autoFocus
      />
      <div className="flex flex-col gap-1">
        <button
          type="submit"
          disabled={submitting || !body.trim()}
          className="btn-primary text-xs disabled:opacity-50"
        >
          {submitting ? "..." : "Reply"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
