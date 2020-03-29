import { ComponentOptions } from './componentOptions';
import { ComponentEvent, ComponentEventType } from './componentEvent';
import { generateUniqueId } from '../dom/index';
import { loadResource } from '../dom/document/loadResource';

export abstract class Component {
  public id: string;
  public isInitialized: boolean;
  public isMounted: boolean;
  protected window: Window | null;
  protected options: ComponentOptions;
  protected rootElement: HTMLElement | null;
  protected resourcesLoaded: boolean;
  private disposed: boolean;

  constructor(window: Window, options: ComponentOptions) {
    if (!window)
      throw new Error('Missing "window" argument.');
    if (!options)
      throw new Error('Missing "options" argument.');


    this.isInitialized = false;
    this.isMounted = false;
    this.resourcesLoaded = false;
    this.id = '';
    this.rootElement = null;
    this.window = window;
    this.options = options;
    this.disposed = false;
  }

  private createRootElement(): void {
    if (this.rootElement)
      return;

    const parent = this.getParentElement();
    this.rootElement = this.getDocument().createElement(this.getOptions().tag);
    this.id = generateUniqueId(this.getDocument(), 'ufe-');
    this.rootElement.id = this.id;
    parent.appendChild(this.rootElement);
  }

  private getParentElement(): HTMLElement {
    let parent: HTMLElement | null = null;

    const opt = this.getOptions();
    if (opt.parent) {
      if (typeof opt.parent === 'string') {
        parent = this.getDocument().querySelector(opt.parent);
      }
      else {
        parent = opt.parent;
      }
    }

    if (!parent)
      throw new Error(`Failed to find parent "${opt.parent}".`);

    return parent;
  }

  protected async loadResources(): Promise<void> {
    if (this.resourcesLoaded)
      return;

    this.resourcesLoaded = true;
    const options = this.getOptions();
    if (options.resources && options.resources.length > 0) {
      const document = this.getDocument();
      for (let index = 0; index < options.resources.length; index++) {
        const resource = options.resources[index];
        // DO NOT LOAD ALL T ONCE AS YOU MIHGT HAVE DEPENDENCIES
        // AND LA RESOURCE MIGHT LOAD BEFORE IT'S DEPENDENCY
        await loadResource(document, resource.url, resource.isScript, resource.attributes);
      }
    }
  }

  protected getOptions(): ComponentOptions {
    return (<ComponentOptions>this.options);
  }

  protected getWindow(): Window { return <Window>this.window; }

  protected getDocument(): Document { return this.getWindow().document; }

  protected initializeCore(): Promise<void> { return Promise.resolve(); }

  protected mountCore(): Promise<void> {
    // This needs to be handled by each component
    // this.callHandler(ComponentEventType.Mounted);
    return Promise.resolve();
  }

  protected disposeCore(): Promise<void> { return Promise.resolve(); }

  protected callErrorHandler(e: Error): void {
    const handler = this.options.handlers?.error;
    if (handler) {
      try {
        handler(new ComponentEvent(
          this.id,
          ComponentEventType.Error,
          this.rootElement,
          this.getParentElement(),
          e
        ));
      } catch (error) {
        this.log(error);
      }
    } else {
      this.log(e);
    }
  }

  protected callHandler(type: ComponentEventType): void {
    if (type === ComponentEventType.Error)
      throw new Error(`For calling the "${ComponentEventType.Error}" handler use the "callErrorHandler" method.`);

    const handler = this.options.handlers
      ? this.options.handlers[type]
      : null;

    if (handler) {
      try {
        handler(new ComponentEvent(
          this.id,
          type,
          this.rootElement,
          this.getParentElement(),
          null
        ));
      } catch (error) {
        this.callErrorHandler(error);
      }
    }
  }

  protected log(message?: any, ...optionalParams: any[]): void {
    const logMethod = this.window?.console?.log;
    if (logMethod)
      logMethod(message, optionalParams);
  }

  public async initialize(): Promise<Component> {
    if (this.isInitialized)
      return this;

    this.callHandler(ComponentEventType.BeforeCreate)
    this.isInitialized = true;
    try {
      await this.loadResources();
      this.createRootElement();
      await this.initializeCore();
    } catch (e) {
      this.callErrorHandler(e);
    }
    this.callHandler(ComponentEventType.Created);
    return this;
  }

  public async mount(): Promise<Component> {
    if (!this.isInitialized) {
      this.callErrorHandler(new Error(`Call "initialize" before calling "mount".`));
      return this;
    }

    if (this.isMounted)
      return this;

    this.callHandler(ComponentEventType.BeforeMount)
    this.isMounted = true;
    try {
      await this.mountCore();
    } catch (e) {
      this.callErrorHandler(e);
    }
    return this;
  }

  public async dispose(): Promise<void> {
    if (this.disposed)
      return;

    this.callHandler(ComponentEventType.BeforeDestroy);
    this.disposed = true;
    try {
      await this.disposeCore();
    } catch (e) {
      this.callErrorHandler(e);
    }
    this.callHandler(ComponentEventType.Destroyed);

    this.id = '';
    this.isInitialized = false;
    this.isMounted = false;
    this.resourcesLoaded = false;
    this.rootElement?.parentElement?.removeChild(this.rootElement);
    this.rootElement = null;
    this.window = null;
  }
}
