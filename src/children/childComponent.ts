import { Component, ComponentEventType } from '../base/index';
import { ChildContentBridge, ChildContentDisposeAction } from './childContentBridge';
import { ChildComponentOptions } from './childComponentOptions';
import { RootComponentFacade } from '../root/rootComponentFacade';

export abstract class ChildComponent extends Component {
  private rootFacade: RootComponentFacade | null;
  private childContentBridge: ChildContentBridge | null;
  private contentDisposePromise: Promise<void> | null;
  private childContentDisposeAction: ChildContentDisposeAction | null;

  constructor(window: Window, options: ChildComponentOptions, rootFacade: RootComponentFacade) {
    super(window, options);
    this.rootFacade = rootFacade;
    this.childContentBridge = new ChildContentBridge(
      () => this.callHandler(ComponentEventType.Mounted),
      () => this.callHandler(ComponentEventType.BeforeUpdate),
      () => this.callHandler(ComponentEventType.Updated),
      () => this.signalDispose(),
      (cb) => this.setContentDisposeCallback(cb)
    );
    this.childContentDisposeAction = null;
    this.contentDisposePromise = null;
  }

  protected getChildContentBridge(): ChildContentBridge {
    return <ChildContentBridge>this.childContentBridge;
  }

  protected getOptions(): ChildComponentOptions {
    return <ChildComponentOptions>super.getOptions();
  }

  private beginContentDispose(): void {
    if (this.contentDisposePromise !== null)
      return; // Dispose was already requested.

    if(this.childContentDisposeAction) {
      this.contentDisposePromise = Promise
      .race<void>([
        this.childContentDisposeAction(),
        new Promise<void>((resolveTimeout, rejectTimeout) =>{
          this
            .getWindow()
            .setTimeout(
              () => resolveTimeout(),
              this.getOptions().contentDisposeTimeout
            );
          })
      ])
      .catch((err) => {
        this.callErrorHandler(err);
      });
    } else {
      this.contentDisposePromise = Promise.resolve();
    }
  }

  private setContentDisposeCallback(callback: ChildContentDisposeAction): void {
    if(this.childContentDisposeAction)
      return;

    this.childContentDisposeAction = callback;
  }

  protected signalDispose(): void {
    if (this.contentDisposePromise !== null)
      return; // Dispose was initiated by "this".


    // Set the promise so we do not trigger it again;
    this.contentDisposePromise = Promise.resolve();
    (<RootComponentFacade>this.rootFacade).signalDispose(this);

  }

  protected async disposeCore(): Promise<void> {
    this.beginContentDispose();
    await (<Promise<void>>this.contentDisposePromise);

    this.childContentBridge = null;
    this.childContentDisposeAction = null;
    this.contentDisposePromise = null;
    await super.disposeCore();
  }
}
