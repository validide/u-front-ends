import { type CommunicationsEvent, HTMLElementCommunicationsManager } from "../../src/index";

export class MockHTMLElementCommunicationsManager extends HTMLElementCommunicationsManager {
  public readEvents: (CommunicationsEvent | null)[] = [];

  public readEvent(e: Event): CommunicationsEvent | null {
    const evt = super.readEvent(e);
    this.readEvents.push(evt);

    return evt;
  }

  public startReceiving(inboundEndpoint: HTMLElement, handler: (e: Event) => void): void {
    super.startReceiving(inboundEndpoint, handler);
  }

  public stopReceiving(inboundEndpoint: HTMLElement, handler: (e: Event) => void): void {
    super.stopReceiving(inboundEndpoint, handler);
  }

  public sendEvent(outboundEndpoint: HTMLElement, event: CommunicationsEvent): void {
    super.sendEvent(outboundEndpoint, event);
  }
}
