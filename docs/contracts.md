# Component Contracts

## Base Component - `BaseComponent`
The base class for all components


### Methods
Methods from the base component.

#### Initialize
Initialize the component.

#### Mount
Mount the component in the container.

#### Dispose
Destroy the component and try to clear the DOM of all related changes. Not all implementations support a full clean-up. 


### Members
Members from the base component.

#### IsInitialized
Specify if the component has been initialized.

#### IsMounted
Specify if the component has been mounted.


### Events
During the life cycle the component will trigger the following events.

#### Before Create - `beforeCreate`
Before the component is created and initialized.

#### Created - `created`
After the component is created and initialized.

#### Before Mount - `beforeMount`
Before the component is mounted.

#### Mounted - `mounted`
After the component is mounted.

#### Before Update - `beforeUpdate`
Before each time the component is updated.

#### Updated - `Updated`
After each time the component is updated.

#### Before Destroy - `beforeDestroy`
Before the component is destroyed.

#### Destroyed - `destroyed`
After the component is destroyed.


## Root Component - `Root`
The root component to handle all interactions between compoents, derived from `BaseComponent`.

### Methods
Root component specific methods.

#### Load plugin
Load plugins.

#### Resolve plugin
Resolve a plugins like:
 - `appConfiguration`
 - `logging`
 - `i18n`
 - `auth`
 - `helpCenter`

#### Load component
Load a child component.


## Child Component - `Child`
A child component, derived from `BaseComponent`. This can be one of the following types:
 - `ScriptChild` - a component loaded using JavaScript injected in a [&lt;script&gt;](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) tag.
 - `IfrmaeChild` - a component loaded using an [&lt;iframe&gt;](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe) tag. 
 - `WebComponentChild` - a component loaded the [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) standard.

