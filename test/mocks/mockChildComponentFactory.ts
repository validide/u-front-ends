import { ChildComponentFactory, ChildComponentOptions, RootComponentFacade, ChildComponent, ContainerCommunicationHandlerMethods, ContainerCommunicationHandler, CommunicationHandler, CommunicationEvent, ICommunicationsManager, CommunicationEventKind } from "../../src";

export class MockChildComponentFactory extends ChildComponentFactory {
  public createComponent(window: Window, options: ChildComponentOptions, rootFacade: RootComponentFacade): ChildComponent {
    return new MockChildComponent(window, options, rootFacade)
  }
}


export class MockChildComponent extends ChildComponent {
  _rootFacade: RootComponentFacade;
  public callsTo_getCommunicationHandlerCore: number = 0;
  public comunicationMethods: ContainerCommunicationHandlerMethods = new ContainerCommunicationHandlerMethods();
  public public_containerCommunicationHandler: ContainerCommunicationHandler | null = null;

  constructor(window: Window, options: ChildComponentOptions, rootFacade: RootComponentFacade) {
    super(window, options, rootFacade);
    this._rootFacade = rootFacade;
  }

  protected getCommunicationHandlerCore(methods: ContainerCommunicationHandlerMethods): ContainerCommunicationHandler {
    this.callsTo_getCommunicationHandlerCore++;
    this.comunicationMethods = methods;

    if ((<HTMLElement>this.rootElement).tagName.toLowerCase() === 'ce-dipose-tests-null-handler'){
      return <ContainerCommunicationHandler><unknown>null;
    }

    this.public_containerCommunicationHandler = new MockContainerCommunicationHandler(
      'click',
      <HTMLElement>this.rootElement,
      new MockCommunicationManager(),
      methods
    );
    return this.public_containerCommunicationHandler;
  }

  public disposeCore(): Promise<void> {
    if ((<HTMLElement>this.rootElement).tagName.toLowerCase() === 'ce-dipose-tests'){
      return super.disposeCore();
    }
    return Promise.resolve()
  }

  public signalDisposeToParent() {
    this._rootFacade.signalDisposed(this);
  }
}

export class MockContainerCommunicationHandler extends ContainerCommunicationHandler {
  public calls_requestContentDispose = 0;
  public requestContentDispose() {
    this.calls_requestContentDispose++;
    super.requestContentDispose();
  }
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
