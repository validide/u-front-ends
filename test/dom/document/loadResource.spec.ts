import { type AbortablePromise, type FetchOptions, JSDOM, ResourceLoader, VirtualConsole } from "jsdom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { loadResource, noop } from "../../../src/index";

class CustomResourceLoader extends ResourceLoader {
  fetch(url: string, _options: FetchOptions): AbortablePromise<Buffer> | null {
    // if (url.endsWith('.js') && options.element?.constructor.name !== 'HTMLScriptElement') {
    //   return Promise.reject(new Error('Requested JS with WRONG element.'));
    // }

    if (url.indexOf("404") !== -1) {
      return Promise.reject(new Error("404")) as AbortablePromise<Buffer>;
    }

    if (url.endsWith(".js")) {
      return Promise.resolve(
        Buffer.from(`
      var el = window.document.createElement('div');
      el.id = 'testId';
      window.document.body.appendChild(el);
      `),
      ) as AbortablePromise<Buffer>;
    }

    if (url.endsWith(".css")) {
      return Promise.resolve(Buffer.from("body {color: red;}")) as AbortablePromise<Buffer>;
    }

    return Promise.reject(new Error("404")) as AbortablePromise<Buffer>;
  }
}

describe("loadResource", () => {
  let _jsDom: JSDOM;
  let _win: Window;

  beforeEach(() => {
    const loader = new CustomResourceLoader();
    const virtualConsole = new VirtualConsole();
    virtualConsole.on("jsdomError", noop);
    _jsDom = new JSDOM(undefined, {
      url: "http://localhost:8080/",
      runScripts: "dangerously",
      resources: loader,
      virtualConsole: virtualConsole,
    });
    if (!_jsDom.window?.document?.defaultView) throw new Error("Setup failure!");
    _win = _jsDom.window.document.defaultView;
  });

  afterEach(() => {
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
