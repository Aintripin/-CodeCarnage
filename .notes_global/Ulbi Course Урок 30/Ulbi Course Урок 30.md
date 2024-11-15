
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

#### UPD: ТАК БЛЯДЬ! После часа-другого дебага, выяснилось, что, сука, `index.ts` WAS NOT IN THE `COUNTER` FOLDER!!! SO THESE FUCKING PATHS WERE POINTING TO NOTHING AND LITERALLY MADE NO FUCKING SENSE

Исправил на:

```TSX:
import { CounterSchema } from 'app/entities/Counter';  
  
export interface StateSchema {  
    counter: CounterSchema;  
}
```

Но с такими путями не пока

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

Опять-таки, после фикса:

>`index.ts`:

```TSX:
import { counterReducer } from './model/slice/counterSlice';  
import { Counter } from './ui/Counter';  
import type { CounterSchema } from './model/types/counterSchema';  
  
export {  
    counterReducer,  
    Counter,  
    CounterSchema,  
};
```

#### Терь разберёмся с `reducer`'ом и с типами - со схемой 

> `StateSchema.ts`:

![[Pasted image 20241112175005.png]]

Мы уже тут импортируем из `PublicAPI`, а не из самого `entity`


#### Терь возвращаемся к самому компоненту счётчика:

> `Counter.tsx`:

Терь, если мы попытаемся обратиться к полю `counter` внутри `state`, то всё подсвечивается и все ненобходимые поля TS подхватил

![[Pasted image 20241112175131.png]]

В общем, теперь получить несуществующие поля мы не сможем, оно сразу всё идёт в подсветке:

![[Pasted image 20241113205153.png]]

---
---
---
---
---


Так явно указывать `useSelector`'ы внутри компонента — не очень хорошая практика и, по-хорошему, их выносить нужно отдельно

Для этого создадим папку `./selectors`, внутри которой ещё папка `./getCounter` и ещё одну папку `./getCounterValue`

Т.е. `getCounter` возвращает весь `state`, а `getCounterValue` — какое-то конкретное значение 

Если бы у нас были ещё поля, скажем, `name`, `DOB` и прочее, мы бы для каждого из ебашили бы по отдельной папке с селектором в каждой, рядом с которым был бы сразу на этот селектор тест

![[Pasted image 20241113205619.png]]

>`getCounter.ts`:

![[Pasted image 20241113210158.png]]

Тут такой же селектор, как мы и писали внутри компонента

`StateSchema` — её, по-хорошему, импортировать не из внутренностей самого `provider`'а, а publicAPI

> `index.ts`:

![[Pasted image 20241113210345.png]]

Мы ипортируем тут `StateSchema` из вышестоящего слоя. Так делать нельзя обычно. В качестве исключений могут быть типы (наш случай)

```TSX:
import {  
    StoreProvider,  
} from './ui/StoreProvider';  
import { createReduxStore } from './config/store';  
import type { StateSchema } from './config/store/StateSchema';  
  
export {  
    StoreProvider,  
    createReduxStore,  
    StateSchema,  
};
```

Терь у нас:

>`getCounter.ts`:

![[Pasted image 20241113210459.png]]

```TSX:
import { StateSchema } from 'app/providers/StoreProvider/config/StateSchema';  
  
export const getCounter = (state: StateSchema) => state.counter;
```

Возвращаем интересующее нас поле — `Counter`. Пока что мы получили state `Counter`'а целиком

Но нас интересует конкретно поле `value`, которое находится внутри

Для него также создадим отдельные файлы

>`getCounterValue.ts` (файл одноимённый внутри одноимённой папки)

тут мы воспользовались re-select'ом — функцией `createSelector`, которая находится по умолчанию внутри `redux toolkit`'а 

Она позволяет переиспользовать другие селекторы, которые у нас уже есть

![[Pasted image 20241113210752.png]]

Документацию откроем на github: у нас есть selector, который достаёт какие-то item'ы из state'а:

![[Pasted image 20241113210844.png]]

и ещё один для `taxSelect`

Это простые селекторы — они достают просто какое-то значение из `state`'а

Далее у нас используется сложный селектор:

![[Pasted image 20241113211019.png]]

Внутри него используется селектор `selectShopItems`. 

Т.е. с помощью уже существуюшего селектора мы выцыпили массив, внутри нового селектора `selectSubTotal` — мы с помощью `reduce` по нему итерируемся, что-то подсчитываем... Вот этот селектор — он это значение мемоизирует — запоминает
Он работает также, как и `useMemo` и пересчитывать значение с `reduce`'ом он будет только тогда, когда изменится `items`. До тех пор он будет возвращать уже сохранённое значение 

