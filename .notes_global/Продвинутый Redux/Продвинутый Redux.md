https://www.youtube.com/watch?v=Od5H_CiU2vM

```BASH:
npx create-react-app --template typescript
```

Добавим `toolkit` к проекту:

```BASH:
npm i @reduxjs/toolkit react-redux
```

Терь запустим сам проект:

```BASH:
npm start
```

Терь касательно файловой структуры:

![[Pasted image 20241121175453.png|400]]



Первое, что нам нужно сделать -- создать корневой reducer


Терь `combineReducer` -- она нужна, чтобы объединить все reducer'ы в один

![[Pasted image 20241122101549.png]]

В `redux toolkit` это делать необязательно: в качестве корневого reducer'а можно использовать просто объект 

Терь функция `configureStore` -- это тема toolkit'а. Без него это был бы `createStore`

![[Pasted image 20241122105929.png|550]]

Когда исползуем RTK, нет нужны подключать инструменты разработчика для отладки, а также Redux Thunk (middleware), поскольку всё это идёт уже из коробки

Далее в качестве `reducer`'а указывается корневой reducer

Далее идут типы, с помощью которых с нашем хранилищем можем взаимодействовать

>`store.ts`:

![[Pasted image 20241122110455.png]]

Далее нам понадобятся некоторые типы, с поомщью которых мы будем с нашим хранилищем взаимодействовать 


1. Сначала получаем тип нашего состояния:
	его можно получить либо из `reducer`'а, либо из самого `store`'а:
	
```TSX:
export type RootState = ReturnType<typeof rootReducer>
```

2. Терь тип самого `store`'а:

```TSX:
export type AppStore = ReturnType<typeof setupStore>
```

3. Также получим тип `dispatch`'а -- нашего хранилища:

```TSX:
export type AppDispatch = AppStore['dispatch']
```

После опеределения типа `dispatch`'а, мы не сможем за'dispatch'ить те action'ы, которые мы не определили


>`store.ts`:

![[Pasted image 20241122111129.png]]

-- это три базовых типа



### Нам понадобятся некоторые хуки для работы с Redux

![[Pasted image 20241122111540.png|350]]


Первый -- это `useAppDispatch`. По факту -- это просто `useDispatch`, который возвращает `dispatch`, но у нас ещё будет типизация

Т.е. будем использовать типизированный `dispatch`

Также, нужно экспортировать хуки (чтобы в компонентах их можно было использовать)

>`redux.ts`:

![[Pasted image 20241122111808.png]]

Терь ещё один хук -- `useAppSelector` -- это обычный `useSelector`, но типизированный. Просто используем спецаиальный тип -- `TypedUseSelectorHook` и туда передаём `RootState`, который идёт из `store.ts`


>`redux.ts`:

![[Pasted image 20241122114712.png]]

---
---
## What's going down?

### **1. What’s `useAppSelector`?**

`useAppSelector` is just a **fancy version of `useSelector`** from Redux. It’s been upgraded to know about your app’s specific `RootState`.

Think of it like this:

- **`useSelector`**: A general store clerk who doesn’t know what’s on the shelves. You have to explain what you want every time.
- **`useAppSelector`**: A store clerk who knows everything in your store (because you told them with `<RootState>`), so you don’t have to repeat yourself.

You made it by doing this:

```TSX:
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

Here’s what’s happening in plain English:

1. `useSelector` doesn’t know your state structure by default.
2. By wrapping it with `TypedUseSelectorHook<RootState>`, you teach it what your state looks like.
3. Now you can use `useAppSelector` anywhere without worrying about manual typecasting.

### **2. Why do we pass `<RootState>`?**

`<RootState>` is what tells TypeScript, **"This is what my Redux state looks like."**

Without it, TypeScript would just be like:  
_"Bruh, I have no idea what you’re trying to get from your store."_

When you do this:

```TSX:
TypedUseSelectorHook<RootState>
```

You’re basically saying:  
_"Here’s the blueprint of my store. Use it to make `useSelector` behave like it knows what it’s doing."_

### **3. What’s `combineReducers`?**

`combineReducers` is like creating **one big pizza from smaller slices** (reducers). Each reducer handles a piece of your Redux state.

Example time:  
Imagine your app has users and posts. You might have two reducers:

```TSX:
const userReducer = (state = {}, action) => { /*...*/ };
const postReducer = (state = [], action) => { /*...*/ };
```

`combineReducers` lets you combine them into one big `rootReducer`:

```TSX:
const rootReducer = combineReducers({
  user: userReducer,
  posts: postReducer,
});
```

After this, your Redux state will look like:

```TSX:
{
  user: { /* whatever userReducer does */ },
  posts: [ /* whatever postReducer does */ ],
}
```

Now, when you define:

```TSX:
export type RootState = ReturnType<typeof rootReducer>;
```

TypeScript will figure out that `RootState` looks like:

```TSX:
type RootState = {
  user: UserState,
  posts: PostsState,
};
```

This is how the **big pizza (root state)** gets its recipe from the **individual slices (reducers)**.

### **Summary:**

- `useAppSelector` is just a `useSelector` with a brain that understands your `RootState`.
- You pass `<RootState>` to teach TypeScript what your Redux state looks like.
- `combineReducers` is the tool that merges all your reducers (state slices) into a single, manageable state.

---
---

#### Нахуй мы это делаем?

>`App.tsx`:

Если мы щас попытаемся обычным `useSelector`'ом:

![[Pasted image 20241122115208.png]]

То мы не знаем, какие у нас есть reducer'ы, какие поля и прочее. Какого типа у нас `state` и прочее

>`App.tsx`:

Если мы теперь используем типизированный селектор:

![[Pasted image 20241122115311.png]]

То мы знаем, чё там за типы и у нас будут подхватываться все `reducer`'ы и все поля в этих `reducer`'ах 


Пока что посмотреть по `reducer`'ам нельзя, просто потому что мы ещё ни один не сделали 

---
### For an unparalleled, earth-shattering deep dive into the Reducers topic, by all means, click this link  [WTF is a Reducer?!](../WTF_is_a/WTF_is_a_Reducer/WTF_is_a_Reducer.md)

---

В общем, нет у нас `reducer`'ов, щас воткнём:

5:16

