import { noop } from '../utilities/noop';

export class ChildContentBridge {
  public dispatchMounted: () => void;
  public dispatchBeforeUpdate: () => void;
  public dispatchUpdated: () => void;
  public dispatchBeforeDispose: () => void;
  public dispatchDisposed: () => void;
  public disposeCommandListener: () => void;

  constructor(
    dispatchMounted: () => void,
    dispatchBeforeUpdate: () => void,
    dispatchUpdated: () => void,
    dispatchBeforeDispose: () => void,
    dispatchDisposed: () => void
  ) {
    this.dispatchMounted = dispatchMounted;
    this.dispatchBeforeUpdate = dispatchBeforeUpdate;
    this.dispatchUpdated = dispatchUpdated;
    this.dispatchBeforeDispose = dispatchBeforeDispose;
    this.dispatchDisposed = dispatchDisposed;
    this.disposeCommandListener = noop;
  }

  public setDisposeCommandListener(handler: () => void): void {
    this.disposeCommandListener = handler;
  }
}
