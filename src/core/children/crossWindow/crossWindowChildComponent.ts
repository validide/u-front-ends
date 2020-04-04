import { RootComponentFacade } from '../../rootComponentFacade';
import { ChildComponent } from '../childComponent';
import { ContainerCommunicationHandler, ContainerCommunicationHandlerMethods } from '../communications/index';
import { CrossWindowChildComponentOptions } from './crossWindowChildComponentOptions';
import { CrossWindowContainerCommunicationHandler } from './crossWindowContainerCommunicationHandler';
import { generateUniqueId } from '../../../dom/document/generateIds';
import { getUrlOrigin } from '../../../dom/document/getUrlOrigin';

export class CrossWindowChildComponent extends ChildComponent {
  private iframeId: string;

  constructor(window: Window, options: CrossWindowChildComponentOptions, rootFacade: RootComponentFacade) {
    super(window, options, rootFacade);
    this.iframeId = '';
  }

  private defaultInjection(): string {
    const iframe = this.getDocument().createElement('iframe');
    const opt = this.getOptions();
    if (opt.iframeAttributes) {
      const keys = Object.keys(opt.iframeAttributes);
      for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        iframe.setAttribute(key, opt.iframeAttributes[key])
      }
    }

    iframe.setAttribute('src', opt.url);
    const iframeId = generateUniqueId(this.getDocument(), 'ufe-cross-');
    (<HTMLDivElement>this.rootElement).appendChild(iframe);
    return iframeId;
  }

  protected getCommunicationHandlerCore(methods: ContainerCommunicationHandlerMethods): ContainerCommunicationHandler {
    const document = this.getDocument();
    return new CrossWindowContainerCommunicationHandler(
      <Window>(document).defaultView,
      this.iframeId,
      getUrlOrigin(document, this.getOptions().url),
      methods
    );
  }

  protected async mountCore(): Promise<void> {
    const injectionFunction = this.getOptions().inject;
    if (injectionFunction) {
      this.iframeId = injectionFunction(<HTMLElement>this.rootElement);
    } else {
      this.iframeId = this.defaultInjection();
    }
    if (!this.iframeId)
      throw new Error(`Iframe Id("${this.iframeId}") is not valid.`)

    await super.mountCore();
  }

  protected getOptions(): CrossWindowChildComponentOptions {
    return <CrossWindowChildComponentOptions>super.getOptions();
  }
}
