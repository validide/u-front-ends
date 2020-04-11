import {CrossWindowCommunicationsManager, CommunicationsEvent} from '../../src';

export class MockHCrossWindowCommunicationsManager extends CrossWindowCommunicationsManager {
  public readEvents:Array<CommunicationsEvent|null> = [];

  public readEvent(e: Event): CommunicationsEvent | null {
    const evt = super.readEvent(e);
    this.readEvents.push(evt);

    return evt;
  }

  public startReceiving(inboundEndpoint: Window, handler: (e: Event) => void): void {
    return super.startReceiving(inboundEndpoint, handler);
  }

  public stopReceiving(inboundEndpoint: Window, handler: (e: Event) => void): void{
    return super.stopReceiving(inboundEndpoint, handler);
  }

  public sendEvent(outboundEndpoint: Window, event: CommunicationsEvent): void {
    return super.sendEvent(outboundEndpoint, event);
  }
}
