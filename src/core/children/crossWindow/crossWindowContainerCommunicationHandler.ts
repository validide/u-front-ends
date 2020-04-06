import { ContainerCommunicationHandlerMethods, CommunicationEvent, ContainerCommunicationHandler, CommunicationEventKind } from '../communications/index';
import { CrossWindowCommunicationManager } from './crossWindowCommunicationManager';
import { getHashCode } from '../../../utilities/getHashCode';

/**
 * @inheritdoc
 */
export class CrossWindowContainerCommunicationHandler extends ContainerCommunicationHandler {
  private embedId: string;

  /**
   * Constructor.
   * @param inboundEndpoint The inbound comunication endpoint.
   * @param outboundEndpoint The outbound communication endpoint.
   * @param embedId The Id of the embeded element.
   * @param origin The origin to communicate with.
   * @param containerMethods The methods to communicate with the container.
   */
  constructor(
    inboundEndpoint: Window,
    outboundEndpoint: Window,
    embedId: string,
    origin: string,
    containerMethods: ContainerCommunicationHandlerMethods
  ) {
    super(
      'message',
      inboundEndpoint,
      new CrossWindowCommunicationManager(
        outboundEndpoint,
        origin,
        CommunicationEvent.CONTENT_EVENT_TYPE,
        CommunicationEvent.CONTAINER_EVENT_TYPE
      ),
      containerMethods
    );
    this.embedId = embedId;
  }

  /**
   * @inheritdoc
   */
  protected handleEventCore(e: CommunicationEvent): void {
    if (!this.embedId)
      return;

    if (!e.contentId && e.kind === CommunicationEventKind.Mounted) {
      this.attemptHandShake(e);
      return;
    }

    if (this.embedId !== e.contentId)
      return;

    super.handleEventCore(e);
  }

  /**
   * Attempt a andshake with the content.
   */
  private attemptHandShake(e: CommunicationEvent): void{
    const hash = getHashCode(this.embedId).toString(10);
    const response = new CommunicationEvent(CommunicationEventKind.Mounted);

    // We got a message back so if the data matches the hash we sent send the id
    if (e.data && e.data === hash) {
      response.contentId = this.embedId;
    } else {
      response.data = hash;
    }
    this.dispatchEvent(response);
  }
}
