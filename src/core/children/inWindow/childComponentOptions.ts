import { ChildComponentOptions } from "../childComponentOptions";

/**
 * In Window Child Component Options.
 */
export class InWindowChildComponentOptions extends ChildComponentOptions {
  // constructor omitted — base class constructor is sufficient

  /**
   * Injection function for the component.
   */
  public inject?: (el: HTMLElement) => void;
}
