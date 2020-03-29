import { ChildComponent } from "./index";

export class RootComponentFacade {
  public signalDispose: (child: ChildComponent) => void;

  constructor(
    signalDispose: (child: ChildComponent) => void
  ) {
    this.signalDispose = signalDispose;
  }
}
