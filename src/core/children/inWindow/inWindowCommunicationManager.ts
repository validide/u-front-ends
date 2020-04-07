import { ICommunicationsManager } from '../communications/iCommunicationsManager';
import { CommunicationEvent } from '../communications/index';
import { createCustomEvent } from '../../../dom/document/createCustomEvent';

/**
 * In Window Child Comunication Manager.
 */
export class InWindowCommunicationManager implements ICommunicationsManager {
  private outboundEndpoint: HTMLElement | null;
  private inboundEventType: string;
  private outboundEventType: string;

  /**
   * Constructor
   * @param outboundEndpoint The outbound communication endpoint.
   * @param inboundEventType The inbound event type.
   * @param outboundEventType The outbound event type.
   */
  constructor(el: HTMLElement, inboundEventType: string, outboundEventType: string) {
    this.outboundEndpoint = el;
    this.inboundEventType = inboundEventType;
    this.outboundEventType = outboundEventType;
  }

  /**
   * @inheritdoc
   */
  public readEvent(e: Event): CommunicationEvent | null {
    if (!e || e.type !== this.inboundEventType)
      return null;

    return <CommunicationEvent>(<CustomEvent>e).detail;
  }

  /**
   * @inheritdoc
   */
  public dispatchEvent<T>(detail: T): void {
    if (!this.outboundEndpoint || !this.outboundEndpoint.ownerDocument)
      return;

    const evt = createCustomEvent(this.outboundEndpoint.ownerDocument, this.outboundEventType, { detail: detail });
    this.outboundEndpoint.dispatchEvent(evt);
  }

  /**
   * @inheritdoc
   */
  public dispose(): void {
    this.outboundEndpoint = null;
  }

}
