import {HTMLElementCommunicationsManager, CommunicationsEvent} from '../../src';

export class MockHTMLElementCommunicationsManager extends HTMLElementCommunicationsManager {
  public readEvents:Array<CommunicationsEvent|null> = [];

  public readEvent(e: Event): CommunicationsEvent | null {
    const evt = super.readEvent(e);
    this.readEvents.push(evt);

    return evt;
  }

  public startReceiving(inboundEndpoint: HTMLElement, handler: (e: Event) => void): void {
    return super.startReceiving(inboundEndpoint, handler);
  }

  public stopReceiving(inboundEndpoint: HTMLElement, handler: (e: Event) => void): void{
    return super.stopReceiving(inboundEndpoint, handler);
  }

  public sendEvent(outboundEndpoint: HTMLElement, event: CommunicationsEvent): void {
    return super.sendEvent(outboundEndpoint, event);
  }
}
