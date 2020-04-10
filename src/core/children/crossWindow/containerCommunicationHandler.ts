import { ContainerCommunicationHandlerMethods, CommunicationsEvent, ContainerCommunicationHandler, CommunicationsEventKind } from '../communications/index';
import { getHashCode } from '../../../utilities/getHashCode';
import { CrossWindowCommunicationsManager } from '../communications/crossWindowManager';

/**
 * @inheritdoc
 */
export class CrossWindowContainerCommunicationHandler extends ContainerCommunicationHandler<Window> {
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
      new CrossWindowCommunicationsManager(
        inboundEndpoint,
        CommunicationsEvent.CONTENT_EVENT_TYPE,
        outboundEndpoint,
        CommunicationsEvent.CONTAINER_EVENT_TYPE,
        origin
      ),
      containerMethods
    );
    this.embedId = embedId;
  }

  /**
   * @inheritdoc
   */
  protected handleEventCore(e: CommunicationsEvent): void {
    if (!this.embedId)
      return;

    if (!e.contentId && e.kind === CommunicationsEventKind.Mounted) {
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
  private attemptHandShake(e: CommunicationsEvent): void{
    const hash = getHashCode(this.embedId).toString(10);
    const response = new CommunicationsEvent(CommunicationsEventKind.Mounted);

    // We got a message back so if the data matches the hash we sent send the id
    if (e.data && e.data === hash) {
      response.contentId = this.embedId;
    } else {
      response.data = hash;
    }
    this.communicationsManager?.send(response);
  }
}
