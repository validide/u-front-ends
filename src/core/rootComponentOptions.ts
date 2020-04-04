import { ComponentOptions } from "./componentOptions";
import { ChildComponentFactory } from "./children/childComponentFactory";

export class RootComponentOptions extends ComponentOptions {
  public childFactory: ChildComponentFactory;
  constructor() {
    super();
    this.tag = 'script';
    this.childFactory = new ChildComponentFactory();
  }
}
