import { ICommunicationsManager } from '../communications/iCommunicationsManager';
import { CommunicationEvent } from '../communications/index';

export class InWindowCommunicationManager implements ICommunicationsManager {
  private el: HTMLElement | null;
  private inboundEventType: string;
  private outboundEventType: string;

  constructor(el: HTMLElement, inboundEventType: string, outboundEventType: string) {
    this.el = el;
    this.inboundEventType = inboundEventType;
    this.outboundEventType = outboundEventType;
  }

  public readEvent(e: Event): CommunicationEvent | null {
    if (!e || e.type !== this.inboundEventType)
      return null;

    return <CommunicationEvent>(<CustomEvent>e).detail;
  }

  public dispatchEvent<T>(detail: T): void {
    if (!this.el)
      return;

    this.el.dispatchEvent(new CustomEvent(this.outboundEventType, { detail: detail }));
  }

  public dispose(): void {
    this.el = null;
  }

}
