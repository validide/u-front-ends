import { ChildComponent } from '../childComponent';
import { RootComponentFacade } from '../../rootComponentFacade';
import { ContainerCommunicationHandlerMethods, ContainerCommunicationHandler } from '../communications/index';
import { InWindowContainerCommunicationHandler } from './inWindowContainerCommunicationHandler';
import { InWindowChildComponentOptions } from './inWindowChildComponentOptions';

export class InWindowChildComponent extends ChildComponent {
  constructor(window: Window, options: InWindowChildComponentOptions, rootFacade: RootComponentFacade) {
    super(window, options, rootFacade);
  }

  protected getCommunicationHandlerCore(methods: ContainerCommunicationHandlerMethods): ContainerCommunicationHandler {
    return new InWindowContainerCommunicationHandler(<HTMLElement>this.rootElement, methods);
  }

  protected getOptions(): InWindowChildComponentOptions {
    return <InWindowChildComponentOptions>super.getOptions();
  }

  protected async mountCore(): Promise<void> {
    const injectionFunction = this.getOptions().inject;
    if (!injectionFunction) {
      throw new Error('Inject method not defined!');
    }
    injectionFunction(<HTMLElement>this.rootElement);
    await super.mountCore();
  }
}
