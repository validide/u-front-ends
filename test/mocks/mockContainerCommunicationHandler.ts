import {ContainerCommunicationHandler, CommunicationsEvent} from '../../src/index';

export class MockContainerCommunicationHandler extends ContainerCommunicationHandler {
  public handleEventCore(e: CommunicationsEvent): void {
    return super.handleEventCore(e);
  }
}
