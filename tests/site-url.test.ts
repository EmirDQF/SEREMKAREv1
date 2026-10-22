import { describe, expect, it } from "vitest";
import { DEFAULT_SITE_URL, resolveSiteUrl } from "@/lib/site-url";

describe("resolveSiteUrl (NEXT_PUBLIC_SITE_URL)", () => {
  it("uses the default domain when the variable is missing or blank", () => {
    expect(resolveSiteUrl(undefined)).toEqual({ ok: true, url: DEFAULT_SITE_URL, usedDefault: true });
    expect(resolveSiteUrl("   ")).toEqual({ ok: true, url: DEFAULT_SITE_URL, usedDefault: true });
  });

  it("accepts the usual panel typos: spaces, trailing slash, missing https://", () => {
    expect(resolveSiteUrl(" https://sermekare.com/ ")).toMatchObject({ ok: true, url: "https://sermekare.com" });
    expect(resolveSiteUrl("sermekare.com")).toMatchObject({ ok: true, url: "https://sermekare.com" });
    expect(resolveSiteUrl("HTTPS://www.sermekare.com")).toMatchObject({ ok: true, url: "https://www.sermekare.com" });
  });

  it("rejects impossible values with an actionable Spanish message", () => {
    const result = resolveSiteUrl("sermekare");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("NEXT_PUBLIC_SITE_URL");
      expect(result.error).toContain("https://sermekare.com");
    }
    expect(resolveSiteUrl("https://exa mple.com").ok).toBe(false);
  });
});
