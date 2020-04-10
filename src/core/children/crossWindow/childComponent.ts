import { RootComponentFacade } from '../../rootComponentFacade';
import { ChildComponent } from '../childComponent';
import { ContainerCommunicationHandlerMethods, ContainerCommunicationHandler } from '../communications/index';
import { CrossWindowChildComponentOptions } from './childComponentOptions';
import { CrossWindowContainerCommunicationHandler } from './containerCommunicationHandler';
import { generateUniqueId } from '../../../dom/document/generateIds';
import { getUrlOrigin } from '../../../dom/document/getUrlOrigin';

/**
 * Cross Window Child Component.
 */
export class CrossWindowChildComponent extends ChildComponent<Window> {
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
    if (this.embededId) {
      const embed = (<HTMLElement>this.rootElement).querySelector<HTMLIFrameElement>(`#${this.embededId}`);
      if (embed) {
        if (this.embededLoadHandlerRef) {
          embed.removeEventListener('load', this.embededLoadHandlerRef);
        }

        if (this.embededErrorHandlerRef) {
          embed.removeEventListener('error', this.embededErrorHandlerRef);
        }
        // Do not remove the embede element now as we still need it to comunicate with the content.
        // The parent "rootElement" will be removed latter anyhow.
        // (<HTMLElement>embed.parentElement).removeChild(embed);
      }
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
    return <CrossWindowChildComponentOptions>super.getOptions();
  }

  /**
   * @inheritdoc
   */
  protected mountCore(): Promise<void> {
    const createEmbedElementFn = this.getOptions().createEmbedElement;
    let embed: HTMLElement | null = null;
    if (createEmbedElementFn) {
      embed = createEmbedElementFn(<HTMLElement>this.rootElement);
    } else {
      embed = this.createEmbedElement();
    }
    if (!embed)
      throw new Error('Failed to create embed element!');

    const embedId = generateUniqueId(this.getDocument(), 'ufe-cross-');
    embed.id = embedId;
    this.embededId = embedId;

    if (this.embededLoadHandlerRef) {
      embed.addEventListener('load', this.embededLoadHandlerRef);
    }

    if (this.embededErrorHandlerRef) {
      embed.addEventListener('error', this.embededErrorHandlerRef);
    }

    (<HTMLDivElement>this.rootElement).appendChild(embed);
    return (<Promise<void>>(this.embededLoadPromise))
      .then(() => {
        super.mountCore();
      });
  }

  /**
   *
   * @param methods @inheritdoc
   */
  protected getCommunicationHandlerCore(methods: ContainerCommunicationHandlerMethods): ContainerCommunicationHandler<Window> {
    const document = this.getDocument();
    return new CrossWindowContainerCommunicationHandler(
      <Window>(document).defaultView,
      this.outboundEndpointAccesor(),
      this.embededId,
      getUrlOrigin(document, this.getOptions().url),
      methods
    );
  }

  /**
   * Handle the loading of the embeded element.
   * @param e The load event.
   */
  private embededLoadHandler(e: Event): void {
    if (this.embededLoadResolver) {
      this.embededLoadResolver();
    }
  }

  /**
   * Handle the errir of the embeded element.
   * @param e The error event.
   */
  private embededErrorHandler(e: ErrorEvent): void {
    if (this.embededErrorRejecter) {
      this.embededErrorRejecter(e.error);
    }
  }

  /**
   * Create the embeded element.
   */
  private createEmbedElement(): HTMLElement {
    const embed = this.getDocument().createElement('iframe');
    const opt = this.getOptions();
    if (opt.embededAttributes) {
      const keys = Object.keys(opt.embededAttributes);
      for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        embed.setAttribute(key, opt.embededAttributes[key])
      }
    }

    embed.setAttribute('src', opt.url);
    return embed;
  }

  /**
   * Access the outbound comunication endpoint.
   */
  private outboundEndpointAccesor(): Window {
    const iframe = (<HTMLElement>this.rootElement).querySelector<HTMLIFrameElement>(`#${this.embededId}`);
    if (!iframe)
      throw new Error(`No iframe with "${this.embededId}" id found.`);

    if (!iframe.contentWindow)
      throw new Error(`iframe with "${this.embededId}" id does not have a "contentWindow"(${iframe.contentWindow}).`);

    return iframe.contentWindow;
  }
}
