import { CommunicationsEvent, CommunicationsManagerOf } from '../../src';

export class MockCommunicationsManager extends CommunicationsManagerOf<HTMLElement> {
  public receiving = false;
  public sentEvents: CommunicationsEvent[] = [];
  public receivedEvents: CommunicationsEvent[] = [];
  private handler: ((e: Event) => void) | null = null;


  protected startReceiving(inboundEndpoint: HTMLElement, handler: (e: Event) => void): void {
    this.handler = handler;
    inboundEndpoint.addEventListener(this.inboundEventType, handler);
    this.receiving = true;
  }
  protected stopReceiving(inboundEndpoint: HTMLElement, handler: (e: Event) => void): void {
    inboundEndpoint.removeEventListener(this.inboundEventType, handler);
    this.receiving = false;
  }
  protected readEvent(e: Event): CommunicationsEvent | null {
    const evt = (e as CustomEvent).detail as CommunicationsEvent;
    this.receivedEvents.push(evt);
    return evt;
  }
  protected sendEvent(outboundEndpoint: HTMLElement, event: CommunicationsEvent): void {
    this.sentEvents.push(event);
  }

  public callEventReceivedCallback(e: Event): void {
    return this.handler ? this.handler(e) : void 0;
  }

}
