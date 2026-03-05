import {ContentCommunicationHandler, CommunicationsEvent} from '../../src/index';

export class MockContentCommunicationHandler extends ContentCommunicationHandler {
  public handleEventCore(e: CommunicationsEvent): void {
    return super.handleEventCore(e);
  }
}
