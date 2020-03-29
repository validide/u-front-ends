import { ChildContentBridge } from '../childContentBridge';
import { ChildComponentOptions } from '../childComponentOptions';
import { ChildComponentType } from '../childComponentType';

export class ScriptChildComponentOptions extends ChildComponentOptions {
  public injectBridge: (bridge: ChildContentBridge) => void = () => { throw new Error('Bridge injection method not defined!'); };
  public skipResourceLoading: () => boolean = () => { return false; };

  constructor() {
    super();
    this.type = ChildComponentType.Script;
  }
}
