import { ChildComponentOptions } from '../childComponentOptions';

export class CrossWindowChildComponentOptions extends ChildComponentOptions {
  url: string = 'about:blank';
  inject?: (el: HTMLElement) => string;
  iframeAttributes?: { [key: string]: string; }
}
