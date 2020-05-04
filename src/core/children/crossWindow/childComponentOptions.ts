import { ChildComponentOptions } from '../childComponentOptions';
import { ChildComponentType } from '../childComponentType';

/**
 * Cross Window Child Component Options.
 */
export class CrossWindowChildComponentOptions extends ChildComponentOptions {
  url: string = 'about:blank';
  createEmbedElement?: (el: HTMLElement) => HTMLElement;
  embededAttributes?: { [key: string]: string };

  /**
   * Constructor.
   */
  constructor() {
    super();
    this.type = ChildComponentType.CrossWindow;
  }
}
