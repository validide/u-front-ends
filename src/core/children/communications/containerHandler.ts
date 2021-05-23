import { CommunicationsManager } from './manager';
import { CommunicationsEventKind, CommunicationsEvent } from './event';
import { noop } from '../../../utilities/noop';

/**
 * The communication handler methods.
 */
export class ContainerCommunicationHandlerMethods {
  /**
   * Call the container to signal that the content finished mounting.
   */
  public [CommunicationsEventKind.Mounted]: () => void = noop;
  /**
   * Call the container to signal an update is about to happen.
   */
  public [CommunicationsEventKind.BeforeUpdate]: () => void = noop;
  /**
   * Call the container to signal an update finished.
   */
  public [CommunicationsEventKind.Updated]: () => void = noop;
  /**
   * Call the container to signal dispose started.
   */
  public [CommunicationsEventKind.BeforeDispose]: () => void = noop;
  /**
   * Call the container to signal the component has disposed(almost).
   */
  public [CommunicationsEventKind.Disposed]: () => void = noop;
  /**
   * Call the container to signal the component has disposed(almost).
   */
  public [CommunicationsEventKind.Data]: (data: any) => void = noop;
}

/**
 * Handle the communications on the child component side.
 */
export abstract class ContainerCommunicationHandler {
  private communicationsManager: CommunicationsManager | null;
  private handlerMethods: ContainerCommunicationHandlerMethods | null;
  private disposed: boolean;

  /**
   * Constructor
   *
   * @param communicationsManager A communications manager.
   * @param handlerMethods A collection of handler methods.
   */
  constructor(
    communicationsManager: CommunicationsManager,
    handlerMethods: ContainerCommunicationHandlerMethods
  ) {
    this.communicationsManager = communicationsManager;
    this.handlerMethods = handlerMethods;
    this.communicationsManager.setEventReceivedCallback((e: CommunicationsEvent) => {
      this.handleEvent(e);
    });
    this.disposed = false;
  }

  /**
   * Core functionality for handling the incoming events.
   *
   * @param e The event.
   */
  protected handleEventCore(e: CommunicationsEvent): void {
    if (!this.handlerMethods)
      return;

    const method = this.handlerMethods[e.kind];
    if (!method)
      return;

    method(e.data);
  }

  /**
   * Handle the incoming communications event.
   *
   * @param e The event
   */
  private handleEvent(e: CommunicationsEvent): void {
    this.handleEventCore(e);
  }

  /**
   * Method invoked to dispose of the handler.
   */
  public dispose(): void {
    if (this.disposed)
      return;

    this.disposed = true;
    this.communicationsManager?.dispose();
    this.communicationsManager = null;
    this.handlerMethods = null;
  }

  /**
   * Send a message.
   *
   * @param event The message.
   */
  public send(event: CommunicationsEvent): void{
    this.communicationsManager?.send(event);
  }

  /**
   * Send data.
   *
   * @param data The data to send.
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public sendData(data: any): void{
    const event = new CommunicationsEvent(CommunicationsEventKind.Data);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    event.data = data;
    this.communicationsManager?.send(event);
  }

  /**
   * Request that the content begins disposing.
   */
  public requestContentDispose(): void {
    this.send(new CommunicationsEvent(CommunicationsEventKind.BeforeDispose));
  }
}
