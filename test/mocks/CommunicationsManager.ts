import { CommunicationsEvent, CommunicationsManagerOf } from "../../src";

export class MockCommunicationsManager extends CommunicationsManagerOf<HTMLElement> {
  public receiving = false;
  public sentEvents: Array<CommunicationsEvent> = [];
  public receivedEvents: Array<CommunicationsEvent> = [];


  protected startReceiving(inboundEndpoint: HTMLElement, handler: (e: Event) => void): void {
    inboundEndpoint.addEventListener(this.inboundEventType, handler);
    this.receiving = true;
  }
  protected stopReceiving(inboundEndpoint: HTMLElement, handler: (e: Event) => void): void {
    inboundEndpoint.removeEventListener(this.inboundEventType, handler);
    this.receiving = false;
  }
  protected readEvent(e: Event): CommunicationsEvent | null {
    const evt = (<CustomEvent>e).detail as CommunicationsEvent;
    this.receivedEvents.push(evt);
    return evt;
  }
  protected sendEvent(outboundEndpoint: HTMLElement, event: CommunicationsEvent): void {
    this.sentEvents.push(event);
  }

}
