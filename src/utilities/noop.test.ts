import { describe, expect, it } from "vitest";
import { noop } from "./noop";

describe("noop", () => {
  it("should return void", () => {
    expect(noop()).to.be.undefined;
  });
});
