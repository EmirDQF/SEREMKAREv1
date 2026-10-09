import { describe, expect, it } from "vitest";
import { pickDeviceTier, type TierSignals } from "@/lib/device-tier";

const base: TierSignals = {
  memoryGb: 8,
  cores: 8,
  saveData: false,
  effectiveType: "4g",
  reducedMotion: false,
};

describe("pickDeviceTier", () => {
  it("high-end devices get full 3D", () => {
    expect(pickDeviceTier(base)).toBe("high");
  });

  it.each([
    ["data saver on", { saveData: true }],
    ["slow-2g", { effectiveType: "slow-2g" }],
    ["2g", { effectiveType: "2g" }],
    ["3g", { effectiveType: "3g" }],
    ["reduced motion", { reducedMotion: true }],
    ["2 GB of RAM", { memoryGb: 2 }],
    ["2 cores", { cores: 2 }],
    ["a phone (touch, small screen), even a powerful one", { phone: true }],
  ] as const)("%s → low (three.js is never downloaded)", (_label, patch) => {
    expect(pickDeviceTier({ ...base, ...patch })).toBe("low");
  });

  it("mid-range devices get simplified 3D", () => {
    expect(pickDeviceTier({ ...base, memoryGb: 4, cores: 4 })).toBe("mid");
  });

  it("unknown memory (Safari/Firefox) relies on cores and network", () => {
    expect(pickDeviceTier({ ...base, memoryGb: undefined, cores: 8 })).toBe("high");
    expect(pickDeviceTier({ ...base, memoryGb: undefined, cores: 4 })).toBe("mid");
  });

  it("unknown network type does not penalize", () => {
    expect(pickDeviceTier({ ...base, effectiveType: undefined })).toBe("high");
  });
});
