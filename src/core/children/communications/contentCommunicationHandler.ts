import { CommunicationHandler } from './communicationHandler';
import { ICommunicationsEndpoint } from './iCommunicationsEndpoint';
import { ICommunicationsManager } from './iCommunicationsManager';
import { CommunicationEvent, CommunicationEventKind } from './communicationEvent';

/**
 *Communication handler for the content(the component beeing integrated).
 * The integrated component should create an instance of this to comunicate with the container.
 */
export abstract class ContentCommunicationHandler extends CommunicationHandler {
  private disposeCommandCallback: (() => void) | null;

  /**
   * Constructor.
   * @param messageType The message to handle.
   * @param inboundEndpoint The inbound "endpoint" to listen to.
   * @param manager The manager to handle outgoing communication.
   * @param disposeCommandCallback The command to dispose the content.
   */
  constructor(
    messageType: string,
    inboundEndpoint: ICommunicationsEndpoint,
    manager: ICommunicationsManager,
    disposeCommandCallback: () => void
  ) {
    super(messageType, inboundEndpoint, manager);
    this.disposeCommandCallback = disposeCommandCallback;
  }

  /**
   * @inheritdoc
   */
  protected handleEventCore(e: CommunicationEvent): void {
    switch (e.kind) {
      case CommunicationEventKind.BeforeDispose:
      case CommunicationEventKind.Disposed:
        if (this.disposeCommandCallback) {
          this.disposeCommandCallback();
        }
        break;
      default:
        throw new Error(`The "${e.kind}" event is not configured.`);
    }
  }

  /**
   * Dispatch event to signal mounting finished.
   */
  public dispatchMounted(): void {
    this.dispatchEvent(new CommunicationEvent(CommunicationEventKind.Mounted));
  }

  /**
   * Dispatch event to signal update is about to start.
   */
  public dispatchBeforeUpdate(): void {
    this.dispatchEvent(new CommunicationEvent(CommunicationEventKind.BeforeUpdate));
  }

  /**
   * Dispatch event to signal update finished.
   */
  public dispatchUpdated(): void {
    this.dispatchEvent(new CommunicationEvent(CommunicationEventKind.Updated));
  }

  /**
   * Dispatch event to disposing started.
   */
  public dispatchBeforeDispose(): void {
    this.dispatchEvent(new CommunicationEvent(CommunicationEventKind.BeforeDispose));
  }

  /**
   * Dispatch event to mount finished.
   */
  public dispatchDisposed(): void {
    this.dispatchEvent(new CommunicationEvent(CommunicationEventKind.Disposed));
  }

  /**
   * @inheritdoc
   */
  protected disposeCore(): void {
    this.disposeCommandCallback = null;
  }
}
