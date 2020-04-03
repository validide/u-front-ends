import { noop } from '../utilities/noop';

export class WrapperAdapterMethods {
  public callMounterHandler: () => void = noop;
  public callBeforeUpdateHandler: () => void = noop;
  public callUpdatedHandler: () => void = noop;
  public contentBeginDisposed: () => void = noop;
  public contentDisposed: () => void = noop;
}

import { AdapterEvent, AdapterEventName } from './adapterEvent';
import { BaseAdapter } from './baseAdapter';
export abstract class WrapperAdapter extends BaseAdapter {
  protected el: HTMLElement | null;
  protected wrapperMethods: WrapperAdapterMethods | null;

  constructor(el: HTMLElement, wrapperMethods: WrapperAdapterMethods) {
    super();
    this.el = el;
    this.wrapperMethods = wrapperMethods;
  }

  protected handleEventCore(e: AdapterEvent): void {
    if (!this.wrapperMethods)
      return;

    switch (e.name) {
      case AdapterEventName.Mounted:
        this.wrapperMethods.callMounterHandler();
        break;
      case AdapterEventName.BeforeUpdate:
        this.wrapperMethods.callBeforeUpdateHandler();
        break;
      case AdapterEventName.Updated:
        this.wrapperMethods.callUpdatedHandler();
        break;
      case AdapterEventName.BeforeDispose:
        this.wrapperMethods.contentBeginDisposed();
        break;
      case AdapterEventName.Disposed:
        this.wrapperMethods.contentDisposed();
        break;
      default:
        throw new Error(`The "${name}" event is not configured.`)
    }
  }

  protected disposeCore(): void {
    this.el = null;
    this.wrapperMethods = null;
  }


  public abstract requestContentDispose(): void;
}
