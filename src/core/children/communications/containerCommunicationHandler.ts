import { CommunicationHandler } from './communicationHandler';
import { noop } from '../../../utilities/noop';
import { ICommunicationsEndpoint } from './iCommunicationsEndpoint';
import { ICommunicationsManager } from './iCommunicationsManager';
import { CommunicationEventKind, CommunicationEvent } from './communicationEvent';

/**
 * The communication handler methods.
 */
export class ContainerCommunicationHandlerMethods {
  /**
   * Call the container to signal that the content finished mounting.
   */
  public callMounterHandler: () => void = noop;
  /**
   * Call the container to signal an update is about to happen.
   */
  public callBeforeUpdateHandler: () => void = noop;
  /**
   * Call the container to signal an update finished.
   */
  public callUpdatedHandler: () => void = noop;
  /**
   * Call the container to signal dispose started.
   */
  public contentBeginDisposed: () => void = noop;
  /**
   * Call the container to signal the component has disposed(almost).
   */
  public contentDisposed: () => void = noop;
}

/**
 * Communication handler for the container(child component).
 */
export abstract class ContainerCommunicationHandler extends CommunicationHandler {
  protected containerMethods: ContainerCommunicationHandlerMethods | null;

  /**
   * Constructor.
   * @param messageType The message to handle.
   * @param inboundEndpoint The inbound "endpoint" to listen to.
   * @param manager The manager to handle outgoing communication.
   * @param containerMethods The container methods.
   */
  constructor(
    messageType: string,
    inboundEndpoint: ICommunicationsEndpoint,
    manager: ICommunicationsManager,
    containerMethods: ContainerCommunicationHandlerMethods
  ) {
    super(messageType, inboundEndpoint, manager);
    this.containerMethods = containerMethods;
  }

  /**
   * @inheritdoc
   */
  protected handleEventCore(e: CommunicationEvent): void {
    if (!this.containerMethods)
      return;

    switch (e.kind) {
      case CommunicationEventKind.Mounted:
        this.containerMethods.callMounterHandler();
        break;
      case CommunicationEventKind.BeforeUpdate:
        this.containerMethods.callBeforeUpdateHandler();
        break;
      case CommunicationEventKind.Updated:
        this.containerMethods.callUpdatedHandler();
        break;
      case CommunicationEventKind.BeforeDispose:
        this.containerMethods.contentBeginDisposed();
        break;
      case CommunicationEventKind.Disposed:
        this.containerMethods.contentDisposed();
        break;
      default:
        throw new Error(`The "${e.kind}" event is not configured.`)
    }
  }

  /**
   * @inheritdoc
   */
  protected disposeCore(): void {
    this.containerMethods = null;
  }

  /**
   * Reuest that the content begins disposing.
   */
  public requestContentDispose(): void {
    this.dispatchEvent(new CommunicationEvent(CommunicationEventKind.BeforeDispose));
  }
}
