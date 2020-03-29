import { ChildContentBridge } from '../../childContentBridge';
import { ChildComponentOptions } from '../../childComponentOptions';
import { ChildComponentType } from '../../childComponentType';

export class ScriptChildComponentOptions extends ChildComponentOptions {
  public inject: (el: HTMLElement, bridge: ChildContentBridge) => void = () => { throw new Error('Inject method not defined!'); };
  public skipResourceLoading: () => boolean = () => { return false; };

  constructor() {
    super();
    this.type = ChildComponentType.Script;
  }
}
