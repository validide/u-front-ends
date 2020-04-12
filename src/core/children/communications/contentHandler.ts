import { CommunicationsManager } from './manager';
import { CommunicationsEventKind, CommunicationsEvent } from './event';
import { noop } from '../../../utilities/noop';

/**
 * Content communications handler methods
 */
export class ContentCommunicationHandlerMethods {
  /**
   * Method to dispose the content.
   */
  public dispose: () => void = noop;
}

/**
 * Handle the communications on the component content side.
 */
export abstract class ContentCommunicationHandler {
  private communicationsManager: CommunicationsManager | null;
  private methods: ContentCommunicationHandlerMethods | null;
  private disposed: boolean;

  /**
   * Constructor
   * @param communicationsManager A comunications manager
   * @param methods The callback to dispose the content.
   */
  constructor(
    communicationsManager: CommunicationsManager,
    methods: ContentCommunicationHandlerMethods
  ) {
    this.communicationsManager = communicationsManager;
    this.methods = methods;
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
        if (this.methods) {
          this.methods.dispose();
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
   * Send a message.
   * @param event The message.
   */
  public send(event: CommunicationsEvent): void{
    this.communicationsManager?.send(event);
  }

  /**
   * Dispatch event to signal mounting finished.
   */
  public dispatchMounted(): void {
    this.send(new CommunicationsEvent(CommunicationsEventKind.Mounted));
  }

  /**
   * Dispatch event to signal update is about to start.
   */
  public dispatchBeforeUpdate(): void {
    this.send(new CommunicationsEvent(CommunicationsEventKind.BeforeUpdate));
  }

  /**
   * Dispatch event to signal update finished.
   */
  public dispatchUpdated(): void {
    this.send(new CommunicationsEvent(CommunicationsEventKind.Updated));
  }

  /**
   * Dispatch event to disposing started.
   */
  public dispatchBeforeDispose(): void {
    this.send(new CommunicationsEvent(CommunicationsEventKind.BeforeDispose));
  }

  /**
   * Dispatch event to mount finished.
   */
  public dispatchDisposed(): void {
    this.send(new CommunicationsEvent(CommunicationsEventKind.Disposed));
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
    this.methods = null;
  }
}
