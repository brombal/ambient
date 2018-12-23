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
  - [Using with React](#using-with-react)
    - [`<ambient.react>` wrapper component](#ambient-react-wrapper-component)
    - [`ambient.connect` higher-order component](#ambient-connect-higher-order-component)
  - [Using without React](#using-without-react)
  - [On comparing Ambient states](#on-comparing-ambient-states)
- [More examples](#more-examples)
  - [React wrapper component (`<ambient.react>`)](#react-wrapper-component-ambient-react)
  - [React higher-order component (`ambient.connect`)](#react-higher-order-component-ambient-connect)
  - [Manual API (no React)](#manual-api-no-react)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
$ npm install --save ambientjs
```


## Example

This example demonstrates usage with the `<ambient.react>` wrapper component, similar to how
the React context API works.
 
See [more examples](#more-examples) below for additional ways to use Ambient,
or take a look at the [Codepen](https://codepen.io/brombal/pen/aPWEzv) for a working sample.
 
```typescript jsx
import Ambient from 'ambient';

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
      <ambient.react to={state => state.counter}>
        {state => (
          <div>
            Counter value: {state.counter}
            <button onClick={() => increaseCounter()}>Increase!</button>
          </div>
        )}
      </ambient.react>
    )
  }
}
```


## Guide

### Creating an Ambient store

An instance of `Ambient` represents the **store**. The store is the state management object with 
which you can modify the state, subscribe to changes in the state, and get the current state value.

You may use a single store in your application to contain all your data in one place, or you might
create multiple stores to segment unrelated data. Each approach has its advantages and one may work
better for your application.

- `createAmbient(initialState)`

    Creates a new Ambient instance.
    You will likely want to export the instance to use throughout your app.
    You can pass an initial state value to the constructor. 
    
    ```js
    import createAmbient from 'ambient'; // TypeScript 
    // or
    const createAmbient = require('ambient'); // JavaScript
    
    const ambient = createAmbient({ counter: 0 });
    ```

### Updating the state

- `ambient.update(updater: (draft) => any)`
    
    Modifies the current state. The `updater` method is invoked immediately, and receives 
    a "draft" copy of the entire state object. Within this method, you can modify the object directly 
    (recommended) or return a value which will replace the current state. *Be cautious using arrow 
    shorthand syntax: if you don't wrap the expression in curly braces, the expression's value 
    will be returned and will replace the current state.*
    
    ```js
    const ambient = createAmbient({ counter: 0 });
      
    function increaseCounter(count = 1) {
      ambient.update(state => { state.counter += count; });
    }
    ```
    
    See [examples](#manual-api-no-react) for more usage.
  
  
### Using with React

There are two ways to use Ambient with React: the `<ambient.react>` wrapper component, and the
`ambient.connect` higher-order component.

#### `<ambient.react>` wrapper component

The `<ambient.react>` wrapper component creates an element that will re-render its 
contents when the state changes. This is slightly simpler to use than the higher-order component,
but it doesn't work with your component's lifecycle methods (e.g. `componentDidUpdate` will not be 
called because of a change the in Ambient state).
 
The only child of the component must be a method that receives the current state and returns 
a React node:

```jsx
 const ambient = new Ambient();
 
 ...
 
 <ambient.react to={state => state.counter}>
   {state => (
     <div>Counter value: {state.counter}</div>
   )}
 </ambient.react>
```

The child function will be invoked whenever the state updates according to the `to` 
comparison callback.

The `to` prop is the comparison function that determines which part of the store to watch for changes. 
See [on comparing Ambient states](#on-comparing-ambient-states) for details.


#### `ambient.connect` higher-order component

`ambient.connect` is a higher-order component that passes the Ambient state as a prop to your 
component, allowing you to respond to changes using `componentDidUpdate` and other lifecycle 
methods. 

- `ambient.connect(compare: (state) => any)(Component)`

    This is a typical higher-order component function. `ambient.connect` is a method on your Ambient
    store instance, and accepts a comparison method as the only parameter. The return value
    is a higher-order component wrapper function, to which you will pass your React component
    and receive a new, "connected" component. 
    
    Ambient will then trigger a prop update when the store changes according to your comparison 
    function (see [on comparing Ambient states](#on-comparing-ambient-states) for details).
    Your component will receive the entire state object as `this.props.ambient`. 
    
    ```typescript jsx
    const ambient = createAmbient({ counter: 0 });
    
    class MyComponent extends React.Component {
      render() { 
        return (
          <div>Counter value: {this.props.ambient.counter}</div>        
        )
      }
    }
  
    export default ambient.connect(state => state.counter)(MyComponent);
    ```


### Using without React

It is possible (and easy) to use Ambient without React. This involves manually subscribing
and unsubscribing to the store using callback and comparison methods, and manually retrieving
the current state if necessary.

- `ambient.on(compare: (state) => any, callback: (state, prevState) => void)`
 
    Subscribes to state changes. This is a manual subscription that is not necessary for 
    usage with React. If you are using Ambient with React, you probably don't need to use this.
    
    `compare` is a comparison method that determines what part of the state to listen for changes 
    (see [on comparing Ambient states](#on-comparing-ambient-states) for details).
    
    `callback` is invoked with two parameters: the current (new) state, and the previous 
    state.
    
    ```typescript
    const ambient = createAmbient({ counter: 0 });
    ambient.on(
      state => state.counter,
      state => alert('Counter changed to ' + state.counter)
    );
    ```
    
    See [examples](#manual-api-no-react) for more usage.
    
- `ambient.off(callback: (state, prevState) => void)`

    Unsubscribes from state changes by removing the listener (which was previously passed to
    `ambient.on`).

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
ambient.on(state => state.some.property, state => { /* do something */ })

// or

<ambient.react to={state => state.some.property}>
  ...
```

Ambient does its comparison by calling your method twice: once for the previous state, and once
for the new state. Your callback will only be invoked if the two return values are not equivalent 
(Ambient uses a deep-object comparison to detect this; two objects or arrays are considered equal 
if they contain the same key/value pairs or entries). 
  


## Examples

Take a look at the [Codepen](https://codepen.io/brombal/pen/gZmeYL) for a working sample.

### React wrapper component (`<ambient.react>`)

See the [example](#example) above for this use case.


### React higher-order component (`withAmbient`)

```typescript jsx
import createAmbient from 'ambient';

// Create an Ambient instance
const ambient = createAmbient({
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

const MyComponentWithAmbient = ambient.connect(state => state.counter)(MyComponent);
```



### Manual API (no React)

```typescript
import createAmbient from 'ambient';

// Create an Ambient instance
const ambient = createAmbient({
  counter: 0,
  user: {
    name: "Example",
    email: "test@example.com"
  }
});

// Listen to changes in the counter value
ambient.on(
  state => state.counter,         // The comparison callback determines what to listen for
  state => {                      // A callback which receives the entire state object
    console.log(state.counter);   // and is invoked whenever the counter value changes
  },
);

// Increase the counter. This will invoke the subscription callback above.
ambient.update(state => {
  state.counter++;
});

// Listen to changes in the user value
ambient.on(
  state => state.user,            // Will respond to any changes in user properties
  state => {
    console.log(state.user);
  }
);

// Change the user's name. This will invoke the user subscription callback,
// but not the counter subscription.
ambient.update(state => {
  state.user.name = "Example Smith";
});
```


## Contributing

Please feel free to fork, clone, modify, or submit PRs and bug tickets on 
[github](https://github.com/brombal/ambient).

All useful build scripts are located in the package.json file.

## License

Copyright &copy; 2018 Alex Brombal 

Licensed under [MIT](https://github.com/brombal/ambient/blob/master/LICENSE).
