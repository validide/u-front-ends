import { ChildComponent } from '../childComponent';
import { RootComponentFacade } from '../../rootComponentFacade';
import { ContainerCommunicationHandlerMethods, ContainerCommunicationHandler, CommunicationsEvent, HTMLElementCommunicationsManager } from '../communications/index';
import { InWindowChildComponentOptions } from './childComponentOptions';
import { InWindowContainerCommunicationHandler } from './containerCommunicationHandler';

/**
 * In Window Child Component.
 */
export class InWindowChildComponent extends ChildComponent {
  /**
   * Constructor.
   *
   * @param window The window reference.
   * @param options The child component options.
   * @param rootFacade The facade to the root component.
   */
  constructor(window: Window, options: InWindowChildComponentOptions, rootFacade: RootComponentFacade) {
    super(window, options, rootFacade);
  }

  /**
   * @inheritdoc
   */
  protected getCommunicationHandlerCore(methods: ContainerCommunicationHandlerMethods): ContainerCommunicationHandler {
    const endpoint = this.rootElement as HTMLElement;
    const manager = new HTMLElementCommunicationsManager(
      endpoint,
      CommunicationsEvent.CONTENT_EVENT_TYPE,
      endpoint,
      CommunicationsEvent.CONTAINER_EVENT_TYPE
    );
    manager.initialize();
    return new InWindowContainerCommunicationHandler(manager, methods);
  }

  /**
   * Get the InWindowChildComponentOptions
   */
  protected getOptions(): InWindowChildComponentOptions {
    return super.getOptions() as InWindowChildComponentOptions;
  }

  /**
   * @inheritdoc
   */
  protected async mountCore(): Promise<void> {
    const injectionFunction = this.getOptions().inject;
    if (!injectionFunction) {
      throw new Error('Inject method not defined!');
    }
    injectionFunction(this.rootElement as HTMLElement);
    await super.mountCore();
  }
}
