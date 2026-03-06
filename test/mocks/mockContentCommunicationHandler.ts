import { type CommunicationsEvent, ContentCommunicationHandler } from "../../src/index";

export class MockContentCommunicationHandler extends ContentCommunicationHandler {
  public handleEventCore(e: CommunicationsEvent): void {
    super.handleEventCore(e);
  }
}
