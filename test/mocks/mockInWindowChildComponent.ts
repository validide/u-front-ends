import {InWindowChildComponent, InWindowChildComponentOptions, ContainerCommunicationHandlerMethods, ContainerCommunicationHandler} from '../../src';

export class MockInWindowChildComponent extends InWindowChildComponent {
  public mountCore(): Promise<void> {
    return super.mountCore();
  }

  public getOptions(): InWindowChildComponentOptions {
    return super.getOptions();
  }

  public getCommunicationHandlerCore(methods: ContainerCommunicationHandlerMethods): ContainerCommunicationHandler {
    return super.getCommunicationHandlerCore(methods);
  }

  public getRootEl(): HTMLElement {
    return this.rootElement as HTMLElement;
  }
}
