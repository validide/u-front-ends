export function loadResource(
  document: Document,
  url: string,
  isScript: boolean = true,
  attributes?: { [key: string]: string; }
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let resource: HTMLScriptElement | HTMLLinkElement;

    if (isScript) {
      resource = document.createElement('script');
      (<HTMLScriptElement>resource).src = url;
    } else {
      resource = document.createElement('link');
      (<HTMLLinkElement>resource).href = url;
    }

    if (attributes) {
      const keys = Object.keys(attributes);
      for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        resource.setAttribute(key, attributes[key])
      }
    }
    resource.addEventListener('load', () => resolve());
    resource.addEventListener('error', () => reject(new Error(`Script load error for url: ${url}.`)));
    document.head.appendChild(resource);
  });
}
