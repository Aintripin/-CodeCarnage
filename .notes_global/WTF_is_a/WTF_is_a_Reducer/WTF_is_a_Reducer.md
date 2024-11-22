![[wtf_is_a_REDUCER___v000.png]]

---
### **What’s a Reducer?**

A **reducer** in Redux is a **function** that handles changes to a specific piece of your app’s state. It listens for actions (instructions like "add this" or "delete that") and decides how the state should change based on those actions.

Here’s the catch: **Reducers must be "pure functions."**

---
### **Okay, What’s a "Pure Function"?**

A pure function is like that one friend who always tells the truth and never messes with your stuff behind your back. It has **two rules**:

1. **No Side Effects**  
    It doesn’t mess with anything outside itself. No modifying variables, no API calls, no sneaky `console.log` shenanigans.  
    Example of a _not pure_ function:


```TSX:
let counter = 0;
function increment() {
  counter++; // Changes a variable outside the function = side effect!
  return counter;
}
```


2. **Same Input, Same Output**  
	If you give it the same input, it always spits out the same output—like a vending machine that doesn’t eat your dollar bill.  
	Example of a pure function:

```TSX:
function add(a, b) {
  return a + b; // Same input = same result, every time
}
```

---
### **Why Do Reducers Need to Be Pure Functions?**

Redux wants predictability and stability:

1. **Debugging**: If reducers are pure, you know the state changes only because of specific actions. This makes bugs easier to trace.
2. **Time Travel**: Ever used Redux DevTools? That "rewind time" magic works only because reducers are pure. The state can "rewind" or "fast-forward" consistently.
3. **Testability**: A pure function is easy to test. Just pass inputs and check the output. No random variables or API nonsense mucking it up.

---

### **What Does a Reducer Look Like?**

A reducer is a pure function with this signature:

```TSX:
(state: SomeState, action: SomeAction) => NewState
```

Example:  
Let’s say you want to manage a counter. Here’s your reducer:

```TSX:
const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1; // Pure: doesn't touch anything outside, only depends on inputs
    case 'DECREMENT':
      return state - 1;
    default:
      return state; // Always return state if no changes
  }
};
```

### **How Does It Work with Redux?**

1. **Redux Store**: Holds the app state.
2. **Actions**: Dispatches instructions (e.g., `type: 'INCREMENT'`).
3. **Reducers**: Decide how the state changes based on the action.

Flow in action:

1. User clicks a button.
2. Dispatch an action like `{ type: 'INCREMENT' }`.
3. Reducer sees the action, updates the state from `5` to `6` (or whatever).

---

### **TL;DR Pure Reducer Checklist:**

1. Doesn’t modify the input `state` (use a new object or value instead).
2. Doesn’t do anything fancy like API calls or logs (leave that to middleware).
3. Always returns something (either a new state or the existing one).