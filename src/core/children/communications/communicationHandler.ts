import { ICommunicationsEndpoint } from './iCommunicationsEndpoint';
import { ICommunicationsManager } from './iCommunicationsManager';
import { CommunicationEvent } from './communicationEvent';

/**
 * Communication handler.
 */
export abstract class CommunicationHandler {
  private inboundEndpoint: ICommunicationsEndpoint | null;
  private messageType: string;
  private manager: ICommunicationsManager | null;
  private handlerAction: ((e: Event) => void) | null;
  private disposed: boolean;

  /**
   * Constructor.
   * @param messageType The type of message to listen for.
   * @param inboundEndpoint The inbound "endpoint"(element) to listen to.
   * @param manager The communications manager.
   */
  constructor(
    messageType: string,
    inboundEndpoint: ICommunicationsEndpoint,
    manager: ICommunicationsManager
  ) {
    this.messageType = messageType;
    this.inboundEndpoint = inboundEndpoint;
    this.manager = manager;
    this.handlerAction = this.handleEvent.bind(this);
    this.disposed = false;
    this.attachCommandHandler();
  }

  /**
   * Handle a communication event.
   * @param e The event.
   */
  private handleEvent(e: Event): void {
    if(!this.manager)
      return;

    const evt = this.manager.readEvent(e);
    if (!evt)
      return;

    this.handleEventCore(evt);
  }

  /**
   * Core handler of the comunicatin event.
   * All derived classed need to implement this to handle the event.
   * @param e Communication Event
   */
  protected abstract handleEventCore(e: CommunicationEvent): void

  /**
   * Core method to dispose of custom members.
   */
  protected abstract disposeCore(): void;

  /**
   * Attach the command handler to the endpoint.
   */
  private attachCommandHandler(): void {
    if(!this.inboundEndpoint || !this.handlerAction)
      return;

    this.inboundEndpoint.addEventListener(this.messageType, this.handlerAction);
  }

  /**
   * Detach the command handler from the endpoint.
   */
  private detachCommandHandler(): void{
    if(!this.inboundEndpoint || !this.handlerAction)
      return;

    this.inboundEndpoint.removeEventListener(this.messageType, this.handlerAction);
  }

  /**
   * Dispatch a communication event.
   * @param information The event information.
   */
  protected dispatchEvent<T>(information: T): void {
    if(!this.manager)
      return;
    this.manager.dispatchEvent(information);
  }

  /**
   * Dispose the handler.
   */
  public dispose(): void {
    if (this.disposed)
      return;

    this.disposed = true;
    if (this.handlerAction) {
      this.detachCommandHandler();
    }
    this.handlerAction = null;

    if(this.manager) {
      this.manager.dispose();
    }
    this.manager = null;

    this.disposeCore();
  }
}
