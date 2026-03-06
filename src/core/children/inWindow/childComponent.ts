// Root facade type is only needed on runtime cast locations; import removed to satisfy linter
import { ChildComponent } from "../childComponent";
import type { ContainerCommunicationHandler, ContainerCommunicationHandlerMethods } from "../communications/index";
import { CommunicationsEvent, HTMLElementCommunicationsManager } from "../communications/index";
import type { InWindowChildComponentOptions } from "./childComponentOptions";
import { InWindowContainerCommunicationHandler } from "./containerCommunicationHandler";

/**
 * In Window Child Component.
 */
export class InWindowChildComponent extends ChildComponent {
  // constructor omitted — base class constructor is sufficient

  /**
   * @inheritdoc
   */
  protected getCommunicationHandlerCore(methods: ContainerCommunicationHandlerMethods): ContainerCommunicationHandler {
    const endpoint = this.rootElement as HTMLElement;
    const manager = new HTMLElementCommunicationsManager(
      endpoint,
      CommunicationsEvent.CONTENT_EVENT_TYPE,
      endpoint,
      CommunicationsEvent.CONTAINER_EVENT_TYPE,
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
      throw new Error("Inject method not defined!");
    }
    injectionFunction(this.rootElement as HTMLElement);
    await super.mountCore();
  }
}
