import { ContainerCommunicationHandlerMethods, CommunicationEvent, ContainerCommunicationHandler } from '../communications/index';
import { InWindowCommunicationManager } from './inWindowCommunicationManager';

export class InWindowContainerCommunicationHandler extends ContainerCommunicationHandler {
  constructor(el: HTMLElement, wrapperMethods: ContainerCommunicationHandlerMethods) {
    super(
      CommunicationEvent.CONTENT_EVENT_TYPE,
      el,
      new InWindowCommunicationManager(
        el,
        CommunicationEvent.CONTENT_EVENT_TYPE,
        CommunicationEvent.CONTAINER_EVENT_TYPE
      ),
      wrapperMethods
    );
  }
}
