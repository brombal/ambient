# Ambient

Ambient is an incredibly simple global state manager. It manages a state object and allows you to
subscribe to changes. It can also be used with React.

- [Installation](#installation)
- [Usage](#usage)
  - [React](#react)
    - [`<AmbientSubscriber>` wrapper component](#ambientsubscriber-wrapper-component)
    - [`withAmbient` higher-order component](#withambient-higher-order-component)
- [Examples](#examples)

## Installation

```bash
$ npm install --save ambientjs
```


## Usage

- `new Ambient(initialState)`

    Creates a new Ambient instance. This is your state manager object, or "store". 
    You will likely want to export the instance to use throughout your app.
    You can pass an initial state value to the constructor. 
    
    ```js
    import Ambient from 'ambient'; // TypeScript 
    const Ambient = require('ambient'); // JavaScript
    
    const ambient = new Ambient({ counter: 0 });
    ```

- `ambient.subscribe(callback: (state, prevState) => void, compare: (state) => any)`
 
    Subscribes to state changes. This is a manual subscription that is not necessary for 
    usage with React. If you are using Ambient with React, you probably don't need to use this.
    
    `callback` is invoked with two parameters: the current (new) state, and the previous 
    state.
    
    `compare` is a function that determines what part of the state to listen for changes. 
    This method is called twice for every change to the state: once with the previous state,
    and once with the new state. If the return values are not identical or deeply equal,
    `callback` will be invoked.
    
    See [examples](#manual-api-no-react) for usage.
    

- `ambient.update(updater: (draft) => any)`
    
    Updates the current state. The callback method is invoked immediately and receives 
    a "draft" copy of the entire state object. In this method you can modify the object directly 
    (recommended) or return a value which will replace the current state. Be cautious using arrow 
    shorthand syntax: if you don't wrap the expression in curly braces, the expression's value 
    will be returned and will replace the current state.
    
    ```js
    import Ambient from 'ambient';  
        
    const ambient = new Ambient({ counter: 0 });
      
    function increaseCounter(count = 1) {
      ambient.update(state => { state.counter += count; });
    }
    ```
    
    See [examples](#manual-api-no-react) for more usage.
  
- `ambient.get()`

    Returns the current value (the "state") of the Ambient store. Note that this clones the state 
    object, and while it is as efficient as possible, it should be used with care. There are better
    ways to get the current state, such as subscribing to changes.


### React

There are two ways to use Ambient with React: the `AmbientSubscriber` wrapper component, and the
`withAmbient` higher-order component.

#### `<AmbientSubscriber>` wrapper component

The `AmbientSubscriber` wrapper component allows you to create an element that will re-render its 
contents when the state changes. This is slightly simpler to use than the higher order component,
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

The child function will be invoked any time the state updates according to the `on` 
comparison callback.

`store` is the Ambient store instance you want to monitor.

`on` is the comparison function that determines which part of the store to watch for changes. 
See `ambient.subscribe` above for details (this is the function that is passed to the `compare` 
parameter).

#### `withAmbient` higher-order component

`withAmbient` allows you to pass the Ambient state as a prop to your component, allowing you to
react to changes using `componentDidUpdate` and other lifecycle methods. 

To use it, wrap your component with `withAmbient` method, passing in the store and an optional
comparison method:

```typescript jsx
class MyComponent extends React.Component {
  static propTypes = {
    ambient: PropTypes.object.isRequired
  }
  
  render() {
    return <div>{this.props.ambient.counter}</div>;
  }
}

const MyComponentWithAmbient = withAmbient(ambient, state => state.counter)(MyComponent)
```


## Examples

### React wrapper component

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
