import { ContainerCommunicationHandlerMethods, CommunicationsEvent, ContainerCommunicationHandler, HTMLElementCommunicationsManager, CommunicationsManager } from '../communications/index';

/**
 * @inheritdoc
 */
export class InWindowContainerCommunicationHandler extends ContainerCommunicationHandler {
  /**
 * @inheritdoc
 */
  constructor(communicationsManager: CommunicationsManager, wrapperMethods: ContainerCommunicationHandlerMethods) {
    super(communicationsManager, wrapperMethods);
  }
}
