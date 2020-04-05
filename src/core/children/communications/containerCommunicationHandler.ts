import { CommunicationHandler } from './communicationHandler';
import { noop } from '../../../utilities/noop';
import { ICommunicationsEndpoint } from './iCommunicationsEndpoint';
import { ICommunicationsManager } from './iCommunicationsManager';
import { CommunicationEventKind, CommunicationEvent } from './communicationEvent';

export class ContainerCommunicationHandlerMethods {
  public callMounterHandler: () => void = noop;
  public callBeforeUpdateHandler: () => void = noop;
  public callUpdatedHandler: () => void = noop;
  public contentBeginDisposed: () => void = noop;
  public contentDisposed: () => void = noop;
}

export abstract class ContainerCommunicationHandler extends CommunicationHandler {
  protected wrapperMethods: ContainerCommunicationHandlerMethods | null;

  constructor(
    messageType: string,
    inboundEndpoint: ICommunicationsEndpoint,
    manager: ICommunicationsManager,
    wrapperMethods: ContainerCommunicationHandlerMethods
  ) {
    super(messageType, inboundEndpoint, manager);
    this.wrapperMethods = wrapperMethods;
  }

  protected handleEventCore(e: CommunicationEvent): void {
    if (!this.wrapperMethods)
      return;

    switch (e.kind) {
      case CommunicationEventKind.Mounted:
        this.wrapperMethods.callMounterHandler();
        break;
      case CommunicationEventKind.BeforeUpdate:
        this.wrapperMethods.callBeforeUpdateHandler();
        break;
      case CommunicationEventKind.Updated:
        this.wrapperMethods.callUpdatedHandler();
        break;
      case CommunicationEventKind.BeforeDispose:
        this.wrapperMethods.contentBeginDisposed();
        break;
      case CommunicationEventKind.Disposed:
        this.wrapperMethods.contentDisposed();
        break;
      default:
        throw new Error(`The "${e.kind}" event is not configured.`)
    }
  }

  protected disposeCore(): void {
    this.wrapperMethods = null;
  }


  public requestContentDispose(): void {
    this.dispatchEvent(new CommunicationEvent(CommunicationEventKind.BeforeDispose));
  }
}
