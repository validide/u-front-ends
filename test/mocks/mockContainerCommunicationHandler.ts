import { type CommunicationsEvent, ContainerCommunicationHandler } from "../../src/index";

export class MockContainerCommunicationHandler extends ContainerCommunicationHandler {
  public handleEventCore(e: CommunicationsEvent): void {
    super.handleEventCore(e);
  }
}
