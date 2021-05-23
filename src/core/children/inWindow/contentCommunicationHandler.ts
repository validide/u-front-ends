import { CommunicationsManager, ContentCommunicationHandler, ContentCommunicationHandlerMethods } from '../communications/index';

/**
 * @inheritdoc
 */
export class InWindowContentCommunicationHandler extends ContentCommunicationHandler {
  /**
   * Constructor.
   *
   * @param el The element to use for sending and receiving messages.
   * @param methods The callback to dispose the content.
   */
  constructor(communicationsManager: CommunicationsManager, methods: ContentCommunicationHandlerMethods) {
    super(communicationsManager, methods);
  }
}
