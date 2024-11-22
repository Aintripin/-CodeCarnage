![[wtf_is_IMMER___v000.png]]

### **What’s Immer?**

Immer is a JavaScript library that helps you write less code and worry less about immutability. It’s like a magical middleman that says:

> “Hey, go ahead and _pretend_ you’re mutating your state directly—I’ll make sure everything stays immutably correct under the hood.”

---

### **Why Do You Need It?**

In Redux, immutability is king. You’re not supposed to directly modify the state; instead, you create a new state object every time.

Without Immer, you’d write code like this:

```TSX:
return {
  ...state,
  count: state.count + 1,
};
```

Not too bad for one property, right? But as your state grows, it gets wild—imagine nesting inside objects inside arrays inside objects. Your brain will melt trying to keep up.

Immer swoops in and says:

> “Dude, just write what you want to happen, and I’ll make it immutable for you.”

### **How Does It Work?**

When you use Immer (via Redux Toolkit), you can write “mutating” code like this:

```TSX:
state.count += 1;
```

But Immer secretly clones the state behind the scenes and updates it immutably. You don’t have to lift a finger.

---

### **Quick Example**

Here’s what happens **without** Immer:

```TSX:
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 }; // Manually create a new state
    default:
      return state;
  }
}
```

And **with** Immer:

```TSX:
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      state.count += 1; // Immer handles immutability
      break;
    default:
      return state;
  }
}
```

Looks like magic, right? But the end result is still immutable, so you stay within Redux rules.

---

### **How It’s Built Into Redux Toolkit**

Redux Toolkit comes with Immer baked in—like chocolate chips in a cookie. When you use `createSlice` or `createReducer`, Immer is already working behind the scenes. That’s why you can write stuff like:

```TSX:
state.todos.push(newTodo); // Seems mutative, but it's not.
```

Immer handles it for you. You’re free to think less about immutability and more about, well, life.