Далее следующие селекторы:
![[Pasted image 20241113211400.png]]

используют по два предыдущих селектора. Т.е. мы можем комбинировать, объединять и в одной функции в конце получать значение всех селекторов, которые мы использовали ранее 

#### Эти селекторы, созданные с помощью re-select'а не просто позволяют пере-использовать и комбинировать селекторы, но ещё и мемоизировать результат 


#### Терь ёбнем тоже самое, но уже у нас на практике

Первым selector'ом передаём `getCounter`, а вторым передаём функцию callback, в котором этот counter полученный первым аргументом мы принимаем и из него возвращаем `value`

>`getCounterValue.ts`:

![[Pasted image 20241113211916.png]]

```TSX:
import { CounterSchema } from 'app/entities/Counter';  
import { createSelector } from '@reduxjs/toolkit';  
import { getCounter } from '../getCounter/getCounter';  
  
export const getCounterValue = createSelector(  
    getCounter,  
    (counter:CounterSchema) => counter.value,  
);
```

В принципе, re-select использовать было **нахуй не надо**, потому что никаких вычислений внутри мы не проводим

Это просто, как простой пример идёт


#### Сразу ёбнем тесты для этого

![[Pasted image 20241113212108.png|300]]


Потом мы напишем содержимое


Вернёмся в `Counter.tsx`:

>`Counter.tsx`:

![[Pasted image 20241113212540.png]]

Терь тут используем тот самый селектор, который нам нужен


Щас у нас в консоли вот такие две ошибки должны быть:

![[Pasted image 20241113212632.png]]

Мы не указали `reducer` для `Counter`'а 

![[Pasted image 20241113212707.png]]

Тут нам в корневой `reducer` достаточно добавить `counterReducer`

![[Pasted image 20241113212742.png]]

Щас, в принципе, счётчик готов, остаётся его только куда-нить добавить

> `MainPage.tsx`:

![[Pasted image 20241113212912.png]]

Тут мы импортируем опять из `PublicAPI`

И на странице `Главна`:

![[Pasted image 20241113212957.png]]

будет вот так











Щас у нас состояние у `Counter` хранится в глобальном `state`'е. По этой причине, если мы на страницу `<Main>` добавим его и его же добавим на страницу `<AboutPage>`, то при переходе между этими двумя страницами, `state` сохраняется
Для некоторых компонентов это удобно


### Щас напишем тесты, на то, что мы сделали: счётчик, slector'ы и проч...


>`getCounter.test.ts`:

`DeepPartial` - оно используется по причине, что нам не надо объявлять весь `state` со всеми полями, а только какой-то кусочек. В этом `DeepPartial` тип нам поможет: Он позволяет проигнорировать все поля и объявить только те, которые необходимо (чаще всего он используется в тестах)


Selector'ы принимают на вход `state`, поэтому мы вот этот получившийся `state` передадим в `selector`:

![[Pasted image 20241114173834.png]]

Если мы оставим это всё в таком виде:

![[Pasted image 20241114173901.png]]

То TS будет ругаться, что на вход мы ожидаем `StateSchema`, а приходит `DeepPartial`

Мы можем с помощью `as` чётко привести к `StateSchema`:
![[Pasted image 20241114174150.png]]
![[Pasted image 20241114174018.png]]

В тестах такое делать допустимо, в самом коде нежелательно

Т.е. мы тут ожидаем, что вот этот selector вернёт нужный нам участок `state`'а: у нас `state` может быть очень большим, в нём может быть несколько сотен `reducer`'ов и мы проверяем, что `getCounter` возвращает именно тот участок, который отвечает за счётчик



Запустим тесты:

```BASH:
npm run test:unit getCounter.test.ts
```


##### Т.к. мы будем писать много тестов, предлагается сделать сниппет по аналогии с компонентами 

file -> settings -> live templates (in the search box) -> 

![[Pasted image 20241114174949.png]]

![[Pasted image 20241114175011.png]]

![[Pasted image 20241114175346.png]]

В `template text` вставим скопированный участок кода, который мы уже написали:

![[Pasted image 20241114175433.png]]

Единственное, поправим саму структуру. Используем переменную `$FILE$`

![[Pasted image 20241114175537.png]]

Укажем расширения:

![[Pasted image 20241114175611.png]]

![[Pasted image 20241114175625.png]]



> `getCounter.test.ts`:

![[Pasted image 20241114214339.png]]

Терь сделаем для селектора, который возвращает не весь `state`, который отвечает за счётчик, а само значение — поле `value`

>`getCounterValue.test.ts`:

![[Pasted image 20241114214623.png]]

