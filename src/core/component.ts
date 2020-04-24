import { generateUniqueId, loadResource } from '../dom/index';
import { ComponentEvent, ComponentEventType } from './componentEvent';
import { ComponentOptions } from './componentOptions';

/**
 * Base class for all components.
 */
export abstract class Component {
  public id: string;
  public isInitialized: boolean;
  public isMounted: boolean;
  protected window: Window | null;
  protected options: ComponentOptions;
  protected rootElement: HTMLElement | null;
  protected resourcesLoaded: boolean;
  private disposed: boolean;

  /**
   * Constructor
   * @param window The reference to the window object
   * @param options The component options
   */
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

  /**
   * Create the root element hat will "encapsulate" the rest of the elements.
   */
  private createRootElement(): void {
    if (this.rootElement)
      return;

    const parent = this.getParentElement();
    this.rootElement = this.getDocument().createElement(this.getOptions().tag);
    this.id = generateUniqueId(this.getDocument(), 'ufe-');
    this.rootElement.id = this.id;
    parent.appendChild(this.rootElement);
  }

  /**
   * Get the parent element that hosts this component.
   */
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

  /**
   * Load the resources required by the compoent.
   */
  protected async loadResources(): Promise<void> {
    if (this.resourcesLoaded)
      return;

    this.resourcesLoaded = true;
    const options = this.getOptions();
    if (options.resources && options.resources.length > 0) {
      const document = this.getDocument();
      for (let index = 0; index < options.resources.length; index++) {
        const resource = options.resources[index];
        // DO NOT LOAD ALL AT ONCE AS YOU MIHGT HAVE DEPENDENCIES
        // AND A RESOURCE MIGHT LOAD BEFORE IT'S DEPENDENCY
        await loadResource(document, resource.url, resource.isScript, resource.skip, resource.attributes);
      }
    }
  }

  /**
   * Get the optons data.
   */
  protected getOptions(): ComponentOptions {
    return (<ComponentOptions>this.options);
  }

  /**
   * Get the wndow reference.
   */
  protected getWindow(): Window { return <Window>this.window; }

  /**
   * Get the document refrence.
   */
  protected getDocument(): Document { return this.getWindow().document; }

  /**
   * Core initialization function.
   * Any component derived should override this to add extra functionality.
   */
  protected initializeCore(): Promise<void> { return Promise.resolve(); }

  /**
   * Core mount function.
   * Any component derived should override this to add extra functionality.
   */
  protected mountCore(): Promise<void> {
    // This needs to be handled by each component
    // this.callHandler(ComponentEventType.Mounted);
    return Promise.resolve();
  }


  /**
   * Core dispose function.
   * Any component derived should override this to add clean-up after itself.
   */
  protected disposeCore(): Promise<void> { return Promise.resolve(); }

  /**
   * Call the global error handler.
   * @param e The error object
   */
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

  /**
   * Call a specific event handler.
   * @param type The type of handler to call.
   */
  protected callHandler(type: ComponentEventType, data?: any): void {
    if (type === ComponentEventType.Error)
      throw new Error(`For calling the "${ComponentEventType.Error}" handler use the "callErrorHandler" method.`);

    const handler = this.options.handlers
      ? this.options.handlers[type]
      : null;

    if (handler) {
      try {
        const event = new ComponentEvent(
          this.id,
          type,
          this.rootElement,
          this.getParentElement(),
          null
        );
        event.data = data;
        handler(event);
      } catch (error) {
        this.callErrorHandler(error);
      }
    }
  }

  /**
   * Logging method.
   * @param message The message.
   * @param optionalParams Optional parameters.
   */
  protected log(message?: any, ...optionalParams: any[]): void {
    const logMethod = this.window?.console?.log;
    if (logMethod)
      logMethod(message, optionalParams);
  }

  /**
   * Method invoked to initialize the component.
   * It should create the root element and any base dependencies.
   */
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

  /**
   * Method invoked to mount the actual content of the component.
   */
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

  /**
   * Method invoked to dispose of the component.
   */
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
