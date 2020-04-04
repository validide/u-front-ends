import { CommunicationHandler } from './communicationHandler';
import { ICommunicationsEndpoint } from './iCommunicationsEndpoint';
import { ICommunicationsManager } from './iCommunicationsManager';
import { CommunicationEvent, CommunicationEventKind } from './communicationEvent';

export abstract class ContentCommunicationHandler extends CommunicationHandler {
  private disposeCommandCallback: (() => void) | null;

  constructor(
    type: string,
    endpoint: ICommunicationsEndpoint,
    manager: ICommunicationsManager,
    disposeCommandCallback: () => void
  ) {
    super(type, endpoint, manager);
    this.disposeCommandCallback = disposeCommandCallback;
  }

  protected handleEventCore(e: CommunicationEvent): void {
    switch(e.kind){
      case CommunicationEventKind.BeforeDispose:
      case CommunicationEventKind.Disposed:
        if (this.disposeCommandCallback) {
          this.disposeCommandCallback();
        }
      default:
        throw new Error(`The "${e.kind}" event is not configured.`);
    }
  }

  public dispatchMounted(): void {
    this.dispatchEvent(new CommunicationEvent(CommunicationEventKind.Mounted));
  }

  public dispatchBeforeUpdate (): void {
    this.dispatchEvent(new CommunicationEvent(CommunicationEventKind.BeforeUpdate));
  }

  public dispatchUpdated(): void {
    this.dispatchEvent(new CommunicationEvent(CommunicationEventKind.Updated));
  }

  public dispatchBeforeDispose(): void {
    this.dispatchEvent(new CommunicationEvent(CommunicationEventKind.BeforeDispose));
  }

  public dispatchDisposed(): void {
    this.dispatchEvent(new CommunicationEvent(CommunicationEventKind.Disposed));
  }

  protected disposeCore(): void {
    this.disposeCommandCallback = null;
  }
}
