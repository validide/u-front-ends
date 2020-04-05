import { ContentCommunicationHandler, CommunicationEvent, CommunicationEventKind } from '../communications/index';
import { CrossWindowCommunicationManager } from './crossWindowCommunicationManager';

export class CrossWindowContentCommunicationHandler extends ContentCommunicationHandler {
  private iframeId: string;
  private messageQueue: Array<CommunicationEvent>;
  constructor(
    inboundEndpoint: Window,
    outboundEndpoint: Window,
    origin: string,
    disposeCommandCallback: () => void
  ) {
    super(
      'message',
      inboundEndpoint,
      new CrossWindowCommunicationManager(
        outboundEndpoint,
        origin,
        CommunicationEvent.CONTAINER_EVENT_TYPE,
        CommunicationEvent.CONTENT_EVENT_TYPE),
      disposeCommandCallback
    );

    this.iframeId = '';
    this.messageQueue = [];
  }

  protected disposeCore(): void {
    this.messageQueue = [];
    super.disposeCore();
  }

  protected handleEventCore(e: CommunicationEvent): void {
    if (!this.iframeId) {
      this.attemptHandShake(e);
      return;
    }

    super.handleEventCore(e);
  }

  protected dispatchEvent<T>(information: T): void {
    const message = (<unknown>information) as CommunicationEvent;
    if (message) {
      if (this.iframeId) {
        message.contentId = this.iframeId;
      } else {
        if (message.kind !== CommunicationEventKind.Mounted) {
          // In case we do not have an iframeId push all events to queue,
          // only Mounted are allowed to establish handshake.
          this.messageQueue.push(message);
          return;
        }
      }
    }
    super.dispatchEvent(information);
  }

  private attemptHandShake(e: CommunicationEvent): void {
    if (e.contentId) {
      // Phase 2 of the handshake - we got the id.
      this.iframeId = e.contentId;

      // Send it again to notify parent.
      const response = new CommunicationEvent(exports.CommunicationEventKind.Mounted);
      response.contentId = this.iframeId;
      this.dispatchEvent(response);

      // Send the previously queued messages.
      this.flushMessages();
    }
    else {
      // Phase 1 of the handshake - we got the hash so send it back.
      const response = new CommunicationEvent(exports.CommunicationEventKind.Mounted);
      response.contentId = this.iframeId;
      response.data = e.data;
      this.dispatchEvent(response);
    }
  }

  private flushMessages(): void {
    for (let index = 0; index < this.messageQueue.length; index++) {
      const msg = this.messageQueue[index];
      msg.contentId = this.iframeId;
      this.dispatchEvent(msg);
    }
  }
}