Разница в том, что в первом случае мы ожидали, что нам вернётся объект

```TSX:
.toEqual({ value: 10 })
```

А щас просто 10:

```TSX:
.toEqual(10)
```

Ёбнем тест:

```TSX:
npm run test:unit getCounterValue.test.ts
```


> `counterSlice.test.ts`:

![[Pasted image 20241114220122.png]]
![[Pasted image 20241114220308.png]]


```BASH:
npm run test:unit counterSlice.test.ts
```

Ещё, по-хорошему, писать тест, который проверяет работоспособность `reducer`'а и `action`'а:

![[Pasted image 20241114220438.png]]

Мы ожидаем, что вернётся у нас при передаче `undefined`, т.е. когда ничё не передаём, единица

Т.е. вот этот `initialState`:

![[Pasted image 20241114220545.png]]
где мы изначально объявили `value` to be `0` — он должен установиться в этот `state` и уже от него произойдёт инкремент


#### Терь протестируем сам компонент — `Counter.tsx`:

На заголовок повесим `data-testid`, чтобы потом в тестах удобно получать это значение 

Также, повесим на кнопку `data-testid`:

![[Pasted image 20241114220951.png]]

Сразу рядом ёбнем тестовый файл:

>`Counter.test.tsx`:

Тут уже сниппетом развворачивать шаблон не будем

Скопируем тест из `Sidebar.test.tsx`:

![[Pasted image 20241114221132.png]]

Его используем как шаблон

После смены названий и удаления всего того, что связано с `sidebar`'ом:

>`Counter.test.tsx`:

![[Pasted image 20241114221241.png]]

Посмотрим, как устроена вот эта функция:

![[Pasted image 20241114221340.png]]

Ёбнув LMB по ней:

>`componentRender.tsx`:

У нас тут роутер и провайдер для интерационализации:

![[Pasted image 20241114221438.png]]

С подключением Redux'а у нас появился ещё один провайдер — `<StoreProvider>`

Обернём это всё в него, чтобы мы могли тестировать компоненты, в которых используется redux'овский state

>`componentRender.tsx`:

![[Pasted image 20241114221729.png]]

Теперь, когда мы делали `StoreProvider`, мы объявляли там пропс `initialState`. Мы именно для этого этот пропс и делали: чтобы в тестах мы могли какое-то изначальное значение для `state`'а задать

>`componentRender.tsx`:
![[Pasted image 20241114221915.png]]

Тут тоже используем `DeepPartial`, чтобы указывать не весь `state`, а только те участки, которые нам нужны для тестирования 

Этот `state` передаём в `storeProvider`

>`componentRender.tsx`:

![[Pasted image 20241114222024.png]]

Щас у нас TS начнёт выёбываться, что:

>`componentRender.tsx`:


![[Pasted image 20241114222041.png]]

вот эта вся хуйня — она из-за `DeepPartial`'а 

Поэтому в интерфейсе сделаем явное приведение к типу `StateSchema`:

>`StoreProvider.tsx`:

![[Pasted image 20241114222202.png]]

![[Pasted image 20241114222336.png]]


Вовзращаемся обратно к тесту:

>`Counter.test.tsx`:

![[Pasted image 20241114222605.png]]

Если щас ёбнем тест:

```BASH:
npm run test:unit Counter.test.tsx
```

То он наебнётся:

![[Pasted image 20241114222845.png]]

Выёбывается на глобальную переменную `__IS_DEV__`, которую мы используем при создании `store`'а

##### Дело в том, что Jest не ебёт, что это за переменная

>`jest.config.ts`:

Если мы сделаем `ctrl` + `F` и напишем `globals`:

![[Pasted image 20241114223032.png]]

Собственно, исходя из описания, это объект, чтобы объявлять глобальные переменные

![[Pasted image 20241114223135.png]]

Щас, если ёбнем ещё раз:

```BASH:
npm run test:unit Counter.test.tsx
```

То всё норм

![[Pasted image 20241114223214.png]]

Но это базоый тест, который ничё не проверяет. Только то, что получили правильное значение из `state`'а 

Щас уже напишем что-то конкретное:

>`Counter.test.tsx`:


![[Pasted image 20241114223600.png]]
![[Pasted image 20241114223539.png]]


> `Counter.tsx`:

У нас тут выёбывается ESLinter на отсутствие переводов

![[Pasted image 20241114223919.png]]

![[Pasted image 20241114224010.png]]


## КОММИТИМ!

### Посмотрим, как проходит `CI/CD pipeline`:

![[Pasted image 20241114224141.png]]

Все action'ы прошли успешно:

![[Pasted image 20241114224200.png]]

Значит мы <b>исполнили</b> чётко
