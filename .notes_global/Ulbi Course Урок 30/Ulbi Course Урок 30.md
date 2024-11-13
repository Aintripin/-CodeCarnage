
# Redux

Чтобы `redux` работал, нужно всё приложение обернуть в `provider`. `provider`'ы глобальные мы создаём на уровне слоя `app` 

![[Pasted image 20241112121129.png]]


>`StoreProvider.tsx`:

![[Pasted image 20241112121501.png]]

```TSX:
import { ReactNode } from 'react';  
import { Provider } from 'react-redux';  
  
interface StoreProviderProps {  
    children?: ReactNode;  
}  
  
export const StoreProvider = (props: StoreProviderProps) => {  
    const {  
        children,  
    } = props;  
  
    return (  
        <Provider store={}>  
            {children}  
        </Provider>  
    );  
};
```

> `index.ts`:

![[Pasted image 20241112121536.png]]

```TSX:
import {  
    StoreProvider,  
} from './ui/StoreProvider';  
  
export {  
    StoreProvider,  
};
```

Хорошо бы держать конфигурацию рядом с местом, где она используется. Создадим рядом папку `./config` с файлом `store.ts`

#### [Документация](https://redux-toolkit.js.org/tutorials/quick-start) говорит, что следующий шаг к успеху is to configure our store:

![[Pasted image 20241112122005.png]]

> `store.ts`:

