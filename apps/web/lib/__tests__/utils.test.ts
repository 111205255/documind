import { describe, expect, it } from "vitest";
import { formatApiError } from "@/lib/api-error";
import { safeRedirectPath } from "@/lib/safe-redirect";

describe("formatApiError", () => {
  it("returns friendly quota message", () => {
    expect(formatApiError('{"detail":"429 quota exceeded"}')).toContain("quota");
  });

  it("unwraps JSON detail", () => {
    expect(formatApiError('{"detail":"Sign in required."}')).toBe("Sign in required.");
  });
});

describe("safeRedirectPath", () => {
  it("allows relative paths", () => {
    expect(safeRedirectPath("/home")).toBe("/home");
  });

  it("blocks open redirects", () => {
    expect(safeRedirectPath("//evil.com")).toBe("/home");
    expect(safeRedirectPath("https://evil.com")).toBe("/home");
  });
});
