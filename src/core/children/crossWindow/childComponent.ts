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
  private embededId: string;
  private embededLoadPromise: Promise<void> | null;
  private embededLoadResolver: (() => void) | null;
  private embededErrorRejecter: ((e: Error) => void) | null;
  private embededLoadHandlerRef: ((e: Event) => void) | null;
  private embededErrorHandlerRef: ((e: ErrorEvent) => void) | null;

  /**
   * Constructor.
   * @param window The window refrence.
   * @param options The child options.
   * @param rootFacade he root component facade.
   */
  constructor(window: Window, options: CrossWindowChildComponentOptions, rootFacade: RootComponentFacade) {
    super(window, options, rootFacade);
    this.embededId = '';
    this.embededLoadResolver = null;
    this.embededErrorRejecter = null;
    this.embededLoadPromise = new Promise((resolve, reject) => {
      this.embededLoadResolver = resolve;
      this.embededErrorRejecter = reject;
    });
    this.embededLoadHandlerRef = this.embededLoadHandler.bind(this);
    this.embededErrorHandlerRef = this.embededErrorHandler.bind(this);

  }

  /**
   * @inheritdoc
   */
  protected disposeCore(): Promise<void> {
    const embed = this.embededId
      ? (this.rootElement as HTMLElement).querySelector<HTMLIFrameElement>(`#${this.embededId}`)
      : null;
    if (embed) {
      embed.removeEventListener('load', this.embededLoadHandlerRef as () => void);
      embed.removeEventListener('error', this.embededErrorHandlerRef as (e: ErrorEvent) => void);

      // Do not remove the embeded element now as we still need it to comunicate with the content.
      // The parent "rootElement" will be removed latter anyhow.
      // (<HTMLElement>embed.parentElement).removeChild(embed);
    }
    this.embededLoadHandlerRef = null;
    this.embededErrorHandlerRef = null;
    this.embededLoadResolver = null;
    this.embededErrorRejecter = null;
    this.embededLoadPromise = null;
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
    this.embededId = embedId;

    embed.addEventListener('load', this.embededLoadHandlerRef as () => void);
    embed.addEventListener('error', this.embededErrorHandlerRef as (e: ErrorEvent) => void);

    (this.rootElement as HTMLDivElement).appendChild(embed);

    await ((this.embededLoadPromise) as Promise<void>);

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
      this.outboundEndpointAccesor(),
      CommunicationsEvent.CONTAINER_EVENT_TYPE,
      getUrlOrigin(document, this.getOptions().url)
    );
    manager.initialize();
    return new CrossWindowContainerCommunicationHandler(
      manager,
      this.embededId,
      methods
    );
  }

  /**
   * Handle the loading of the embeded element.
   * @param e The load event.
   */
  private embededLoadHandler(e: Event): void {
    (this.embededLoadResolver as () => void)();
  }

  /**
   * Handle the errir of the embeded element.
   * @param e The error event.
   */
  private embededErrorHandler(e: ErrorEvent): void {
    (this.embededErrorRejecter as (e: Error) => void)(new Error(`Failed to load embeded element.\nError details:\n${JSON.stringify(e)}`));
  }

  /**
   * Create the embeded element.
   */
  private createEmbedElement(): HTMLElement {
    const embed = this.getDocument().createElement('iframe');
    const opt = this.getOptions();
    if (opt.embededAttributes) {
      const keys = Object.keys(opt.embededAttributes);
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        embed.setAttribute(key, opt.embededAttributes[key]);
      }
    }

    embed.setAttribute('src', opt.url);
    return embed;
  }

  /**
   * Access the outbound comunication endpoint.
   */
  private outboundEndpointAccesor(): Window {
    const embed = this.embededId
      ? (this.rootElement as HTMLElement).querySelector<HTMLIFrameElement>(`#${this.embededId}`)
      : null;

    if (!embed)
      throw new Error(`No iframe with "${this.embededId}" id found.`);

    if (!embed.contentWindow)
      throw new Error(`The iframe with "${this.embededId}" id does not have a "contentWindow"(${embed.contentWindow}).`);

    return embed.contentWindow;
  }
}
