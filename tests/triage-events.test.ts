import { describe, expect, it } from "vitest";
import { readTriageTarget, triageTargetAttributes, type TriageTarget } from "@/lib/triage-events";

/** Elemento mínimo con getAttribute (los tests corren sin DOM). */
function elementWith(attributes: Record<string, string>): Element {
  return { getAttribute: (name: string) => attributes[name] ?? null } as unknown as Element;
}

describe("triage target attributes", () => {
  it("round-trips a zone and a condition through data attributes", () => {
    const zone: TriageTarget = { kind: "zone", zone: "rodillas" };
    const condition: TriageTarget = { kind: "condition", slug: "osteoporosis" };
    expect(readTriageTarget(elementWith(triageTargetAttributes(zone)))).toEqual(zone);
    expect(readTriageTarget(elementWith(triageTargetAttributes(condition)))).toEqual(condition);
  });

  it("returns null when the attributes are missing or unknown", () => {
    expect(readTriageTarget(elementWith({}))).toBeNull();
    expect(readTriageTarget(elementWith({ "data-triage-kind": "otro", "data-triage-value": "x" }))).toBeNull();
    expect(readTriageTarget(elementWith({ "data-triage-kind": "zone" }))).toBeNull();
  });
});
