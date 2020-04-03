import { AdapterEvent, AdapterEventName } from './adapterEvent';
import { BaseAdapter } from './baseAdapter';

export abstract class ContentAdapter extends BaseAdapter {
  private disposeCommandCallback: (() => void) | null;

  constructor(disposeCommandCallback: () => void) {
    super();
    this.disposeCommandCallback = disposeCommandCallback;
  }

  protected handleEventCore(e: AdapterEvent): void {
    switch(e.name){
      case AdapterEventName.BeforeDispose:
      case AdapterEventName.Disposed:
        if (this.disposeCommandCallback) {
          this.disposeCommandCallback();
        }
      default:
        throw new Error(`The "${e.name}" event is not configured.`)

    }
  }

  public dispatchMounted(): void {
    this.dispatchEvent(new AdapterEvent(AdapterEventName.Mounted));
  }

  public dispatchBeforeUpdate (): void {
    this.dispatchEvent(new AdapterEvent(AdapterEventName.BeforeUpdate));
  }

  public dispatchUpdated(): void {
    this.dispatchEvent(new AdapterEvent(AdapterEventName.Updated));
  }

  public dispatchBeforeDispose(): void {
    this.dispatchEvent(new AdapterEvent(AdapterEventName.BeforeDispose));
  }

  public dispatchDisposed(): void {
    this.dispatchEvent(new AdapterEvent(AdapterEventName.Disposed));
  }

  protected disposeCore(): void {
    this.disposeCommandCallback = null;
  }
}
