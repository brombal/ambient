# Ambient

Ambient is an incredibly simple global state manager. It manages a state object and allows you to
subscribe to changes. It can also be used with React.

## Install

```bash
$ npm install --save ambientjs
```

## Usage

- `new Ambient(initialState)`

    Creates a new Ambient instance. This is your state manager object, or "store". 
    You will likely want to export the instance to use throughout your app.
    You can pass an initial state value to the constructor. 
    
    ```js
    const Ambient = require('ambient');
    
    const store = new Ambient({ counter: 0 });
    ```

- `ambient.get()`

    Gets the current value (the "state") of the Ambient store. Note that this clones the state 
    object, and while it is as efficient as possible, should be used with care.

- `ambient.update(updater)`
    
    Updates the store's value. The callback method is invoked immediately and receives 
    a "draft" copy of the store. In this method you can modify the draft state however
    you wish. You can modify the object directly (recommended) or return a value which will replace
    the current state. Be cautious using arrow shorthand syntax: if you don't wrap the expression
    in curly braces, the expression's value will be returned and replace the current state.
    
    ```js
    function increaseCounter(count = 1) {
      store.update(state => { state.counter += count; });
    }
    ```
  
- `ambient.subscribe(callback, checker)`
 
    Subscribes to state changes. 
    
    `callback` is called with two parameters: the current (new) state, and the previous 
    state. 
    
    `checker` is a function that determines what part of the state to listen for. This
    will be called with the previous state and next state, and as long as what you return
    is not deeply equal, the callback will be invoked.


## React

To use this with React, use the `Ambient.Subscribe` React component. 
The inside of the component is a method that receives the current state and returns 
a React node:

```jsx
 <Ambient.Subscribe store={store} on={state => state.counter}>
   {counter => (
     <div>Counter value: {counter}</div>
   )}
 </Ambient.Subscribe>
```

`store` is the Ambient store instance you want to monitor.

`on` accepts a function which returns a "segment" of the store. This 
allows you to only re-render when the segment updates. See `ambient.subscribe`
above for details (this is the function that is passed to the `checker` parameter).
