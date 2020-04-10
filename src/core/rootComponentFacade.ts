import { Component } from "./index";

/**
 * Facade to interface with the the root component.
 */
export class RootComponentFacade {
  /**
   * Signal to the root component that the child was disposed.
   */
  public signalDisposed: (child: Component) => void;

  /**
   * Constructor.
   * @param signalDisposed The function to invoke to signal that the child was disposed.
   */
  constructor(
    signalDisposed: (child: Component) => void
  ) {
    this.signalDisposed = signalDisposed;
  }
}
