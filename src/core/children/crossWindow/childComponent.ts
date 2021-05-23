import { RootComponentFacade } from '../../rootComponentFacade';
import { ChildComponent } from '../childComponent';
import { ContainerCommunicationHandlerMethods, ContainerCommunicationHandler, CrossWindowCommunicationsManager, CommunicationsEvent } from '../communications/index';
import { CrossWindowChildComponentOptions } from './childComponentOptions';
import { CrossWindowContainerCommunicationHandler } from './containerCommunicationHandler';
import { generateUniqueId } from '../../../dom/document/generateIds';
import { getUrlOrigin } from '../../../dom/document/getUrlOrigin';

/**
 * Cross Window Child Component.
 */
export class CrossWindowChildComponent extends ChildComponent {
  private embeddedId: string;
  private embeddedLoadPromise: Promise<void> | null;
  private embeddedLoadResolver: (() => void) | null;
  private embeddedErrorRejecter: ((e: Error) => void) | null;
  private embeddedLoadHandlerRef: ((e: Event) => void) | null;
  private embeddedErrorHandlerRef: ((e: ErrorEvent) => void) | null;

  /**
   * Constructor.
   *
   * @param window The window reference.
   * @param options The child options.
   * @param rootFacade he root component facade.
   */
  constructor(window: Window, options: CrossWindowChildComponentOptions, rootFacade: RootComponentFacade) {
    super(window, options, rootFacade);
    this.embeddedId = '';
    this.embeddedLoadResolver = null;
    this.embeddedErrorRejecter = null;
    this.embeddedLoadPromise = new Promise((resolve, reject) => {
      this.embeddedLoadResolver = resolve;
      this.embeddedErrorRejecter = reject;
    });
    this.embeddedLoadHandlerRef = this.embeddedLoadHandler.bind(this);
    this.embeddedErrorHandlerRef = this.embeddedErrorHandler.bind(this);

  }

  /**
   * @inheritdoc
   */
  protected disposeCore(): Promise<void> {
    const embed = this.embeddedId
      ? (this.rootElement as HTMLElement).querySelector<HTMLIFrameElement>(`#${this.embeddedId}`)
      : null;
    if (embed) {
      embed.removeEventListener('load', this.embeddedLoadHandlerRef as () => void);
      embed.removeEventListener('error', this.embeddedErrorHandlerRef as (e: ErrorEvent) => void);

      // Do not remove the embedded element now as we still need it to communicate with the content.
      // The parent "rootElement" will be removed latter anyhow.
      // (<HTMLElement>embed.parentElement).removeChild(embed);
    }
    this.embeddedLoadHandlerRef = null;
    this.embeddedErrorHandlerRef = null;
    this.embeddedLoadResolver = null;
    this.embeddedErrorRejecter = null;
    this.embeddedLoadPromise = null;
    return super.disposeCore();
  }

  /**
   * Get the CrossWindowChildComponentOptions
   */
  protected getOptions(): CrossWindowChildComponentOptions {
    return super.getOptions() as CrossWindowChildComponentOptions;
  }

  /**
   * @inheritdoc
   */
  protected async mountCore(): Promise<void> {
    const createEmbedElementFn = this.getOptions().createEmbedElement;
    let embed: HTMLElement | null = null;
    if (createEmbedElementFn) {
      embed = createEmbedElementFn(this.rootElement as HTMLElement);
    } else {
      embed = this.createEmbedElement();
    }
    if (!embed)
      throw new Error('Failed to create embed element!');

    const embedId = generateUniqueId(this.getDocument(), 'ufe-cross-');
    embed.id = embedId;
    this.embeddedId = embedId;

    embed.addEventListener('load', this.embeddedLoadHandlerRef as () => void);
    embed.addEventListener('error', this.embeddedErrorHandlerRef as (e: ErrorEvent) => void);

    (this.rootElement as HTMLDivElement).appendChild(embed);

    await ((this.embeddedLoadPromise) as Promise<void>);

    return await super.mountCore();
  }

  /**
   *
   * @param methods @inheritdoc
   */
  protected getCommunicationHandlerCore(methods: ContainerCommunicationHandlerMethods): ContainerCommunicationHandler {
    const document = this.getDocument();
    const manager = new CrossWindowCommunicationsManager(
      (document).defaultView as Window,
      CommunicationsEvent.CONTENT_EVENT_TYPE,
      this.outboundEndpointAccessor(),
      CommunicationsEvent.CONTAINER_EVENT_TYPE,
      getUrlOrigin(document, this.getOptions().url)
    );
    manager.initialize();
    return new CrossWindowContainerCommunicationHandler(
      manager,
      this.embeddedId,
      methods
    );
  }

  /**
   * Handle the loading of the embedded element.
   *
   * @param e The load event.
   */
  private embeddedLoadHandler(): void {
    (this.embeddedLoadResolver as () => void)();
  }

  /**
   * Handle the error of the embedded element.
   *
   * @param e The error event.
   */
  private embeddedErrorHandler(e: ErrorEvent): void {
    (this.embeddedErrorRejecter as (e: Error) => void)(new Error(`Failed to load embedded element.\nError details:\n${JSON.stringify(e)}`));
  }

  /**
   * Create the embedded element.
   */
  private createEmbedElement(): HTMLElement {
    const embed = this.getDocument().createElement('iframe');
    const opt = this.getOptions();
    if (opt.embeddedAttributes) {
      const keys = Object.keys(opt.embeddedAttributes);
      for (const key of keys) {
        embed.setAttribute(key, opt.embeddedAttributes[key]);
      }
    }

    embed.setAttribute('src', opt.url);
    return embed;
  }

  /**
   * Access the outbound communication endpoint.
   */
  private outboundEndpointAccessor(): Window {
    const embed = this.embeddedId
      ? (this.rootElement as HTMLElement).querySelector<HTMLIFrameElement>(`#${this.embeddedId}`)
      : null;

    if (!embed)
      throw new Error(`No iframe with "${this.embeddedId}" id found.`);

    if (!embed.contentWindow)
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`The iframe with "${this.embeddedId}" id does not have a "contentWindow"(${embed.contentWindow}).`);

    return embed.contentWindow;
  }
}
