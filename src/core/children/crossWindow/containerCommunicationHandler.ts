import { getHashCode } from "../../../utilities/getHashCode";
import type { CrossWindowCommunicationsManager } from "../communications/crossWindowManager";
import {
  CommunicationsEvent,
  CommunicationsEventKind,
  ContainerCommunicationHandler,
  type ContainerCommunicationHandlerMethods,
} from "../communications/index";

/**
 * @inheritdoc
 */
export class CrossWindowContainerCommunicationHandler extends ContainerCommunicationHandler {
  private embedId: string;

  /**
   * Constructor.
   *
   * @param communicationsManager A communications manager.
   * @param embedId The Id of the embedded element.
   * @param containerMethods The methods to communicate with the container.
   */
  constructor(
    communicationsManager: CrossWindowCommunicationsManager,
    embedId: string,
    containerMethods: ContainerCommunicationHandlerMethods,
  ) {
    super(communicationsManager, containerMethods);
    this.embedId = embedId;
  }

  /**
   * @inheritdoc
   */
  protected handleEventCore(e: CommunicationsEvent): void {
    if (!this.embedId) return;

    if (!e.contentId && e.kind === CommunicationsEventKind.Mounted) {
      this.attemptHandShake(e);
      return;
    }

    if (this.embedId !== e.contentId) return;

    super.handleEventCore(e);
  }

  /**
   * Attempt a handshake with the content.
   */
  private attemptHandShake(e: CommunicationsEvent): void {
    const hash = getHashCode(this.embedId).toString(10);
    const response = new CommunicationsEvent(CommunicationsEventKind.Mounted);

    // We got a message back so if the data matches the hash we sent send the id
    if (e.data && e.data === hash) {
      response.contentId = this.embedId;
    } else {
      response.data = hash;
    }
    this.send(response);
  }
}