Ulbi предлагает сделать функцию `createReduxStore()`, чтобы её можно было переиспользовать (для SB, для JEST'а чтобы отдельно потом создавать):

![[Pasted image 20241112122344.png]]

Сразу отключим `devTools` для production'а

![[Pasted image 20241112122542.png]]

```TSX:
import { configureStore } from '@reduxjs/toolkit';  
  
export function createReduxStore() {  
    return configureStore({  
        reducer: {},  
        devTools: __IS_DEV__,  
    });  
}  
  
// Infer the `RootState` and `AppDispatch` types from the store itself  
export type RootState = ReturnType<typeof store.getState>  
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}  
export type AppDispatch = typeof store.dispatch
```

Если мы ёбнем `ctrl` + `LMB` по `devtools`, то увидим типы:

![[Pasted image 20241112122618.png]]

Т.е. мы тут видим, что оно принимает булевое значение. Мы по флагу из `__IS_DEV__` глобальному отключаем `devtools` в production, а в dev-режиме их оставлять

> `StoreProvider.tsx`:

![[Pasted image 20241112123031.png]]

Т.е. мы создаём с помощью нашей функции `store` и, как пропс, передаём его в `Provider`

```TSX:
import { ReactNode } from 'react';  
import { Provider } from 'react-redux';  
import { createReduxStore } from 'app/providers/StoreProvider/config/store';  
  
interface StoreProviderProps {  
    children?: ReactNode;  
}  
  
export const StoreProvider = (props: StoreProviderProps) => {  
    const {  
        children,  
    } = props;  
  
    const store = createReduxStore();  
  
    return (  
        <Provider store={store}>  
            {children}  
        </Provider>  
    );  
};
```

> `index.ts`:

![[Pasted image 20241112123218.png]]

```TSX:
import {  
    StoreProvider,  
} from './ui/StoreProvider';  
import { createReduxStore } from './config/store';  
  
export {  
    StoreProvider,  
    createReduxStore,  
};
```

Мы экспортируем также это всё из publicAPI

> `store.ts`:

![[Pasted image 20241112123318.png]]

Если мы LMB по `configureStore`, то увидим, какие типы принимает эта функция:

![[Pasted image 20241112123358.png]]

Она принимает три `generic`'а: 

- первый - это тип для `state`
- второй - это тип для `action`'ов
- третий - это тип для `middleware`

`A` и `M` на текущий момент нас не особо интересуют, а `S` - да


###### Нам бы иметь какую-нить схему, которая описывает `state`. Чтобы её можно было открыть и посмотреть, какие типы там есть и с чем мы вообще, в принципе, будем работать

>`StateSchema`:

![[Pasted image 20241112123839.png]]

Мы указываем, что у нас в схеме есть счётчик и указываем тип для этого счётчика

> `store.ts`:

![[Pasted image 20241112123936.png]]

Также для тестов, для SB нам потребуется про'инициализировать `store`, чтобы подготовить нужные данные. Мы эти данные можем принимать аргументом, как `initialState`

> `store.ts`:

![[Pasted image 20241112143038.png]]

```TSX:
import { configureStore } from '@reduxjs/toolkit';  
import {StateSchema} from './stateSchema';  
  
export function createReduxStore(initialState?: StateSchema) {  
    return configureStore<StateSchema>({  
        reducer: {},  
        devTools: __IS_DEV__,  
        preloadedState: initialState,  
    });  
} 
```

Щас тип для счётчика удалим в `StateChema`, чтобы TS не ругаелся:

> `StateSchema.ts`:

![[Pasted image 20241112143212.png]]

```TSX:
export interface StateSchema {  
  
}
```

И вернёмся к этому позже

В `StoreProvider.tsx` мы всё сделали, остаётся только принимать `initialState` и прокидывать в функцию `createReduxStore`

Потому что при создании `store`'а никакой аргумент пока не принимается 

>`StoreProvider.tsx`:

![[Pasted image 20241112143509.png]]


Мы наш `StoreProvider` импортировали в `index.ts`, экспортировали в PublicAPI

Нам нужно в `StoreProvider` обернуть всё приложение


В `provider`'ы оборачиваем в `index.tsx` файле, где там же у нас и `ErrorBoundary`

![[Pasted image 20241112143753.png]]

Добавим сюда и `<StoreProvider>`, который предназначен для Redux

```TSX:
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'app/providers/ThemeProvider';
import { StoreProvider } from 'app/providers/StoreProvider';
import App from './app/App';
import 'app/styles/index.scss';
import './shared/config/i18n/i18n';
import { ErrorBoundary } from './app/providers/ErrorBoundary';

render(
    <StoreProvider>
        <BrowserRouter>
            <ErrorBoundary>
                <ThemeProvider>
                    <App />
                </ThemeProvider>
            </ErrorBoundary>
        </BrowserRouter>
    </StoreProvider>,
    document.getElementById('root'),
);

```
#### Посмотрим, работает ли у нас `devtools`

Для этого, перейдём в браузер, далее `F12` и вкладка `Redux`:

![[Pasted image 20241112144020.png]]

Предварительно нужно установить расширение `Redux Devtools`

У меня вот так:

![[Pasted image 20241112165959.png]]


## Feature-Sliced Design

Создадим в `./src` папку `./entities` и там папку `./Counter` с `index.ts` внутри:

![[Pasted image 20241112170209.png]]

Начнём с того, что создадим `Counter`. Внутри папку `ui` и на равне с ней папку `model`

`./model` будет отвечать за `state`, за операции с этим `state`'ом, а `./ui` - это сам компонент (непосредственно)


![[Pasted image 20241112170430.png]]

>`Counter.tsx`:

![[Pasted image 20241112170548.png]]

У нас будет две кнопки - одна для инкремента, вторая для декремента

Сразу создадим по функции для каждой из кнопок и пока оставим пустыми:

![[Pasted image 20241112170636.png]]

Оставляем их пустыми по причине той, что вся логика будет храниться в `Redux`'е в `reducer`'ах

И сразу повесим слушатели события на кнопки:

![[Pasted image 20241112170748.png]]


#### Терь раберёмся со `state`'ом

Для этого в папке `./model` зададим необходимую структуру: она будет отвечать именно за данные:

![[Pasted image 20241112171054.png]]


##### Начнём с того, что создадим `slice`:

[Документация](https://redux-toolkit.js.org/tutorials/quick-start) предлагает вот такую структуру:

```TSX:
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
  value: number
}

const initialState: CounterState = {
  value: 0,
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } = counterSlice.actions

export default counterSlice.reducer
```

> `counterSlice.ts`:

![[Pasted image 20241112171336.png]]
![[Pasted image 20241112171346.png]]

>`CounterSlice.ts`:

```TSX:
import { createSlice } from '@reduxjs/toolkit';  
  
export interface CounterState {  
    value: number  
}  
  
export const counterSlice = createSlice({  
    name: 'counter',  
    initialState: {  
        value: 0,  
    },  
    reducers: {  
        increment: (state) => {  
            state.value += 1;  
        },  
        decrement: (state) => {  
            state.value -= 1;  
        },  
    },  
});  
  
// Action creators are generated for each case reducer function  
export const { actions: counterActions } = counterSlice;  
export const { reducer: counterReducer } = counterSlice;
```

Внутри React'а лежит библиотека `immerJS`, которая позволяет делать state изменяемым: мы можем обращаться к полям state'а напрямую и их изменять 

##### Но щас у нас стоит Linter на то, что аргументы функции мы менять не можем, т.к. это проиворечит концепции `immerJS`

Это правило необходимо отключить:

> `.eslintrc.js`:

![[Pasted image 20241112171727.png]]


Итак, у нас есть две функции: одна для инкремента, вторая для декремента

Чтобы какой-то `action` закинуть в `reducer`, необходимо использовать `dispatch

Этот `dispatch` мы можем получить с помощью хука `useDispatch`

> `Counter.tsx`:

![[Pasted image 20241112172811.png]]

Терь по поводу функций инкремента/декремента: мы обращаемся к `counterActions`, вызываем `increment`/`decrement` и передаём это всё в `dispatch`:

![[Pasted image 20241112172944.png]]

Терь остаётся отобразить само `value`. Но пока мы его не получаем из `state`. Получим его:

![[Pasted image 20241112173104.png]]

Если мы щас напишем вот так, то из самого `state` мы ничё не возьмём по причине той, что мы щас типизировали это через `StateSchema`, а в самой `StateSchema` удалили `counter`

Чтобы типизация работала и типы отображались, нам для этого `state`'а (для counter'а) необходимо схему также описать

Для этого сделаем папку `./types`, внутри которой файл `counterSchema.ts`:

![[Pasted image 20241112173336.png]]

Т.е. вот эти участки state'а будем называть с приставкой `Schema`. Это будет говорить о том, что это именно данные, которые хранятся в `state`'е 

> `CounterSchema.ts`:

![[Pasted image 20241112173447.png]]


Терь нам нужно указать этот тип для `initialState`'а с которым мы работаем внутри `slice`'а 

> `CounterSlice.ts`:

Вот щас мы можем внутри `slice`'а добавлять абсолютно любые поля, у нас никакой типизации нет:

![[Pasted image 20241112173718.png]]


Это можно исправить двумя вариантами:

1) Если мы LMB по `createSlcie`, то увидим:

![[Pasted image 20241112173802.png]]

у нас идёт `generic` первым аргументом и в него мы можем, как раз-таки, передать тип для `state`'а 

> `counterSlice.ts`:

![[Pasted image 20241112173902.png]]

Терь, если мы `value` уберём, то при нажатии на `ctrl` + `space`, у нас будет:

![[Pasted image 20241112173932.png]]



Щас, если мы наведём на `CounterSchema`, то увидим, что ожидается ещё 1 или 2 `generic`'а. 

Это `CaseReducers` и `Name`:

![[Pasted image 20241112174102.png]]

Хз что either of them is

> `counterSlice.ts`:

Можем сделать проще, объявим `initialState`, укажем ему тип, укажем дефолтное значение для `value`, что будет `0`, уберём `generic` у `createSlice` (типизацию ту самую), а в качестве `initialState` передадим одноимённый ново'объявленный выше объект:

![[Pasted image 20241112174333.png]]


Терь `slice` этот мы типизировали и здесь мы будем рабоать явно с теми значениями, которые объявлены у нас в схеме 

> `StateSchema.ts`:

![[Pasted image 20241112174507.png]]

Щас проблема в том, что у нас тип импортируется из внутренностей, а надо импортировать его из publicAPI....

--------------------------------------------------------------------------
--------------------------------------------------------------------------
```TSX:
import { CounterSchema } from 'app/entities/Counter/model/types/counterSchema';  
  
export interface StateSchema {  
    counter: CounterSchema;  
}
```

P.S. у меня, почему-то ни по какому другому пути, кроме как через `app/entities/...` не хочет

--------------------------------------------------------------------------
--------------------------------------------------------------------------
....Поэтому сначала экспортируем его отсюда

>`index.ts`:

Сразу экспортируем отсюда `counterreducer` (нам потребуется добавить его в корень)

Также экспортируем сам компонент `Counter`

И также экспортируем схему (тот самый тип, который подготовили)

![[Pasted image 20241112174835.png]]

`index.ts`:

```TSX:
import { counterReducer } from 'app/entities/Counter/model/slice/counterSlice';  
import { Counter } from 'app/entities/Counter/ui/Counter';  
import type { CounterSchema } from 'app/entities/Counter/model/types/counterSchema';  
  
export {  
    counterReducer,  
    Counter,  
    CounterSchema,  
};
```

Хз, что у меня тут, опять только через путь, включая `app`

#### Терь разберёмся с `reducer`'ом и с типами - со схемой 

> `StateSchema.ts`:

![[Pasted image 20241112175005.png]]

Мы уже тут импортируем из `PublicAPI`, а не из самого `entity`


#### Терь возвращаемся к самому компоненту счётчика:

> `Counter.tsx`:

Терь, если мы попытаемся обратиться к полю `counter` внутри `state`, то всё подсвечивается и все ненобходимые поля TS подхватил

![[Pasted image 20241112175131.png]]

