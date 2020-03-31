import { ChildComponent } from "./index";

export class RootComponentFacade {
  public signalDisposed: (child: ChildComponent) => void;

  constructor(
    signalDisposed: (child: ChildComponent) => void
  ) {
    this.signalDisposed = signalDisposed;
  }
}
