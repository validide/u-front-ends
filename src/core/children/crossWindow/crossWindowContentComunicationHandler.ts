import { ContentCommunicationHandler, CommunicationEvent, CommunicationEventKind } from '../communications/index';
import { CrossWindowCommunicationManager } from './crossWindowCommunicationManager';

/**
 * @inheritdoc
 */
export class CrossWindowContentCommunicationHandler extends ContentCommunicationHandler {
  private iframeId: string;
  private messageQueue: Array<CommunicationEvent>;

  /**
   * Constructor.
   * @param inboundEndpoint The inbound communication endpoint.
   * @param outboundEndpoint The outbund communication endpoint.
   * @param origin The origin to communicate with.
   * @param disposeCommandCallback The command to dispose the content.
   */
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

  /**
   * @inheritdoc
   */
  protected disposeCore(): void {
    this.messageQueue = [];
    super.disposeCore();
  }

  /**
   * @inheritdoc
   */
  protected handleEventCore(e: CommunicationEvent): void {
    if (!this.iframeId) {
      this.attemptHandShake(e);
      return;
    }

    super.handleEventCore(e);
  }

  /**
   * @inheritdoc
   */
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

  /**
   * Attempt a handshake with the container.
   * @param e The communication event.
   */
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

  /**
   * Flush all the messages that were enqueues before the handhake.
   */
  private flushMessages(): void {
    for (let index = 0; index < this.messageQueue.length; index++) {
      const msg = this.messageQueue[index];
      msg.contentId = this.iframeId;
      this.dispatchEvent(msg);
    }
  }
}
