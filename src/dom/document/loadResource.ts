/**
 * A function to load a resource and wait for it to load.
 *
 * @param document The reference to the document object.
 * @param url The resource URL.
 * @param isScript Is this resource a script or a stylesheet?
 * @param skipLoading Function to determine if the resource should not be loaded.
 * @param attributes Extra attributes to add on the HTML element before attaching it to the document.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function loadResource(
  document: Document,
  url: string,
  isScript = true,
  skipLoading?: () => boolean,
  attributes?: { [key: string]: string }
): Promise<void> {
  if (skipLoading && skipLoading())
    return Promise.resolve();

  return new Promise<void>((resolve, reject) => {
    let resource: HTMLScriptElement | HTMLLinkElement;

    if (isScript) {
      resource = document.createElement('script');
      (resource ).src = url;
    } else {
      resource = document.createElement('link');
      (resource ).href = url;
      (resource ).rel = 'stylesheet';
    }

    if (attributes) {
      const keys = Object.keys(attributes);
      for (const key of keys) {
        resource.setAttribute(key, attributes[key]);
      }
    }
    resource.addEventListener('load', () => resolve());
    resource.addEventListener('error', () => reject(new Error(`Script load error for url: ${url}.`)));
    document.head.appendChild(resource);
  });
}
