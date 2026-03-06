import { JSDOM, VirtualConsole } from "jsdom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { type ExtendedGlobalThis, installResourceSimulation } from "../../../test/helpers/simulateResourceLoading";
import { loadResource, noop } from "../../index";

// We simulate resource loading by intercepting head.appendChild so tests don't
// depend on jsdom internal resource loader API which changed in v28.

describe("loadResource", () => {
  let _jsDom: JSDOM;
  let _win: Window & typeof globalThis;

  beforeEach(() => {
    const virtualConsole = new VirtualConsole();
    virtualConsole.on("jsdomError", noop);
    _jsDom = new JSDOM(undefined, {
      url: "http://localhost:8080/",
      runScripts: "dangerously",
      virtualConsole: virtualConsole,
    });
    if (!_jsDom.window?.document?.defaultView) throw new Error("Setup failure!");
    _win = _jsDom.window.document.defaultView;
    const uninstall = installResourceSimulation(_win);
    // store uninstall so afterEach can call it
    (globalThis as unknown as ExtendedGlobalThis).__test_uninstall_resource_simulation = uninstall;
  });

  afterEach(() => {
    try {
      const uninstall = (globalThis as unknown as ExtendedGlobalThis).__test_uninstall_resource_simulation as
        | (() => void)
        | undefined;
      if (uninstall) {
        uninstall();
        delete (globalThis as unknown as ExtendedGlobalThis).__test_uninstall_resource_simulation;
      }
    } catch {
      // ignore
    }
    _win?.close();
    _jsDom.window.close();
  });

  it("should reject if load fails", async () => {
    const url = "http://test.com/404.js";
    try {
      const prom = loadResource(_win.document, url, true, undefined, undefined);
      expect(_win.document.querySelectorAll(`script[src="${url}"]`).length).to.eq(1);
      await prom;
    } catch (e) {
      expect((e as Error).message).to.eq(`Script load error for url: ${url}.`);
    }
  });

  it("should load and run script", async () => {
    const url = "http://test.com/test.js";
    const prom = loadResource(_win.document, url);
    expect(_win.document.querySelectorAll(`script[src="${url}"]`).length).to.eq(1);
    await prom;
    expect(_win.document.getElementById("testId")).not.to.be.null;
  });

  it("should load css", async () => {
    const url = "http://test.com/test.css";
    const prom = loadResource(_win.document, url, false, undefined, {
      rel: "stylesheet",
    });
    expect(_win.document.querySelectorAll(`link[href="${url}"]`).length).to.eq(1);
    await prom;
    expect(_win.document.defaultView?.getComputedStyle(_win.document.body).color || "null").to.be.oneOf([
      "red",
      "rgb(255, 0, 0)",
    ]);
  });

  it("should skip loading", async () => {
    const url = "http://test.com/test.js";
    const prom = loadResource(_win.document, url, true, () => true, undefined);
    expect(_win.document.querySelectorAll(`script[src="${url}"]`).length).to.eq(0);
    await prom;
    expect(_win.document.getElementById("testId")).to.be.null;
  });
});
