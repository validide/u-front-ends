import { ContentCommunicationHandler, CommunicationsEvent, CommunicationsManager } from '../communications/index';
import { HTMLElementCommunicationsManager } from '../communications/htmlElementManager';

/**
 * @inheritdoc
 */
export class InWindowContentCommunicationHandler extends ContentCommunicationHandler {
  /**
   * Constructor.
   * @param el The element to use for sending and receiving messages.
   * @param disposeCommandCallback The callback for disposing the content.
   */
  constructor(communicationsManager: CommunicationsManager, disposeCommandCallback: () => void) {
    super(communicationsManager, disposeCommandCallback);
  }
}
