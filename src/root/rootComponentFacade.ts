import { ChildComponent } from "../children/childComponent";

export class RootComponentFacade {
  public signalDispose: (child: ChildComponent) => void;

  constructor(
    signalDispose: (child: ChildComponent) => void
  ) {
    this.signalDispose = signalDispose;
  }
}
