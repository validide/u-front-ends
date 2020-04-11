import {CrossWindowCommunicationsManager, CommunicationsEvent, CrossWindowCommunicationDataContract} from '../../src';
import { getDelayPromise } from '../utils';

export class MockCrossWindowCommunicationsManager extends CrossWindowCommunicationsManager {
  public readEvents:Array<CommunicationsEvent|null> = [];
  public handler: ((e: Event) => void) | null = null;
  private inboundEndpointRef: Window | null = null;
  public sentEvents: Array<CommunicationsEvent> = [];

  public readEvent(e: Event): CommunicationsEvent | null {
    const evt = super.readEvent(e);
    this.readEvents.push(evt);

    return evt;
  }

  public startReceiving(inboundEndpoint: Window, handler: (e: Event) => void): void {
    this.handler = handler;
    this.inboundEndpointRef = inboundEndpoint;
    return super.startReceiving(inboundEndpoint, handler);
  }

  public stopReceiving(inboundEndpoint: Window, handler: (e: Event) => void): void{
    this.handler = null;
    this.inboundEndpointRef = null;
    return super.stopReceiving(inboundEndpoint, handler);
  }

  public sendEvent(outboundEndpoint: Window, event: CommunicationsEvent): void {
    this.sentEvents.push(event);
    return super.sendEvent(outboundEndpoint, event);
  }

  public simulateReceiveEvent(e: Event): Promise<void> {
    if(this.handler) {
      this.handler(e);
    }
    return getDelayPromise(1);
  }

  public wrapEvent(e: CommunicationsEvent, type: string): MessageEvent {
    const data = new CrossWindowCommunicationDataContract<CommunicationsEvent>(
      type,
      e
    );


    const message = (<Window>this.inboundEndpointRef).document.createEvent('MessageEvent');
    Object.defineProperty(message, 'origin', {
      value: (<Window>this.inboundEndpointRef).origin,
      writable: false
    });
    Object.defineProperty(message, 'data', {
      value: data,
      writable: false
    });

    return message;
  }
}
