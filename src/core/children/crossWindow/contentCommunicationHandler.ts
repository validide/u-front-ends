import { CommunicationsEvent, CommunicationsEventKind, ContentCommunicationHandler, CommunicationsManager, ContentCommunicationHandlerMethods } from '../communications/index';

/**
 * @inheritdoc
 */
export class CrossWindowContentCommunicationHandler extends ContentCommunicationHandler {
  private iframeId: string;
  private messageQueue: CommunicationsEvent[];

  /**
   * Constructor.
   * @param communicationsManager A communications manager.
   * @param methods The callback to dispose the content.
   */
  constructor(communicationsManager: CommunicationsManager, methods: ContentCommunicationHandlerMethods) {
    super(communicationsManager, methods);

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
  protected handleEventCore(e: CommunicationsEvent): void {
    if (!this.iframeId) {
      this.attemptHandShake(e);
      return;
    }

    super.handleEventCore(e);
  }

  /**
   * @inheritdoc
   */
  public send(message: CommunicationsEvent): void {
    if (this.iframeId) {
      message.contentId = this.iframeId;
    } else {
      if (message.kind !== CommunicationsEventKind.Mounted) {
        // In case we do not have an iframeId push all events to queue,
        // only Mounted are allowed to establish handshake.
        this.messageQueue.push(message);
        return;
      }
    }
    super.send(message);
  }

  /**
   * Attempt a handshake with the container.
   * @param e The communication event.
   */
  private attemptHandShake(e: CommunicationsEvent): void {
    if (e.contentId) {
      // Phase 2 of the handshake - we got the id.
      this.iframeId = e.contentId;

      // Send it again to notify parent.
      const response = new CommunicationsEvent(CommunicationsEventKind.Mounted);
      response.contentId = this.iframeId;
      this.send(response);

      // Send the previously queued messages.
      this.flushMessages();
    }
    else {
      // Phase 1 of the handshake - we got the hash so send it back.
      const response = new CommunicationsEvent(CommunicationsEventKind.Mounted);
      response.contentId = this.iframeId;
      response.data = e.data;
      this.send(response);
    }
  }

  /**
   * Flush all the messages that were enqueued before the handshake.
   */
  private flushMessages(): void {
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < this.messageQueue.length; index++) {
      const msg = this.messageQueue[index];
      msg.contentId = this.iframeId;
      this.send(msg);
    }
  }
}
