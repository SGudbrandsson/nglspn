import { beforeEach, describe, expect, it, vi } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";

import type { Project } from "@/lib/api";

const { authState, push } = vi.hoisted(() => ({
  authState: { value: { user: null as { email: string } | null } },
  push: vi.fn(),
}));

vi.mock("@/contexts/auth", () => ({ useAuth: () => authState.value }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  usePathname: () => "/projects/dead-app",
}));
vi.mock("@/components/FollowButton", () => ({ FollowButton: () => null }));
vi.mock("@/components/TipoffBadge", () => ({ TipoffBadge: () => null }));
vi.mock("@/lib/api", () => ({ api: { projects: { report: vi.fn() } } }));

const { ProjectTitleBanner } = await import("./ProjectTitleBanner");

const PROJECT = {
  id: "p1",
  slug: "dead-app",
  title: "Dead App",
  tagline: "",
  website_url: "https://dead.example",
  status: "approved",
  is_community_tipoff: false,
  contributors: [],
} as unknown as Project;

let root: Root;
let container: HTMLElement;

async function mount() {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  await act(async () => root.render(<ProjectTitleBanner project={PROJECT} />));
}

function reportButton() {
  return Array.from(container.querySelectorAll("button")).find((b) =>
    b.textContent?.includes("Site not working?"),
  ) as HTMLButtonElement;
}

describe("ProjectTitleBanner report link", () => {
  beforeEach(() => {
    push.mockReset();
    authState.value = { user: null };
  });

  it("sends a signed-out visitor to log in, then back to the project", async () => {
    await mount();
    await act(async () => reportButton().click());

    expect(push).toHaveBeenCalledWith("/login?next=%2Fprojects%2Fdead-app");
    expect(container.textContent).not.toContain("Send report");
    act(() => root.unmount());
    container.remove();
  });

  it("opens the report dialog for a signed-in user", async () => {
    authState.value = { user: { email: "me@example.com" } };
    await mount();
    await act(async () => reportButton().click());

    expect(push).not.toHaveBeenCalled();
    expect(document.body.textContent).toContain("Send report");
    act(() => root.unmount());
    container.remove();
  });
});
