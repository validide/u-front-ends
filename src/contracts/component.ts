import { ComponentOptions } from './componentOptions';
import { ComponentEvent, ComponentEventType } from './componentEvent';
import { generateUniqueId } from '../dom/index';

export abstract class Component {
  public id: string;
  public isInitialized: boolean;
  public isMounted: boolean;
  protected window: Window | null;
  protected options: ComponentOptions;
  protected rootElement: HTMLElement | null;
  private disposed: boolean;

  constructor(window: Window, options: ComponentOptions) {
    if (!window)
      throw new Error('Missing "window" argument.');
    if (!options)
      throw new Error('Missing "options" argument.');


    this.isInitialized = false;
    this.isMounted = false;
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

  protected getOptions(): ComponentOptions {
    return (<ComponentOptions>this.options);
  }

  protected getWindow(): Window { return <Window>this.window; }

  protected getDocument(): Document { return this.getWindow().document; }

  protected initializeCore(): Promise<void> { return Promise.resolve(); }

  protected mountCore(): Promise<void> { return Promise.resolve(); }

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

  public async initialize(): Promise<void> {
    if (this.isInitialized)
      return;

    this.callHandler(ComponentEventType.BeforeCreate)
    this.isInitialized = true;
    try {
      this.createRootElement();
      await this.initializeCore();
    } catch (e) {
      this.callErrorHandler(e);
    }
    this.callHandler(ComponentEventType.Created)
  }

  public async mount(): Promise<void> {
    if (!this.isInitialized) {
      this.callErrorHandler(new Error(`Call "initialize" before calling "mount".`));
      return;
    }

    if (this.isMounted)
      return;

    this.callHandler(ComponentEventType.BeforeMount)
    this.isMounted = true;
    try {
      await this.mountCore();
    } catch (e) {
      this.callErrorHandler(e);
    }
    // This should be called by the component implementations.
    //this.callHandler(ComponentEventType.BeforeMount)
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
    this.rootElement?.parentElement?.removeChild(this.rootElement);
    this.rootElement = null;
    this.window = null;
  }
}
