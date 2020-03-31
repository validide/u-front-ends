import { ChildComponentOptions } from './childComponentOptions';
import { ChildContentBridge } from './childContentBridge';
import { Component } from './component';
import { ComponentEventType } from './componentEvent';
import { RootComponentFacade } from './rootComponentFacade';

export abstract class ChildComponent extends Component {
  private rootFacade: RootComponentFacade | null;
  private childContentBridge: ChildContentBridge | null;
  private contentDisposePromise: Promise<void> | null;
  private contentDisposePromiseResolver: (() => void) | null;

  constructor(window: Window, options: ChildComponentOptions, rootFacade: RootComponentFacade) {
    super(window, options);
    this.rootFacade = rootFacade;
    this.childContentBridge = null;
    this.contentDisposePromise = null;
    this.contentDisposePromiseResolver = null;
  }

  protected getChildContentBridge(): ChildContentBridge {
    if (!this.childContentBridge) {
      this.childContentBridge = new ChildContentBridge(
        () => this.callHandler(ComponentEventType.Mounted),
        () => this.callHandler(ComponentEventType.BeforeUpdate),
        () => this.callHandler(ComponentEventType.Updated),
        () => this.contentBeginDisposed(),
        () => this.contentDisposed()
      );
    }
    return this.childContentBridge;
  }

  protected getOptions(): ChildComponentOptions {
    return <ChildComponentOptions>super.getOptions();
  }

  private contentBeginDisposed(): void {
    if (this.contentDisposePromise !== null)
      return; // Dispose has already started.

    this.setContentDisposePromise();
    // Inform parent the content is beeing disposed.
    (<RootComponentFacade>this.rootFacade).signalDisposed(this);
  }

  private startDisposingContent(): void {
    if (this.contentDisposePromise !== null)
      return; // Dispose has already started.

    this.setContentDisposePromise();

    // This should trigger the child component dispose.
    this.getChildContentBridge().disposeCommandListener();
  }

  private setContentDisposePromise(): void {
    if (this.contentDisposePromise !== null)
      return;

    this.contentDisposePromise = Promise
      .race<void>([
        new Promise<void>((resolver, rejecter) => {
          this.contentDisposePromiseResolver = resolver;
        }),
        new Promise<void>((resolveTimeout, rejectTimeout) => {
          this
            .getWindow()
            .setTimeout(
              () => rejectTimeout(),
              this.getOptions().contentDisposeTimeout
            );
        })
      ])
      .catch((err) => {
        this.callErrorHandler(err);
      });
  }

  private contentDisposed(): void {
    if (this.contentDisposePromiseResolver === null) {
      // For some reason we got the disposed call without getting the 'beginDispose' call.
      this.contentDisposePromise = Promise.resolve();
      (<RootComponentFacade>this.rootFacade).signalDisposed(this);
    } else {
      this.contentDisposePromiseResolver();
    }
  }

  protected async disposeCore(): Promise<void> {
    this.startDisposingContent();
    await (<Promise<void>>this.contentDisposePromise);

    this.childContentBridge = null;
    this.contentDisposePromiseResolver = null;
    this.contentDisposePromise = null;
    await super.disposeCore();
  }
}
