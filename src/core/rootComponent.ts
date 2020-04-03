import { RootComponentOptions } from './rootComponentOptions';
import { RootComponentFacade } from './rootComponentFacade';
import { getRandomString } from '../utilities/index';
import { Component } from './component';
import { ComponentEventType } from './componentEvent';
import { ChildComponent, ChildComponentFactory, ChildComponentOptions } from './children/index';

export class RootComponent extends Component {
  private children: { [id: string]: ChildComponent | null };
  constructor(window: Window, options: RootComponentOptions) {
    super(window, options);
    this.children = {};
  }

  private scheduleDisposeChild(child: ChildComponent): void {
    // Schedule this later
    this.getWindow().setTimeout(() => {
      this.disposeChildByRef(child);
    }, 0);
  }

  private getChildId(child: ChildComponent): string | null {
    const childIds = Object.keys(this.children);
    for (let index = 0; index < childIds.length; index++) {
      const id = childIds[index];
      if (this.children[id] === child) {
        return id;
      }
    }

    return null;
  }

  private disposeChildByRef(child: ChildComponent): Promise<void> {
    return this.disposeChild(this.getChildId(child));
  }

  private disposeChild(childId: string | null): Promise<void> {
    const child = childId
      ? this.children[childId]
      : null;

    if (!child)
      return Promise.resolve();

    return child
      .dispose()
      .then(() => {
        this.children[(<string>childId)] = null;
      });
  }

  protected mountCore(): Promise<void> {
    this.callHandler(ComponentEventType.Mounted);
    return super.mountCore();
  }

  public addChild(options: ChildComponentOptions): string {
    if (!this.isMounted)
      throw new Error('Wait for the component to mount before starting to add children.');

    const factory = new ChildComponentFactory();
    const child = factory.createComponent(
      this.getWindow(),
      options,
      new RootComponentFacade((child) => this.scheduleDisposeChild(child))
    );

    let id: string;
    do {
      id = 'c_' + getRandomString();
    } while (Object.keys(this.children).indexOf(id) !== -1);

    this.children[id] = child;
    this.getWindow().setTimeout(() => {
      child
        .initialize()
        .then((t) => t.mount());
    }, 0);
    return id;
  }

  public removeChild(childId: string): void {
    this.getWindow().setTimeout(() => {
      this.disposeChild(childId);
    }, 0);
  }
}
