function customEventPolyfill<T>(this: any, document: Document, typeArg: string, eventInitDict?: CustomEventInit<T>): CustomEvent<T> {
  const params = eventInitDict || { bubbles: false, cancelable: false, detail: null };
  const evt = document.createEvent( 'CustomEvent' );
  evt.initCustomEvent(typeArg, params.bubbles || false, params.cancelable || false, params.detail );
  return evt;
 }

export function createCustomEvent<T>(document: Document, typeArg: string, eventInitDict?: CustomEventInit<T>): CustomEvent<T> {
  const win: any = document?.defaultView;
  if (!win)
    throw new Error('Document does not have a defualt view.');

  if (typeof win.CustomEvent !== 'function') {
    return new (customEventPolyfill as any)(document, typeArg, eventInitDict);
  }

  return new win.CustomEvent(typeArg, eventInitDict);
}
