import { describe, expect, it } from "vitest";
import { noop } from "../../src/utilities/noop";

describe("noop", () => {
  it("should return void", () => {
    expect(noop()).to.be.undefined;
  });
});
