/**
 * The type of child component.
 */
export enum ChildComponentType {
  /**
   * In window component(JavaScript or WebComponent Custom Element)
   */
  InWindow = 'inWindow',
  /**
   * Cross window component(loaded in an emendable element - Iframe)
   */
  CrossWindow = 'crossWindow'
}
