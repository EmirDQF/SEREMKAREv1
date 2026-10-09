import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("keeps brand type sizes when a text color is added", () => {
    expect(cn("text-h2 mt-4", "text-white")).toBe("text-h2 mt-4 text-white");
    expect(cn("text-display", "text-heading")).toBe("text-display text-heading");
  });

  it("still resolves conflicts between brand type sizes", () => {
    expect(cn("text-h2", "text-h3")).toBe("text-h3");
  });
});

describe("cx", () => {
  it("joins truthy classes without merging Tailwind conflicts", async () => {
    const { cx } = await import("@/lib/cx");
    expect(cx("a", false, null, undefined, "b")).toBe("a b");
    expect(cx("px-2", "px-4")).toBe("px-2 px-4");
  });
});
