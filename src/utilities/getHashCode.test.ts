import { describe, expect, it } from "vitest";
import { getHashCode } from "./getHashCode";

describe("getHashCode", () => {
  it("should return same value for identical input", () => {
    const value = "some string";
    expect(getHashCode(value)).to.eq(getHashCode(value));
    expect(getHashCode("")).to.be.eq(0);
  });
});
