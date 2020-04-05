import { ICommunicationsManager } from '../communications/iCommunicationsManager';
import { CommunicationEvent } from '../communications/index';
import { ICrossWindowCommunicationData } from './iCrossWindowCommunication';



export class CrossWindowCommunicationManager implements ICommunicationsManager {
  private outboundEndpoint: Window | null;
  private origin: string;
  private inboundEventType: string;
  private outboundEventType: string;

  constructor(
    outboundEndpoint: Window,
    origin: string,
    inboundEventType: string,
    outboundEventType: string
  ) {
    this.outboundEndpoint = outboundEndpoint;
    this.origin = origin;
    this.inboundEventType = inboundEventType;
    this.outboundEventType = outboundEventType;
  }

  public readEvent(e: Event): CommunicationEvent | null {
    if (!e)
      return null;

    const messageEvent = e as MessageEvent;
    if (!messageEvent || messageEvent.origin !== this.origin)
      return null;

    const data = messageEvent.data as ICrossWindowCommunicationData<CommunicationEvent>;
    if (!data || data.type !== this.inboundEventType)
      return null;

    return data.detail;
  }

  public dispatchEvent<T>(detail: T): void {
    if (!this.outboundEndpoint)
      return;

    const event: ICrossWindowCommunicationData<T> = {
      type: this.outboundEventType,
      detail: detail
    };

    this.outboundEndpoint.postMessage(event, this.origin);
  }

  public dispose(): void {
    this.outboundEndpoint = null;
  }

}
