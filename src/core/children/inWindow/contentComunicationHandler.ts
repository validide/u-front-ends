import { ContentCommunicationHandler, CommunicationsEvent } from '../communications/index';
import { HTMLElementCommunicationsManager } from '../communications/htmlElementManager';

/**
 * @inheritdoc
 */
export class InWindowContentCommunicationHandler extends ContentCommunicationHandler<HTMLElement> {
  /**
   * Constructor.
   * @param el The element to use for sending and receiving messages.
   * @param disposeCommandCallback The callback for disposing the content.
   */
  constructor(el: HTMLElement, disposeCommandCallback: () => void) {
    super(
      new HTMLElementCommunicationsManager(
        el,
        CommunicationsEvent.CONTAINER_EVENT_TYPE,
        el,
        CommunicationsEvent.CONTENT_EVENT_TYPE
      ),
      disposeCommandCallback
    );
  }
}
