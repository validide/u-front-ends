import { CommunicationsEvent, CommunicationsEventKind, ContentCommunicationHandler, CommunicationsManager } from '../communications/index';
import { CrossWindowCommunicationsManager } from '../communications/crossWindowManager';

/**
 * @inheritdoc
 */
export class CrossWindowContentCommunicationHandler extends ContentCommunicationHandler {
  private iframeId: string;
  private messageQueue: Array<CommunicationsEvent>;

  /**
   * Constructor.
   * @param communicationsManager A communications manager.
   * @param disposeCommandCallback The command to dispose the content.
   */
  constructor(communicationsManager: CommunicationsManager, disposeCommandCallback: () => void) {
    super(communicationsManager, disposeCommandCallback);

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
      const response = new CommunicationsEvent(exports.CommunicationsEventKind.Mounted);
      response.contentId = this.iframeId;
      this.send(response);

      // Send the previously queued messages.
      this.flushMessages();
    }
    else {
      // Phase 1 of the handshake - we got the hash so send it back.
      const response = new CommunicationsEvent(exports.CommunicationsEventKind.Mounted);
      response.contentId = this.iframeId;
      response.data = e.data;
      this.send(response);
    }
  }

  /**
   * Flush all the messages that were enqueues before the handhake.
   */
  private flushMessages(): void {
    for (let index = 0; index < this.messageQueue.length; index++) {
      const msg = this.messageQueue[index];
      msg.contentId = this.iframeId;
      this.send(msg);
    }
  }
}
