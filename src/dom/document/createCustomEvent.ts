function customEventPolyfill<T>(
  this: Document,
  document: Document,
  typeArg: string,
  eventInitDict?: CustomEventInit<T>,
): CustomEvent<T> {
  const params = eventInitDict || { bubbles: false, cancelable: false, detail: null };
  const evt = document.createEvent("CustomEvent");
  evt.initCustomEvent(typeArg, params.bubbles || false, params.cancelable || false, params.detail);
  return evt;
}

export function createCustomEvent<T>(
  document: Document,
  typeArg: string,
  eventInitDict?: CustomEventInit<T>,
): CustomEvent<T> {
  const win = document?.defaultView as Window | undefined;
  if (!win) throw new Error("Document does not have a default view.");

  const anyWin = win as unknown as { CustomEvent?: unknown } & Record<string, unknown>;

  if (typeof (anyWin.CustomEvent as unknown) !== "function") {
    return new (
      customEventPolyfill as unknown as new (
        d: Document,
        t: string,
        e?: CustomEventInit<T>,
      ) => CustomEvent<T>
    )(document, typeArg, eventInitDict);
  }

  return new (
    anyWin.CustomEvent as unknown as new (
      type: string,
      eventInitDict?: CustomEventInit<T>,
    ) => CustomEvent<T>
  )(typeArg, eventInitDict);
}
