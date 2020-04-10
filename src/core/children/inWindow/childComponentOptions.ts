import { ChildComponentOptions } from '../childComponentOptions';

/**
 * In Window Child Component Options.
 */
export class InWindowChildComponentOptions extends ChildComponentOptions {
  /**
   * Injection function for the component.
   */
  public inject?: (el: HTMLElement) => void;

  /**
   * Constructor.
   */
  constructor() {
    super();

  }
}
