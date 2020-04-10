import { CommunicationsEvent } from '../communications/event';
import { CommunicationsManager } from '../communications/manager';
import { CrossWindowCommunicationDataContract } from './crossWindowDataContract';

/**
 * @inheritdoc
 */
export class CrossWindowCommunicationsManager extends CommunicationsManager<Window> {
  private origin: string;

  /**
   * Constructor
   * @param inboundEndpoint The endpoint for receiving messages.
   * @param inboundEventType The types of messages to receive.
   * @param outboundEndpoint The endpoint to sent mesages.
   * @param outboundEventType The messages to send.
   * @param origin The origin to comunicate with.
   */
  constructor(
    inboundEndpoint: Window,
    inboundEventType: string,
    outboundEndpoint: Window,
    outboundEventType: string,
    origin: string
  ) {
    super(inboundEndpoint, inboundEventType, outboundEndpoint, outboundEventType);
    this.origin = origin;
  }

  /**
   * @inheritdoc
   */
  protected readEvent(e: Event): CommunicationsEvent | null {
    const messageEvent = e as MessageEvent;
    if (!messageEvent || messageEvent.origin !== this.origin)
      return null;

    const data = messageEvent.data as CrossWindowCommunicationDataContract<CommunicationsEvent>;
    if (!data || data.type !== this.inboundEventType)
      return null;

    return data.detail;
  }

  /**
   * @inheritdoc
   */
  protected startReceiving(inboundEndpoint: Window, handler: (e: Event) => void): void {
    inboundEndpoint.addEventListener('message', handler);
  }

  /**
   * @inheritdoc
   */
  protected stopReceiving(inboundEndpoint: Window, handler: (e: Event) => void): void{
    inboundEndpoint.removeEventListener('message', handler);
  }

  /**
   * @inheritdoc
   */
  protected sendEvent(outboundEndpoint: Window, event: CommunicationsEvent): void {
    const data = new CrossWindowCommunicationDataContract<CommunicationsEvent>(
      this.outboundEventType,
      event
    );

    outboundEndpoint.postMessage(data, this.origin);
  }
}
