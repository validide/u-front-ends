import { CommunicationsEvent } from '../communications/event';
import { CommunicationsManager } from '../communications/manager';
import { createCustomEvent } from '../../../dom/document/createCustomEvent';

/**
 * @inheritdoc
 */
export class HTMLElementCommunicationsManager extends CommunicationsManager<HTMLElement> {

  /**
   * @inheritdoc
   */
  constructor(
    inboundEndpoint: HTMLElement,
    inboundEventType: string,
    outboundEndpoint: HTMLElement,
    outboundEventType: string
  ) {
    super(inboundEndpoint, inboundEventType, outboundEndpoint, outboundEventType);
  }

  /**
   * @inheritdoc
   */
  protected readEvent(e: Event): CommunicationsEvent | null {
    const customEvent = e as CustomEvent;
    if (!customEvent || customEvent.type !== this.inboundEventType)
      return null;

    return customEvent.detail;
  }

  /**
   * @inheritdoc
   */
  protected startReceiving(inboundEndpoint: HTMLElement, handler: (e: Event) => void): void {
    inboundEndpoint.addEventListener(this.inboundEventType, handler);
  }

  /**
   * @inheritdoc
   */
  protected stopReceiving(inboundEndpoint: HTMLElement, handler: (e: Event) => void): void{
    inboundEndpoint.removeEventListener(this.inboundEventType, handler);
  }

  /**
   * @inheritdoc
   */
  protected sendEvent(outboundEndpoint: HTMLElement, event: CommunicationsEvent): void {
    if (!outboundEndpoint.ownerDocument)
      return;

    const evt = createCustomEvent(outboundEndpoint.ownerDocument, this.outboundEventType, { detail: event });
    outboundEndpoint.dispatchEvent(evt);
  }
}
