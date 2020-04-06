import { ChildComponent } from "./index";

/**
 * Facade to interface with the the root component.
 */
export class RootComponentFacade {
  /**
   * Signal to the root component that the child was disposed.
   */
  public signalDisposed: (child: ChildComponent) => void;

  /**
   * Constructor.
   * @param signalDisposed The function to invoke to signal that the child was disposed.
   */
  constructor(
    signalDisposed: (child: ChildComponent) => void
  ) {
    this.signalDisposed = signalDisposed;
  }
}
