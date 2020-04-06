import { ChildComponent } from '../childComponent';
import { RootComponentFacade } from '../../rootComponentFacade';
import { ContainerCommunicationHandlerMethods, ContainerCommunicationHandler } from '../communications/index';
import { InWindowContainerCommunicationHandler } from './inWindowContainerCommunicationHandler';
import { InWindowChildComponentOptions } from './inWindowChildComponentOptions';

/**
 * In Window Child Component.
 */
export class InWindowChildComponent extends ChildComponent {
  /**
   * Constructor.
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
    return new InWindowContainerCommunicationHandler(<HTMLElement>this.rootElement, methods);
  }

  /**
   * Get the InWindowChildComponentOptions
   */
  protected getOptions(): InWindowChildComponentOptions {
    return <InWindowChildComponentOptions>super.getOptions();
  }

  /**
   * @inheritdoc
   */
  protected async mountCore(): Promise<void> {
    const injectionFunction = this.getOptions().inject;
    if (!injectionFunction) {
      throw new Error('Inject method not defined!');
    }
    injectionFunction(<HTMLElement>this.rootElement);
    await super.mountCore();
  }
}
