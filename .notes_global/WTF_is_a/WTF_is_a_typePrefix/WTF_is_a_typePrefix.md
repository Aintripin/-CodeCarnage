![[wtf_is_a_TYPE_PREFIX___v000.png]]

When you use **`createAsyncThunk`**, you're making a magic helper that handles three steps of an async task:

1. **Starting the task** (like starting a fetch) → `pending`
2. **Task done successfully** → `fulfilled`
3. **Task failed** → `rejected`

### But what about `typePrefix`?

The `typePrefix` is like the **name tag** you give to the task so Redux knows who it's talking about.

For example:

- You name your task "fetch/pizza".
- Redux will create:
    - A "fetch/pizza/pending" for when the pizza order starts.
    - A "fetch/pizza/fulfilled" for when the pizza arrives.
    - A "fetch/pizza/rejected" for when the pizza delivery fails.

So `typePrefix` is just the **first part of those action names** ("fetch/pizza"). It's not really a _state_—it's more like the group name for all the related actions.


##### <b>TL;DR</b>: 
`typePrefix` is the label for the task. The _real_ states are `pending`, `fulfilled`, and `rejected`. Don't sweat `typePrefix` unless you're doing some advanced Redux wizardry.