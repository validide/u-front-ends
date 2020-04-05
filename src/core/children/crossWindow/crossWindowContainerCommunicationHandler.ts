import { ContainerCommunicationHandlerMethods, CommunicationEvent, ContainerCommunicationHandler, CommunicationEventKind } from '../communications/index';
import { CrossWindowCommunicationManager } from './crossWindowCommunicationManager';
import { getHashCode } from '../../../utilities/getHashCode';

export class CrossWindowContainerCommunicationHandler extends ContainerCommunicationHandler {
  private iframeId: string;

  constructor(
    inboundEndpoint: Window,
    outboundEndpoint: Window,
    iframeId: string,
    origin: string,
    wrapperMethods: ContainerCommunicationHandlerMethods
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
      wrapperMethods
    );
    this.iframeId = iframeId;
  }

  protected handleEventCore(e: CommunicationEvent): void {
    if (!this.iframeId)
      return;

    if (!e.contentId && e.kind === CommunicationEventKind.Mounted) {
      this.attemptHandShake(e);
      return;
    }

    if (this.iframeId !== e.contentId)
      return;

    super.handleEventCore(e);
  }

  private attemptHandShake(e: CommunicationEvent): void{
    const hash = getHashCode(this.iframeId).toString(10);
    const response = new CommunicationEvent(CommunicationEventKind.Mounted);

    // We got a message back so if the data matches the hash we sent send the id
    if (e.data && e.data === hash) {
      response.contentId = this.iframeId;
    } else {
      response.data = hash;
    }
    this.dispatchEvent(response);
  }
}
