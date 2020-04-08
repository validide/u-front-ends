import { ChildComponentFactory, ChildComponentOptions, RootComponentFacade, ChildComponent, ContainerCommunicationHandlerMethods, ContainerCommunicationHandler, CommunicationHandler, CommunicationEvent, ICommunicationsManager, CommunicationEventKind } from "../../src";

export class MockChildComponentFactory extends ChildComponentFactory {
  public createComponent(window: Window, options: ChildComponentOptions, rootFacade: RootComponentFacade): ChildComponent {
    return new MockChildComponent(window, options, rootFacade)
  }
}


export class MockChildComponent extends ChildComponent {
  _rootFacade: RootComponentFacade;
  constructor(window: Window, options: ChildComponentOptions, rootFacade: RootComponentFacade) {
    super(window, options, rootFacade);
    this._rootFacade = rootFacade;
  }

  protected getCommunicationHandlerCore(methods: ContainerCommunicationHandlerMethods): ContainerCommunicationHandler {
    return new MockContainerCommunicationHandler(
      'click',
      <HTMLElement>this.rootElement,
      new MockCommunicationManager(),
      methods
    );
  }

  protected disposeCore(): Promise<void> {
    return Promise.resolve()
  }

  public signalDisposeToParent() {
    this._rootFacade.signalDisposed(this);
  }
}

export class MockContainerCommunicationHandler extends ContainerCommunicationHandler {
}

export class MockCommunicationHandler extends CommunicationHandler {
  protected handleEventCore(e: CommunicationEvent): void {
  }
  protected disposeCore(): void {
  }
}

export class MockCommunicationManager implements ICommunicationsManager {
  readEvent(e: Event): CommunicationEvent {
    return new CommunicationEvent(CommunicationEventKind.Mounted);
  }
  dispatchEvent<T>(information: T): void {
  }
  dispose(): void {
  }

}
