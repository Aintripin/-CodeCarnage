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

Когда используем RTK, нет нужны подключать инструменты разработчика для отладки, а также Redux Thunk (middleware), поскольку всё это идёт уже из коробки

Далее в качестве `reducer`'а указывается корневой reducer

Далее идут типы, с помощью которых с нашем хранилищем можем взаимодействовать

>`store.ts`:

![[Pasted image 20241122110455.png]]

Далее нам понадобятся некоторые типы, с помощью которых мы будем с нашим хранилищем взаимодействовать 


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

>`store.ts`:

```TSX:
import {combineReducers, configureStore} from "@reduxjs/toolkit";  
  
const rootReducer = combineReducers({  
  
})  
  
export const setupStore = () => {  
    return configureStore({  
        reducer: rootReducer,  
    })  
};  
  
export type RootState = ReturnType<typeof rootReducer>;  
export type AppStore = ReturnType<typeof setupStore>;  
export type AppDispatch = AppStore['dispatch'];
```

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

```TSX:
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";  
import {AppDispatch, RootState} from "../store/store";  
  
export const useAppDispatch = () => useDispatch<AppDispatch>();  
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

---
---
## What's going down?

### **1. What’s `useAppSelector`?**

`useAppSelector` is just a **fancy version of `useSelector`** from Redux. It’s been upgraded to know about your app’s specific `RootState`.

Think of it like this:

- **`useSelector`**: A general store clerk who doesn’t know what’s on the shelves. You have to explain what you want every time.
- **`useAppSelector`**: A store clerk who knows everything in your store (because you told them with `<RootState>`), so you don’t have to repeat yourself.

We made it by doing this:

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

![[Pasted image 20241122143805.png|350]]

В общем, есть `slice`'ы -- это обёртка на `reducer`'ами


---
### For an unparalleled, earth-shattering deep dive into the Slices topic, by all means, click this link  [WTF is a Slice?!](../WTF_is_a/WTF_is_a_Slice/WTF_is_a_Slice.md)

---


Прежде чем начать исполнять, нужно `state` типизировать, чтобы определить какие поля и какого типа у нас будут


Работать мы будем со списком пользователей, поэтому опишем, какие поля у каждого из будут:

![[Pasted image 20241122151223.png|350]]

>`UserSlice.ts`:

![[Pasted image 20241122151134.png]]

`error` поле будет хранить сообщение с ошибкой, если, вдруг, она произошла

Терь новый объект -- `UserState` -- это будет дефолтное состояние в данном `reducer`'е

![[Pasted image 20241122151401.png]]


Теперь создадим сам `reducer`. В контексте RTK подобные `reducer`'ы называются `slice`'ами

![[Pasted image 20241122151538.png]]

`reducers` -- это поле, аналогичное конструкции `switch/case`:

![[Pasted image 20241122151650.png]]

которая используется в обычном `reducer`'а. Каждый `case` идёт как отдельный `reducer`. И внутри него мы уже будем определять, как мы изменяем наше состояние 


После создания `slice`'а мы можем отдельно вытащить `reducer` и отдельно `action creator`

Мы вытащим `reducer` и экспортируем по дефолту его из этого файла:

>`UserSlice.ts`:

![[Pasted image 20241122152005.png]]


>`store.ts`:

Тут мы создавали `rootReducer`, передадим наш `userReducer` -- это то, что мы импортируем из `UserSlice`:

![[Pasted image 20241122152203.png]]


Теперь, когда у нас этот `reducer`, можем вернуться к компоненту и попробовать к нему обратиться:

>`App.tsx`:

`useAppSelector` -- мы используем это, чтобы не писать каждый раз явно тип, как `<RootState>`

Оно у нас уже так сразу подхватывает поля:

![[Pasted image 20241122152550.png]]

Если бы не сделали `useAppSelector`, а просто использовали бы `useSelector`, то TS не ебёт чё за поля:

![[Pasted image 20241122152724.png]]

Т.е. нужно было бы делать вот так:

![[Pasted image 20241122152806.png]]

Мы это всё делали с `useAppSelector`, чтобы каждый раз не указывать типы и не импортировать эти типы 

### Время пилить функционал

В качестве примера, сделаем счётчик:

>`UserSlice.ts`:

Добавим поле `count` и про'инициализируем его нулём:

![[Pasted image 20241122153132.png]]

Итак, внутри поля `reducers` создаём функции, внутри которых изменяем состояния:

![[Pasted image 20241122153215.png]]

Такие функции принимают сам `state` и некий `action`:

![[Pasted image 20241122154430.png]]

`action` мы сразу можем типизировать. Как generic указываем `number` (`string`/`User` -- любой тип, который мы ожидаем в `payload`):

>`UserSlice.ts`:

![[Pasted image 20241122154546.png]]

#### RTK vs no RTK:

![[Pasted image 20241122154701.png|500]]


![[Pasted image 20241122154712.png|550]]

Поэтому можем без разворачивания предыдущего `state`'а можем напрямую менять значения счётчика:

> `UserSlice.ts`:

![[Pasted image 20241122155313.png|600]]


>`App.tsx`:

`slice` содержит в себе `action creator` и `reducer`:

![[Pasted image 20241122155641.png]]

Т.е. ни `action`'ы, ни `action creator`'ы мы не создаём вручную -- всё с этом случае за нас делает `redux toolkit`

Нам остаётся созданный с помощью RTK `action creator` только за'dispatch'ить. А сам счётчик мы получаем с помощью хука `useAppSelector`:

>`App.tsx`:

![[Pasted image 20241122155847.png]]

Щас ещё ёбнем кнопку, но сначала посмотрим, что из себя представляет функция `increment()`:

![[Pasted image 20241122155953.png]]

Терь у нас всё ёбнется:

![[Pasted image 20241122160013.png]]

Причина этому -- мы не обернули приложение в `<Provider>`. Последний будет для react-компонентов поставлять `store`

>`index.tsx`:

![[Pasted image 20241122160124.png]]

`store` мы создаём с помощью функции `setupStore`, которую мы создавали в самом начале. И потом передаём её, как пропс в `<Provider>`

Терь посмотрим на вывод функции `increment()` в консоли:


![[Pasted image 20241122160241.png]]

Получаем объект, у которого есть `type` и `payload`

Т.е. это самый обыкновенный redux'овский action 


>`App.tsx`:

Перададим в action creator `10`:

![[Pasted image 20241122160411.png]]


## [WTF is an Action Creator?!](../WTF_is_a/WTF_is_an_Action_Creator/WTF_is_an_Action_Creator.md)


Ну и щас у нас по `10` будет `counter` увеличиваться:

![[Pasted image 20241122161057.png]]



## Рассмотрим практический кейс:

Для этого удалим нахуй пример с `counter`'ом:

> `userSlice.ts`:

![[Pasted image 20241122171702.png]]


#### Классический пример -- это получение данных от сервера, обработка ошибок и обработка загрузки этих данных

Получение данных от сервера -- это асинхронный процесс

Поэтому мы делаем асинхронный action creator

>`ActionCreators.ts`:

По классике асинхронные action'ы создаются с помощью middleware `reduxThunk`

В RTK `reduxThunk` идёт под капотом по дефолту и его вручную подключать не надо

Чтобы этим функционалом пользоваться, мы из `action creator`'а не возвращаем сразу `action`, а другую функцию, которая аргументом принимает `dispatch` и уже из этой функции будем производить какие-то асинхронные действия

![[Pasted image 20241122174832.png]]

Функцию сделаем `async`-хронной, чтобы могли использовать `await`

>`ActionCreator.ts`:

![[Pasted image 20241122175027.png]]

А щас ещё типизируем -- мы ожидаем в поле `data` у нашего `response` дату, которая `<IUser[]>` 



Щас нужно указать `reducer`'ы, с помощью которых нужно менять `state`. 

Первый `reducer` -- `usersFetching` -- начинается тогда, когда начинается подгрузка пользователей 

Второй `reducer` -- `usersFetchingSuccess` -- это когда подгрузка произошла успешно

Третий `reducer` -- `usersFetchingError` -- это когда произошла ошибка

>`UserSlice.ts`:

![[Pasted image 20241122180731.png]]

В первом случае флаг `isLoading` ставим на `true` -- т.е. они грузяься

Во втором и третьем - она уже закончилась:

![[Pasted image 20241122180838.png|600]]

В случае успешной загрузки или ошибки, мы `isLoading` меняем на `false`




Если произошла ошибка, то в состоянии мы сохраняем информацию (сообщение) об этой ошибке. А само сообщение ошибки мы сохраняем в `payload`:

![[Pasted image 20241122181055.png]]


В случае успешной загрузки, мы ожидаем массив пользователей. Ошибка, если она у нас была, -- её мы обнуляем в пустую строчку. А в качестве `payload` success-функции будем ожидать массив пользователей

>`UserSlice.ts`:

![[Pasted image 20241122181227.png]]


14:24s

