import { CommunicationsManager } from './manager';
import { CommunicationsEventKind, CommunicationsEvent } from './event';

/**
 * Handle the communications on the component content side.
 */
export abstract class ContentCommunicationHandler<TEndpoint> {
  protected communicationsManager: CommunicationsManager<TEndpoint> | null;
  private disposeCommandCallback: (() => void) | null;
  private disposed: boolean;

  /**
   * Constructor
   * @param communicationsManager A comunications manager
   * @param disposeCommandCallback The callback to dispose the content.
   */
  constructor(
    communicationsManager: CommunicationsManager<TEndpoint>,
    disposeCommandCallback: () => void
  ) {
    this.communicationsManager = communicationsManager;
    this.disposeCommandCallback = disposeCommandCallback;
    this.communicationsManager.initialize();
    this.communicationsManager.setEventReceivedCallback((e: CommunicationsEvent) => {
      this.handleEvent(e);
    });
    this.disposed = false;
  }

  /**
   * Core functionality for handling the incomming events.
   * @param e The event.
   */
  protected handleEventCore(e: CommunicationsEvent): void {
    switch (e.kind) {
      case CommunicationsEventKind.BeforeDispose:
      case CommunicationsEventKind.Disposed:
        if (this.disposeCommandCallback) {
          this.disposeCommandCallback();
        }
        break;
      default:
        throw new Error(`The "${e.kind}" event is not configured.`);
    }
  }

  /**
   * Handle the incomming communications event.
   * @param e The event
   */
  private handleEvent(e: CommunicationsEvent): void {
    this.handleEventCore(e);
  }

  /**
   * Core dispose function.
   * Any component derived should override this to add clean-up after itself.
   */
  protected disposeCore(): void { }


  /**
   * Dispatch event to signal mounting finished.
   */
  public dispatchMounted(): void {
    this.communicationsManager?.send(new CommunicationsEvent(CommunicationsEventKind.Mounted));
  }

  /**
   * Dispatch event to signal update is about to start.
   */
  public dispatchBeforeUpdate(): void {
    this.communicationsManager?.send(new CommunicationsEvent(CommunicationsEventKind.BeforeUpdate));
  }

  /**
   * Dispatch event to signal update finished.
   */
  public dispatchUpdated(): void {
    this.communicationsManager?.send(new CommunicationsEvent(CommunicationsEventKind.Updated));
  }

  /**
   * Dispatch event to disposing started.
   */
  public dispatchBeforeDispose(): void {
    this.communicationsManager?.send(new CommunicationsEvent(CommunicationsEventKind.BeforeDispose));
  }

  /**
   * Dispatch event to mount finished.
   */
  public dispatchDisposed(): void {
    this.communicationsManager?.send(new CommunicationsEvent(CommunicationsEventKind.Disposed));
  }

  /**
   * Method invoked to dispose of the handler.
   */
  public dispose(): void {
    if (this.disposed)
      return;

    this.disposed = true;
    this.disposeCore();
    this.communicationsManager?.dispose();
    this.communicationsManager = null;
    this.disposeCommandCallback = null;
  }
}
