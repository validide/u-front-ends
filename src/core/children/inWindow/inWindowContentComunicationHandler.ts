import { ContentCommunicationHandler, CommunicationEvent } from '../communications/index';
import { InWindowCommunicationManager } from './inWindowCommunicationManager';

export class InWindowContentCommunicationHandler extends ContentCommunicationHandler {
  constructor(el: HTMLElement, disposeCommandCallback: () => void) {
    super(
      CommunicationEvent.CONTAINER_EVENT_TYPE,
      el,
      new InWindowCommunicationManager(
        el,
        CommunicationEvent.CONTAINER_EVENT_TYPE,
        CommunicationEvent.CONTENT_EVENT_TYPE),
      disposeCommandCallback
    );
  }
}
