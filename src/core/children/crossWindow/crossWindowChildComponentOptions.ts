import { ChildComponentOptions } from '../childComponentOptions';
import { ChildComponentType } from '../childComponentType';

export class CrossWindowChildComponentOptions extends ChildComponentOptions {
  url: string = 'about:blank';
  createEmbedElement?: (el: HTMLElement) => HTMLElement;
  embededAttributes?: { [key: string]: string; };

  constructor() {
    super();
    this.type = ChildComponentType.CrossWindow;
  }
}
