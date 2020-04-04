import { ChildComponent } from '../childComponent';
import { RootComponentFacade } from '../../rootComponentFacade';
import { ChildComponentOptions } from '../childComponentOptions';
import { ContainerCommunicationHandlerMethods, ContainerCommunicationHandler } from '../communications/index';
import { InWindowContainerCommunicationHandler } from './inWindowContainerCommunicationHandler';

export class InWindowChildComponent extends ChildComponent {
  constructor(window: Window, options: ChildComponentOptions, rootFacade: RootComponentFacade) {
    super(window, options, rootFacade);
  }

  protected getCommunicationHandlerCore(methods: ContainerCommunicationHandlerMethods): ContainerCommunicationHandler {
    return new InWindowContainerCommunicationHandler(<HTMLElement>this.rootElement, methods);
  }

  protected async mountCore(): Promise<void> {
    this.getOptions().inject(<HTMLElement>this.rootElement);
    await super.mountCore();
  }
}
