import {
  ChildComponentFactory,
  ChildComponentOptions,
  RootComponentFacade,
  ChildComponent,
  ContainerCommunicationHandlerMethods,
  ContainerCommunicationHandler,
  CommunicationsEvent,
  Component
} from '../../src';
import { MockCommunicationsManager } from './mockCommunicationsManager';

export class MockChildComponentFactory extends ChildComponentFactory {
  public createComponent(window: Window, options: ChildComponentOptions, rootFacade: RootComponentFacade): Component {
    return new MockChildComponent(window, options, rootFacade);
  }
}


export class MockChildComponent extends ChildComponent {
  _rootFacade: RootComponentFacade;
  public callsTo_getCommunicationHandlerCore = 0;
  public comunicationMethods: ContainerCommunicationHandlerMethods = new ContainerCommunicationHandlerMethods();
  public public_containerCommunicationHandler: ContainerCommunicationHandler | null = null;

  constructor(window: Window, options: ChildComponentOptions, rootFacade: RootComponentFacade) {
    super(window, options, rootFacade);
    this._rootFacade = rootFacade;
  }

  protected getCommunicationHandlerCore(methods: ContainerCommunicationHandlerMethods): ContainerCommunicationHandler {
    this.callsTo_getCommunicationHandlerCore++;
    this.comunicationMethods = methods;

    if ((this.rootElement as HTMLElement).tagName.toLowerCase() === 'ce-dipose-tests-null-handler') {
      return null as unknown as ContainerCommunicationHandler;
    }

    this.public_containerCommunicationHandler = new MockContainerCommunicationHandler(
      new MockCommunicationsManager(
        this.rootElement as HTMLElement,
        CommunicationsEvent.CONTENT_EVENT_TYPE,
        this.rootElement as HTMLElement,
        CommunicationsEvent.CONTAINER_EVENT_TYPE
      ),
      methods
    );
    return this.public_containerCommunicationHandler;
  }

  public disposeCore(): Promise<void> {
    if ((this.rootElement as HTMLElement).tagName.toLowerCase() === 'ce-dipose-tests') {
      return super.disposeCore();
    }
    return Promise.resolve();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public signalDisposeToParent() {
    this._rootFacade.signalDisposed(this);
  }
}

export class MockContainerCommunicationHandler extends ContainerCommunicationHandler {
  public calls_requestContentDispose = 0;
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public requestContentDispose() {
    this.calls_requestContentDispose++;
    super.requestContentDispose();
  }
}
