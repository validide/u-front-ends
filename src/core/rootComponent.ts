import { RootComponentOptions } from './rootComponentOptions';
import { RootComponentFacade } from './rootComponentFacade';
import { Component } from './component';
import { ComponentEventType } from './componentEvent';
import { ChildComponentOptions } from './children/index';

/**
 * The root component to host the rest of the components.
 * There is not limitation right no but ideally there should only be one of these on a page.
 */
export class RootComponent extends Component {
  private children: { [id: string]: Component | null };
  constructor(window: Window, options: RootComponentOptions) {
    super(window, options);
    this.children = {};
  }

  /**
   * Schedule the disposing of the child on exiting the function.
   * The dispose method is async but we do not want to wait for that.
   *
   * @param child The child that was disposed.
   */
  private scheduleDisposeChild(child: Component): void {
    // Schedule this later
    this.getWindow().setTimeout(async () => {
      await this.disposeChildByRef(child);
    }, 0);
  }

  /**
   * Dispose a child using it's reference.
   *
   * @param child
   */
  private disposeChildByRef(child: Component): Promise<void> {
    return this.disposeChild(child.id);
  }

  /**
   * Dispose a child by using it's id.
   *
   * @param childId The child identifier.
   */
  private async disposeChild(childId: string | null): Promise<void> {
    const child = this.getChild(childId);

    if (!child)
      return Promise.resolve();

    await child.dispose();
    this.children[(childId as string)] = null;
  }

  /**
   * @@inheritdoc
   */
  protected mountCore(): Promise<void> {
    this.callHandler(ComponentEventType.Mounted);
    return super.mountCore();
  }

  /**
   * Add a child component.
   *
   * @param options Child component options.
   */
  public async addChild(options: ChildComponentOptions): Promise<string> {
    if (!this.isInitialized)
      throw new Error('Wait for the component to initialize before starting to add children.');

    if (!this.isMounted)
      throw new Error('Wait for the component to mount before starting to add children.');

    const child = (this.options as RootComponentOptions).childFactory.createComponent(
      this.getWindow(),
      options,
      new RootComponentFacade(this.scheduleDisposeChild.bind(this))
    );

    const id = (await child.initialize()).id;
    this.children[id] = child;
    await child.mount();
    return id;
  }

  /**
   * Get the child with the given identifier.
   *
   * @param id The child identifier.
   */
  public getChild(id: string|null): Component | null {
    return id ? (this.children[id] || null) : null;
  }

  /**
   * Remove a child component.
   *
   * @param id The child component identifier.
   */
  public removeChild(id: string): Promise<void> {
    return this.disposeChild(id);
  }
}
