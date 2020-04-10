import { ContainerCommunicationHandlerMethods, CommunicationsEvent, ContainerCommunicationHandler, HTMLElementCommunicationsManager } from '../communications/index';

/**
 * @inheritdoc
 */
export class InWindowContainerCommunicationHandler extends ContainerCommunicationHandler<HTMLElement> {
  constructor(el: HTMLElement, wrapperMethods: ContainerCommunicationHandlerMethods) {
    super(
      new HTMLElementCommunicationsManager(
        el,
        CommunicationsEvent.CONTENT_EVENT_TYPE,
        el,
        CommunicationsEvent.CONTAINER_EVENT_TYPE
      ),
      wrapperMethods
    );
  }
}
