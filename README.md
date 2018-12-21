# Ambient

[license-url]: https://opensource.org/licenses/MIT
[license-image]: https://img.shields.io/npm/l/make-coverage-badge.svg
[coverage-badge-green]: ./coverage/badge-statements.svg

[![License][license-image]][license-url]
![Coverage][coverage-badge-green]

Ambient is a simple global state manager for React (or not). 
It manages a single state object, allowing you to make and subscribe to changes, with options
for both higher-order components (like Redux) and wrapper elements (like React context).

- [Installation](#installation)
- [Example](#example)
- [Guide](#guide)
  - [Creating an Ambient store](#creating-an-ambient-store)
  - [Updating the state](#updating-the-state)
  - [Using with React](#usage-with-react)
    - [`<AmbientSubscriber>` wrapper component](#ambientsubscriber-wrapper-component)
    - [`withAmbient` higher-order component](#withambient-higher-order-component)
  - [Using without React](#using-without-react)
  - [On comparing Ambient states](#on-comparing-ambient-states)
- [More examples](#more-examples)
  - [React wrapper component (AmbientSubscriber)](#react-wrapper-component-ambientsubscriber)
  - [React higher-order component (withAmbient)](#react-higher-order-component)
  - [Manual API (no React)](#manual-api-no-react)

## Installation

```bash
$ npm install --save ambientjs
```


## Example

This example demonstrates usage with the `AmbientSubscriber` wrapper component, similar to how
the React context API works.
 
See [more examples](#more-examples) below for additional ways to use Ambient,
or take a look at the [Codepen](https://codepen.io/brombal/pen/gZmeYL) for a working sample.
 
```typescript jsx
import Ambient, { AmbientSubscriber } from 'ambient';

// Create an Ambient instance
const ambient = new Ambient({
  counter: 0,
  user: {
    name: "Example",
    email: "test@example.com"
  }
});

// Create a convenience method to update the counter. Not mandatory, but good practice.
function increaseCounter() {
  ambient.update(state => state.counter++);
}

class MyComponent extends React.Component {
  render() {
    return (
      <AmbientSubscriber store={ambient} on={state => state.counter}>
        {state => (
          <div>
            Counter value: {state.counter}
            <button onClick={() => increaseCounter()}>Increase!</button>
          </div>
        )}
      </AmbientSubscriber>
    )
  }
}
```


## Guide

### Creating an Ambient store

An instance of `Ambient` represents the "store." This is the state management object which
allows you to modify the state, subscribe to changes in the state, and get the current state value.

While nothing stops you from creating multiple Ambient instances, this is not a normal use case.
Your app will usually only contain a single instance, and many of the examples below rely on only
having a single instance.

- `new Ambient(initialState)`

    Creates a new Ambient instance.
    You will likely want to export the instance to use throughout your app.
    You can pass an initial state value to the constructor. 
    
    ```js
    import Ambient from 'ambient'; // TypeScript 
    const Ambient = require('ambient'); // JavaScript
    
    const ambient = new Ambient({ counter: 0 });
    ```

### Updating the state

- `ambient.update(updater: (draft) => any)`
    
    Modifies the current state. The `updater` method is invoked immediately, and receives 
    a "draft" copy of the entire state object. Within this method, you can modify the object directly 
    (recommended) or return a value which will replace the current state. *Be cautious using arrow 
    shorthand syntax: if you don't wrap the expression in curly braces, the expression's value 
    will be returned and will replace the current state.*
    
    ```js
    import Ambient from 'ambient';  
        
    const ambient = new Ambient({ counter: 0 });
      
    function increaseCounter(count = 1) {
      ambient.update(state => { state.counter += count; });
    }
    ```
    
    See [examples](#manual-api-no-react) for more usage.
  
  
### Using with React

There are two ways to use Ambient with React: the `AmbientSubscriber` wrapper component, and the
`withAmbient` higher-order component.

#### `<AmbientSubscriber>` wrapper component

The `AmbientSubscriber` wrapper component creates an element that will re-render its 
contents when the state changes. This is slightly simpler to use than the higher-order component,
but it doesn't work with your component's lifecycle methods (e.g. `componentDidUpdate` will not be 
called because of a change the in Ambient state).
 
The only child of the component must be a method that receives the current state and returns 
a React node:

```jsx
 <AmbientSubscriber store={ambient} on={state => state.counter}>
   {state => (
     <div>Counter value: {state.counter}</div>
   )}
 </AmbientSubscriber>
```

The child function will be invoked whenever the state updates according to the `on` 
comparison callback.

The `store` prop is the Ambient store instance you want to subscribe to.

The `on` prop is the comparison function that determines which part of the store to watch for changes. 
See [on comparing Ambient states](#on-comparing-ambient-states) for details.


#### `withAmbient` higher-order component

`withAmbient` is a higher-order component that passes the Ambient state as a prop to your 
component, allowing you to respond to changes using `componentDidUpdate` and other lifecycle 
methods. 

- `withAmbient(ambient: Ambient, compare: (state) => any)(Component)`

    This is a typical higher-order component function that accepts two parameters: the Ambient
    store instance, and a comparison method. Your component 
    will receive the entire state object as `this.props.ambient`, but will only be re-rendered 
    when the comparison function returns a non-equivalent value (see 
    [on comparing Ambient states](#on-comparing-ambient-states) for details).


### Using without React

It is possible (and easy) to use Ambient without React. This involves manually subscribing
and unsubscribing to the store using callback and comparison methods, and manually retrieving
the current state if necessary.

- `ambient.subscribe(callback: (state, prevState) => void, compare: (state) => any)`
 
    Subscribes to state changes. This is a manual subscription that is not necessary for 
    usage with React. If you are using Ambient with React, you probably don't need to use this.
    
    `callback` is invoked with two parameters: the current (new) state, and the previous 
    state.
    
    `compare` is a comparison method that determines what part of the state to listen for changes 
    (see [on comparing Ambient states](#on-comparing-ambient-states) for details).
    
    See [examples](#manual-api-no-react) for usage.
    
- `ambient.get()`

    Returns the current value (the "state") of the Ambient store. Note that this clones the state 
    object, and while it is as efficient as possible, it should be used with care. There are better
    ways to get the current state, such as subscribing to changes.



### *On comparing Ambient states*

Ambient works efficiently by comparing the new state value with the previous state value, and only re-rendering
your React elements or invoking your subscription callbacks when it detects a change. Any time the API
calls for a "comparison" method, you should provide a function that accepts the entire state object
and returns only the part for which you wish to subscribe or react to changes.

```typescript jsx
ambient.subscribe(state => { /* do something */ }, state => state.some.property)

// or

<AmbientSubscriber store={ambient} on={state => state.some.property}>
  ...
```

Ambient does its comparison by calling your method twice: once for the previous state, and once
for the new state. Your callback will only be invoked if the two return values are not equivalent 
(Ambient uses a deep-object comparison to detect this; two objects or arrays are considered equal 
if they contain the same key/value pairs or entries). 
  


## Examples

Take a look at the [Codepen](https://codepen.io/brombal/pen/gZmeYL) for a working sample.

### React wrapper component (`AmbientSubscriber`)

See the [example](#example) above for this use case.


### React higher-order component (`withAmbient`)

```typescript jsx
import Ambient, { withAmbient } from 'ambient';

// Create an Ambient instance
const ambient = new Ambient({
  counter: 0,
  user: {
    name: "Example",
    email: "test@example.com"
  }
});

// Create a convenience method to update the counter. Not mandatory, but good practice.
function increaseCounter() {
  ambient.update(state => state.counter++);
}

class MyComponent extends React.Component {
  static propTypes = {
    ambient: PropTypes.object.isRequired
  }
  
  render() {
    return (
      <div>
        Counter value: {this.props.ambient.counter}
        <button onClick={() => increaseCounter()}>Increase!</button>
      </div>
    )
  }
}

const MyComponentWithAmbient = withAmbient(ambient, state => state.counter)(MyComponent)
```



### Manual API (no React)

```typescript
import Ambient, { AmbientSubscriber } from 'ambient';

// Create an Ambient instance
const ambient = new Ambient({
  counter: 0,
  user: {
    name: "Example",
    email: "test@example.com"
  }
});

// Listen to changes in the counter value
ambient.subscribe(
  state => {                      // A callback which receives the entire state object
    console.log(state.counter);   // and is invoked whenever the counter value changes
  }, 
  state => state.counter          // The comparison callback determines what to listen for
);

// Increase the counter. This will invoke the subscription callback above.
ambient.update(state => {
  state.counter++;
});

// Listen to changes in the user value
ambient.subscribe(
  state => {
    console.log(state.user);
  }, 
  state => state.user             // Will respond to any changes in user properties
);

// Change the user's name. This will invoke the user subscription callback,
// but not the counter subscription.
ambient.update(state => {
  state.user.name = "Example Smith";
});
```
