import { JSDOM } from "jsdom";
import { beforeEach, describe, expect, it } from "vitest";
import { getUrlOrigin } from "./getUrlOrigin";

describe("getUrlOrigin", () => {
  let doc: Document;
  beforeEach(() => {
    doc = new JSDOM("<!DOCTYPE html>").window.document;
  });

  it('should return empty string if url is "undefined", "null" or empty string', () => {
    expect(getUrlOrigin(doc, undefined as unknown as string)).to.eq("");
    expect(getUrlOrigin(doc, null as unknown as string)).to.eq("");
    expect(getUrlOrigin(doc, "")).to.eq("");
  });

  it('should throw an error if document is "undefined"', () => {
    expect(() => getUrlOrigin(undefined as unknown as Document, "some value")).throws(
      Error,
      "Cannot read properties of undefined (reading 'createElement')",
    );
  });

  it('should throw an error if document is "null"', () => {
    expect(() => getUrlOrigin(null as unknown as Document, "some value")).throws(
      Error,
      "Cannot read properties of null (reading 'createElement')",
    );
  });

  it("should return origin", () => {
    expect(getUrlOrigin(doc, "http://localhost")).to.eq("http://localhost");
    expect(getUrlOrigin(doc, "http://localhost:81")).to.eq("http://localhost:81");
    expect(getUrlOrigin(doc, "http://localhost/")).to.eq("http://localhost");
    expect(getUrlOrigin(doc, "http://localhost:81/")).to.eq("http://localhost:81");
    expect(getUrlOrigin(doc, "https://localhost:443/sasasasa")).to.eq("https://localhost");
    expect(getUrlOrigin(doc, "https://localhost:444/sasasasa")).to.eq("https://localhost:444");
  });
});
