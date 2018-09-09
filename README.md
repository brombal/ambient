# Ambient

Ambient is an incredibly simple global state manager. It manages a state object and allows you to
subscribe to changes. It can also be used with React.

## Install

```bash
$ npm install --save ambientjs
```

## Usage

- `new Ambient(initialState)`

    Creates a new Ambient instance. This is your state manager object. 
    You will likely want to export the instance to use throughout your app.
    You can pass an initial state value to the constructor. 
    
    ```js
    const Ambient = require('ambient');
    
    const ambient = new Ambient({ counter: 0 });
    ```

- `ambient.state`

    Gets the current value (the "state") of the Ambient store.

- `ambient.update(updater)`
    
    Updates the store's value. The callback method is invoked immediately and receives 
    a "draft" copy of the store. In this method you can modify the draft state however
    you wish. Just modify the object—don't return anything (return values are discarded).
    
    ```js
    function increaseCounter(count = 1) {
    ambient.update(state => state.counter += count);
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
 <Ambient.Subscribe store={ambient} on={state => state.counter}>
   {counter => (
     <div>Counter value: {counter}</div>
   )}
 </Ambient.Subscribe>
```

`store` is the Ambient store you want to monitor.

`on` accepts a function which returns a "segment" of the store. This 
allows you to only re-render when the segment updates. See `ambient.subscribe`
above for details (this is the function that is passed to the `checker` parameter).
