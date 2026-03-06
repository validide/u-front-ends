import { describe, expect, it } from "vitest";
import { getRandomString, getUuidV4 } from "./random";

describe("getRandomString", () => {
  it("should return a non empty string", () => {
    const values: string[] = [];
    for (let index = 0; index < 100; index++) {
      const value = getRandomString();
      expect(value.length).to.not.be.eq(0);
      values.push(value);
    }

    values.forEach((v, i, arr) => {
      expect(arr.indexOf(v)).to.be.eq(i);
    });
  });
});

describe("getUuidV4", () => {
  it("should return a non empty string", () => {
    const values: string[] = [];
    for (let index = 0; index < 100; index++) {
      const value = getUuidV4();
      expect(value.length).to.not.be.eq(0);
      values.push(value);
    }

    values.forEach((v, i, arr) => {
      expect(arr.indexOf(v)).to.be.eq(i);
    });
  });
});
