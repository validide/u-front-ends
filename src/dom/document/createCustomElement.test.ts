import { JSDOM } from "jsdom";
import { beforeEach, describe, expect, it } from "vitest";
import { values_falsies } from "../../../test/utils";
import { createCustomEvent } from "./createCustomEvent";

function getNewDocument(): Document {
  return new JSDOM("<!DOCTYPE html>").window.document;
}

describe("generateUniqueId", () => {
  let doc = getNewDocument();
  beforeEach(() => {
    doc = getNewDocument();
  });

  values_falsies.forEach((f) => {
    it("should return an id that is unique within the DOM", () => {
      expect(() => createCustomEvent(f as unknown as Document, "")).to.throw("Document does not have a default view.");
    });
  });

  it("should return a custom event", () => {
    expect(createCustomEvent(doc, "test").type).to.eq("test");
  });

  it("should return a custom event using polyfill", () => {
    Object.defineProperty(doc, "defaultView", {
      value: {},
      writable: false,
    });

    const cEvt = createCustomEvent(doc, "test");
    expect(cEvt.type).to.eq("test");
  });
});
