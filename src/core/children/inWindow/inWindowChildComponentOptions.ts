import { ChildComponentOptions } from '../childComponentOptions';

export class InWindowChildComponentOptions extends ChildComponentOptions {
  public inject?: (el: HTMLElement) => void;

  constructor() {
    super();

  }
}
