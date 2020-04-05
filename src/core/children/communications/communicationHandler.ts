import { ICommunicationsEndpoint } from './iCommunicationsEndpoint';
import { ICommunicationsManager } from './iCommunicationsManager';
import { CommunicationEvent } from './communicationEvent';

export abstract class CommunicationHandler {
  private inboundEndpoint: ICommunicationsEndpoint | null;
  private messageType: string;
  private manager: ICommunicationsManager | null;
  private handlerAction: ((e: Event) => void) | null;
  private disposed: boolean;

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

  private handleEvent(e: Event): void {
    if(!this.manager)
      return;

    const evt = this.manager.readEvent(e);
    if (!evt)
      return;

    this.handleEventCore(evt);
  }

  protected abstract handleEventCore(e: CommunicationEvent): void
  protected abstract disposeCore(): void;

  private attachCommandHandler(): void {
    if(!this.inboundEndpoint || !this.handlerAction)
      return;

    this.inboundEndpoint.addEventListener(this.messageType, this.handlerAction);
  }

  private detachCommandHandler(): void{
    if(!this.inboundEndpoint || !this.handlerAction)
      return;

    this.inboundEndpoint.removeEventListener(this.messageType, this.handlerAction);
  }

  protected dispatchEvent<T>(information: T): void {
    if(!this.manager)
      return;
    this.manager.dispatchEvent(information);
  }

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
