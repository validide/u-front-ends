import {ContainerCommunicationHandler, CommunicationsEvent} from '../../src';

export class MockContainerCommunicationHandler extends ContainerCommunicationHandler {
  public handleEventCore(e: CommunicationsEvent): void {
    return super.handleEventCore(e);
  }
}
