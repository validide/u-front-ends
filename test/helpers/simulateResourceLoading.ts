export type ExtendedGlobalThis = Window & {
  __test_uninstall_resource_simulation?: () => void;
};

export function installResourceSimulation(win: Window & typeof globalThis): () => void {
  // Install appendChild interceptor on this window's Element prototype so we
  // catch appendChild on any element (head, div, root, etc.). JSDOM creates
  // separate constructors per window so this is isolated per-test.
  const proto = win.Element?.prototype as unknown as Element & {
    __appendChildOriginal?: typeof Element.prototype.appendChild;
  };
  if (!proto) return () => {};
  if (proto.__appendChildOriginal) {
    // already installed
    return () => {};
  }

  proto.__appendChildOriginal = proto.appendChild;
  proto.appendChild = function <T extends Node>(this: Element, node: T): T {
    const el = node as unknown as HTMLElement & { src?: string; href?: string };

    // Scripts
    if (el.tagName === "SCRIPT") {
      const src = (el as HTMLScriptElement).src || "";
      const result = proto.__appendChildOriginal?.call(this, node) as T;
      setTimeout(() => {
        if (src.indexOf("404") !== -1) {
          el.dispatchEvent(new win.Event("error"));
        } else if (src.endsWith(".js")) {
          try {
            // run the expected script side-effect used in tests
            win.eval(
              "var el = window.document.createElement('div'); el.id = 'testId'; window.document.body.appendChild(el);",
            );
            el.dispatchEvent(new win.Event("load"));
          } catch (_e) {
            el.dispatchEvent(new win.Event("error"));
          }
        } else {
          el.dispatchEvent(new win.Event("error"));
        }
      }, 0);

      return result;
    }

    // Links (stylesheets)
    if (el.tagName === "LINK") {
      const href = (el as HTMLLinkElement).href || "";
      const result = proto.__appendChildOriginal?.call(this, node) as T;
      setTimeout(() => {
        if (href.indexOf("404") !== -1) {
          el.dispatchEvent(new win.Event("error"));
        } else if (href.endsWith(".css")) {
          try {
            const style = win.document.createElement("style");
            style.textContent = "body { color: red; }";
            win.document.head.appendChild(style);
            el.dispatchEvent(new win.Event("load"));
          } catch (_e) {
            el.dispatchEvent(new win.Event("error"));
          }
        } else {
          el.dispatchEvent(new win.Event("error"));
        }
      }, 0);

      return result;
    }

    // Iframes (embedded content)
    if (el.tagName === "IFRAME") {
      const src = (el as HTMLIFrameElement).src || "";
      const result = proto.__appendChildOriginal?.call(this, node) as T;
      setTimeout(() => {
        if (src.indexOf("error") !== -1 || src.indexOf("iframe-error") !== -1) {
          el.dispatchEvent(new win.Event("error"));
        } else if (src) {
          try {
            const iframeEl = el as HTMLIFrameElement;
            // Ensure a minimal contentWindow exists for tests that check it
            if (!iframeEl.contentWindow) {
              (iframeEl as unknown as { contentWindow: Window }).contentWindow = {} as Window;
            }
            el.dispatchEvent(new win.Event("load"));
          } catch (_e) {
            el.dispatchEvent(new win.Event("error"));
          }
        } else {
          el.dispatchEvent(new win.Event("error"));
        }
      }, 0);

      return result;
    }

    return proto.__appendChildOriginal?.call(this, node) as T;
  } as unknown as typeof proto.appendChild;

  return function uninstall() {
    try {
      if (proto.__appendChildOriginal) {
        proto.appendChild = proto.__appendChildOriginal;
        delete proto.__appendChildOriginal;
      }
    } catch {
      // ignore
    }
  };
}
