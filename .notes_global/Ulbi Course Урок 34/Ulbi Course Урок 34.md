
#### Будем реализовывать авторизацию, работать со `state`'ом, со `slice`'ами, делать `asynThunk`'и

>`./AuthByUsername`:

Тут создаём в папке `./model` по такой же схеме, как делали в других местах

![[Pasted image 20241120121442.png|350]]

В папке `./types` создаём `loginSchema.ts` -- тут мы будем описывать состояние для `state`'а, который будет отвечать за форму авторизации

В `state`'е будем хранить `username`, пароль и ошибку, если пользователь неправильно ввёл логин и пароль и `isLoading` состояние 


Ulbi посчитал, что в модалке кнпока "Войти" выглядит не очень красиво:

![[Pasted image 20241120121658.png]]

И поэтому зададим ей тему


>`LoginForm.tsx`:

![[Pasted image 20241120121746.png]]

И щас уже так:

![[Pasted image 20241120121828.png]]

Но это у него, у меня вот так по-прежнему:

![[Pasted image 20241120175105.png|550]]

После иморта его build'а также осталась проблема

![[its-time-to-328386ada8.jpg|350]]

Now, what we'z finna ter do is add dis shiet:

```TSX:
const computedClassNames = classNames(cls.Button, mods, [className]);  
  
console.log('Generated class names:', computedClassNames);
```

to us' `Button.tsx` component so it look like dis:

```TSX:
export const Button: FC<ButtonProps> = (props) => {  
    const {  
        className,  
        children,  
        theme,  
        square,  
        size = ButtonSize.M,  
        ...otherProps  
    } = props;  
  
    const mods: Record<string, boolean> = {  
        [cls[theme]]: true,  
        [cls.square]: square,  
        [cls[size]]: true,  
    };  
  
    const computedClassNames = classNames(cls.Button, mods, [className]);  
  
    console.log('Generated class names:', computedClassNames);  
  
    return (  
        <button  
            type="button"  
            className={classNames(cls.Button, mods, [className])}  
            {...otherProps}  
        >  
            {children}  
        </button>  
    );  
};
```

Now, when we clickz on dat 'Login' btn shiet, tha window be poppin up like dis:

![[Pasted image 20241121113232.png|350]]

But we also b seein dem logz in da console:

![[Pasted image 20241121113305.png]]

Now, the `undefined` in our console might mean that `cls[theme]` is not resolving correctly, which implies that the `theme` prop (`ButtonTheme.OUTLINE`) either:
- ain't passed down correctly from the parent component (`LoginForm.tsx`)
- Doesn't map to a valid key in the `Button.module.scss` file

What I ended up doing was adding this line:

```TSX:
console.log('Button theme prop:', theme);
```

To my `Button.tsx` component and sure enough I got:

```BASH:
Button theme prop: undefined
```

out in the logs as I was expecting

Now, I done switched to `Claude` and the problem got resolved in a matter of 2 minutes. Here's the new `Button.tsx` component:

```TSX:
import { classNames } from 'shared/lib/classNames/classNames';  
import { ButtonHTMLAttributes, FC } from 'react';  
import cls from './Button.module.scss';  
  
export enum ButtonTheme {  
    CLEAR = 'clear',  
    CLEAR_INVERTED = 'clearInverted',  
    OUTLINE = 'outline',  
    BACKGROUND = 'background',  
    BACKGROUND_INVERTED = 'backgroundInverted',  
}  
  
export enum ButtonSize {  
    M = 'size_m',  
    L = 'size_l',  
    XL = 'size_xl',  
}  
  
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {  
    className?: string;  
    theme?: ButtonTheme;  
    square?: boolean;  
    size?: ButtonSize;  
}  
  
export const Button: FC<ButtonProps> = (props) => {  
    const {  
        className,  
        children,  
        theme = ButtonTheme.OUTLINE,  
        square,  
        size = ButtonSize.M,  
        ...otherProps  
    } = props;  
  
    const buttonClasses = [  
        cls.Button,  
        theme && cls[theme],  
        square && cls.square,  
        cls[size],  
        className,  
    ].filter(Boolean).join(' ');  
  
    return (  
        <button  
            type="button"  
            className={buttonClasses}  
            {...otherProps}  
        >  
            {children}  
        </button>  
    );  
};
```

Now, what's going down here is we force-apply this `OUTLINE` thing to our `theme`:

```TSX:
theme = ButtonTheme.OUTLINE,
```

But that would make any other button render with that style which is not a desired behavior, to say the least

Now, the workaround here is that we updated the `mods` object to use a different approach that doesn't rely on the `Record<string, boolean>` type. So, we're making a switch from `mods` to `buttonClasses`:

> before:

```TSX:
const mods: Record<string, boolean> = {
    [cls[theme]]: true,
    [cls.square]: square,
    [cls[size]]: true,
};
```

> after:

```TSX:
const buttonClasses = [  
    cls.Button,  
    theme && cls[theme],  
    square && cls.square,  
    cls[size],  
    className,  
].filter(Boolean).join(' ');
```

Now, if we add this line back to our `Button.tsx`:

```TSX:
console.log('Button theme prop:', theme);
```

we finna see dat fry in da bag now:

![[Pasted image 20241121120458.png]]

Which implies that we passed down it all correctly

![[Pasted image 20241121122322.png|400]]

Now, I ain't really got no fucking idea why in the actual fuck not only my project but also the one that I downloaded as an attachment would not work whereas in fact I be doing the same shit he did 

>`loginSchema.ts`:

![[Pasted image 20241120122347.png]]

Короче, можно было бы добавить ещё миллиард полей по типу `rememberMe`, `lastName` и прочее... 

Но, т.к. у нас форма с двумя полями, то вот так


>`loginSlice.ts`:

(скопируем из `userSlice.ts`):

![[Pasted image 20241120122638.png]]

TS сразу говорит о том, что мы пропустили обязательные поля в `initialState`:

![[Pasted image 20241120122721.png]]


Исправим:

![[Pasted image 20241120122741.png]]

>`loginSlice.ts`:

```TSX:
import { createSlice } from '@reduxjs/toolkit';  
import { LoginSchema } from '../types/loginSchema';  
  
const initialState: LoginSchema = {  
    isLoading: false,  
    username: '',  
    password: '',  
};  
  
export const loginSlice = createSlice({  
    name: 'login',  
    initialState,  
    reducers: {},  
});  
  
export const { actions: loginActions } = loginSlice;  
export const { reducer: loginReducer } = loginSlice;
```

Терь сделаем 2 `reducer`'а -- это те, с помощью которых будем менять `username` и `пароль`

>`loginSlice.ts`:

![[Pasted image 20241120151511.png]]


Терь воспользуемся тем, что мы сделали

> `LoginForm.tsx`:

Обернём всё это в `memo`, чтобы избежать лишних перерисовок форм

![[Pasted image 20241120151744.png]]
![[Pasted image 20241120151809.png]]
![[Pasted image 20241120151847.png]]

Вот тут ещё поменяем на относительный импорт:

![[Pasted image 20241120151924.png]]

>`LoginForm.tsx`:

```TSX:
import { classNames } from 'shared/lib/classNames/classNames';  
import { useTranslation } from 'react-i18next';  
import { Button, ButtonTheme } from 'shared/ui/Button/Button';  
import { Input } from 'shared/ui/input/Input';  
import { useDispatch } from 'react-redux';  
import { useCallback } from 'react';  
import { loginActions } from '../../model/slice/loginSlice';  
import cls from './LoginForm.module.scss';  
  
interface LoginFormProps {  
    className?: string;  
}  
  
export const LoginForm = ({ className }: LoginFormProps) => {  
    const { t } = useTranslation();  
  
    // console.log('ButtonTheme.OUTLINE:', ButtonTheme.OUTLINE);  
    const dispatch = useDispatch();  
  
    const onChangeUsername = useCallback((value: string) => {  
        dispatch(loginActions.setUsername(value));  
    }, [dispatch]);  
  
    const onChangePassword = useCallback((value: string) => {  
        dispatch(loginActions.setPassword(value));  
    }, [dispatch]);  
  
    return (  
        <div className={classNames(cls.LoginForm, {}, [className])}>  
            <Input                autofocus  
                type="text"  
                className={cls.input}  
                placeholder={t('Введите username')}  
                onChange={onChangeUsername}  
            />  
            <Input                type="text"  
                className={cls.input}  
                placeholder={t('Введите Пароль')}  
                onChange={onChangePassword}  
            />  
            <Button                theme={ButtonTheme.OUTLINE}  
                className={cls.loginBtn}  
            >  
                {t('Войти')}  
            </Button>  
        </div>    );  
};
```
##### С изменением данных мы разобрались, но никакое `value` мы пока в `input` не передаём

![[Pasted image 20241120152026.png]]

Это `value` нам нужно научиться со `state`'а сначала получать

Для этого необходимо сделать `selector`'ы


Создадим `getLoginState.ts` -- он будет получать ВЕСЬ `state` (как мы это делали с `user`'ами):

![[Pasted image 20241120152158.png|350]]


>`getLoginState.ts`:

Тут стрелочная функция, которая принимает `state` целиком, а возвращает кусочек этого `state`'а

![[Pasted image 20241120152256.png]]

Нам TS не говорит о том, что в `state`'е `loginSchema` есть


Поэтому эту схему нужно подключить к корневой



Экспортируем из publicAPI:

>`index.ts`:

![[Pasted image 20241120152408.png]]

>`index.ts`:

```TSX:
// @ts-ignore  
export { LoginModal } from './ui/LoginModal/LoginModal';  
export { LoginSchema } from '../model/types/loginSchema';
```

(потратил 10 минут на проверку импортов и экспротов, чтобы потом понять, что сначала нужно подняться на один уровень через `../`)

P.S.S.: всё-таки дошло, что `index.ts` должен быть на уровне `./AuthByUsername` (внутри этой папки)

Далее откроем корневой интерфейс `StateSchema`:

>`getLoginState.ts`:

![[Pasted image 20241120152506.png]]

`ctrl` + `LMB`

>`StateSchema.ts`:

![[Pasted image 20241120152607.png]]

`loginForm` указываем, как необязательное поле

Сейчас, если мы откроем:

>`store.ts`:

![[Pasted image 20241120152639.png]]

То TS ругаться не будет, что `loginForm`'ы у нас нет

Нам это пригодится, когда мы сделаем этот `reducer` асинхронным. Т.е. подгружать мы будем его точно также, как и асинхронный компонент только в тот момент, когда нам этот `reducer` действительно нужен. Это делается для оптимизации

Но пока что мы это сделать не можем, поэтому `loginReducer` отдадим наружу 

>`index.ts`:

![[Pasted image 20241120152907.png]]

И добавим в `root reducer`:

> `store.ts`:

![[Pasted image 20241120152942.png]]

Вернёмся к селектору:

>`getLoginState.ts`:

![[Pasted image 20241120153023.png]]

Тут уже TS подсказывает, что етсь `loginForm`

И в данном селекторе мы возвращаем весь `state`, который отвечает за нашу форму

>`getLoginState.ts`:

```TSX:
import { StateSchema } from 'app/providers/StoreProvider';  
  
export const getLoginState = (state: StateSchema) => state?.loginForm;
```

#### Терь вернёмся к компоненту `LoginForm`, где этим селектором воспользуемся

(все селекторы нужно разбивать до мельчайших полей (т.е. отдельный для логина, отдельный для пароля, для `isLoading`, для ошибки))

Но нам похуй. У нас форма достаточно маленькая и мы обойдёмся единственным селектором

>`LoginForm.tsx`:

![[Pasted image 20241120153608.png]]

Здесь перерисовки не так страшны (форма маленькая)

>`LoginForm.tsx`:

Терь из этого `state`'а достанем нужные поля:

![[Pasted image 20241120154831.png]]

Ulbi решает вместо обращения через точку, деструктуризировать:

>`LoginForm.tsx`:

![[Pasted image 20241120154914.png]]

И теперь передадим в `input`'ы:

![[Pasted image 20241120154948.png]]

Щас опять ебаное полотно ошибок (это уже после исправлений):

![[Pasted image 20241121153921.png]]

(Мне похуй, я на крестик нажимаю)
#### Теперь реализуем логику нажатия на кнопку:

![[Pasted image 20241120155157.png]]

Пока что так:

>`LoginForm.tsx`:

![[Pasted image 20241120155247.png]]

И теперь эту функцию повешаем, как слушатель события, на кнопку:

![[Pasted image 20241120155338.png]]


#### Теперь создадим первый асинхронный action

Создадим папку `./services` -- тут будет вся бизнес-логика 

![[Pasted image 20241120155734.png|350]]

Из [документации](https://redux-toolkit.js.org/api/createAsyncThunk) скопируем пример AsyncThunk'а:

```TSX:
const fetchUserById = createAsyncThunk(
  'users/fetchByIdStatus',
  async (userId: number, thunkAPI) => {
    const response = await userAPI.fetchById(userId);
    return response.data;
  }
);
```

И ёбнем его в наш код, поменяв название 

![[Pasted image 20241120160047.png]]

Название указываем, чтобы потом в devtools мы могли отследить какой-нить `action`

#### Терь нам нужно будет ебашить запросы на сервер. Для этого потребуется `axios`:

```BASH:
npm i axios
```

Сервак у нас запускается на `8000` порту и далее идёт `./login`   

>`loginByUsername`:

![[Pasted image 20241120160406.png]]

>`loginByUsername`:

```TSX:
import { createAsyncThunk } from '@reduxjs/toolkit';  
import axios from 'axios';  
  
const loginByUsername = createAsyncThunk(  
    'login/loginByUsername',  
    async (userId, thunkAPI) => {  
        const response = await axios.post('http://localhost:8000/');  
        return response.data;  
    },  
);
```

Теперь нам ещё нужен пароль и логин. На это у нас два варианта -- либо доставать их напрямую из `state`'а, либо получать аргументами

Попробуем получать данные извне в виде аргументов. Для этого создадим отдельный интерфейс, в котором опишем типы, которые мы ожидаем на вход -- это `username` и `пароль` типа `string`

>`loginByUsername`:

![[Pasted image 20241120160610.png]]

Тут либо теперь можно вот так напрямую тип указать:

![[Pasted image 20241120160754.png]]

Либо воспользоваться generic'ами

`ctrl` + `LMB`:

![[Pasted image 20241120160827.png]]


>`createAsyncThunk.ts`:

![[Pasted image 20241120160854.png]]

Функция `createAsyncThunk` принимает несколько generic'ов: первый - это то, что мы возвращаем, а второй - это аргумент


По такой логике, для первого типа мы указываем `User`, потому что после авторизации нам сервак вернёт данные о пользователе и мы уже их будем сохранять в другой участок `state`'а 

Второй - `LoginByUsernameProps` -- это то, что мы ожидаем на вход

>`loginByUsername`:

![[Pasted image 20241120161052.png]]

Далее Ulbi какого-то хуя решает избавиться из деструктуризации и отправить запрос вот так:

![[Pasted image 20241120161208.png]]

Т.е. объект `authData` передаём напрямую, как тело запроса

>`loginByUsername.ts`:

```TSX:
import { createAsyncThunk } from '@reduxjs/toolkit';  
import axios from 'axios';  
import { User } from 'entities/User';  
  
interface LoginByUsernameProps {  
    username: string;  
    password: string;  
}  
  
const loginByUsername = createAsyncThunk<User, LoginByUsernameProps>(  
    'login/loginByUsername',  
    async (authData, thunkAPI) => {  
        const response = await axios.post('http://localhost:8000/login', authData);  
        return response.data;  
    },  
);
```

В запрсое может возникнуть какая-нить ошибка, поэтому обернём ещё в `try/catch`-блок нащ запрос

>`loginByUsername`:

![[Pasted image 20241120161310.png]]

>`loginByUsername.ts`:

```TSX:
import { createAsyncThunk } from '@reduxjs/toolkit';  
import axios from 'axios';  
import { User } from 'entities/User';  
  
interface LoginByUsernameProps {  
    username: string;  
    password: string;  
}  
  
const loginByUsername = createAsyncThunk<User, LoginByUsernameProps>(  
    'login/loginByUsername',  
    async (authData, thunkAPI) => {  
        try {  
            const response = await axios.post('http://localhost:8000/login', authData);  
            return response.data;  
        } catch (e) {  
            console.log(e);  
        }  
    },  
);
```
#### Как обрабатывать ошибки?

Вот это в [документации](https://redux-toolkit.js.org/api/createAsyncThunk#handling-thunk-errors): 

![[Pasted image 20241120161441.png]]

У нас есть функция `rejectWithValue` -- мы её можем вызвать и туда передать какой-то объект/сообщение 

![[Pasted image 20241120162106.png]]

По умолчанию, если мы из `ThunkAPI` возвращаем какие-то данные, они оборачиваются в функцию `fullfillWithValue`

`rejectWithValue` -- это аналог, но только для обработки ошибки

![[Pasted image 20241120162638.png]]

Тут, если мы ёбнем `LMB` по `createAsyncThunk`:

>`createAsyncThunk`:

![[Pasted image 20241120162805.png]]

Тут увидим, что у `createAsyncThunk` есть и другая спецификация:

Которая третьим generic'ом принимает следующий config:

![[Pasted image 20241120162850.png]]

Мы тут видим все значения -- `reject`, `getDispatch` и прочее

По умолчанию значения эти `unknown`. Мы извне их можем пере-определить

>`loginByUsername`:

Например, вот так:

![[Pasted image 20241120163056.png]]

И если мы укажем `number`, то:

![[Pasted image 20241120163133.png]]

Будет выёбываться, что нужен `string`


Также мы должны типизировать значение, которое нам вернёт сервак. Для этого generic'ом в `axios.post` передаём `<User>`:

![[Pasted image 20241120163252.png]]

И ещё сделаем одну проверку для подстраховки: если с сервера нам придёт пустой ответ, то мы будем считать, что это ошибка:

>`loginByUsername`:

![[Pasted image 20241120163404.png]]


#### Итак, в `AsyncThunk` мы получили какие-то данные и вернули. НО `state` мы никак не изменяем. 

Чтобы `state` изменять, есть такое поле в `slice`'е -- `extraReducers` 

Т.е. обычные `reducer`'ы предназначены для обычного измененния, а `extraReducer`'ы -- для `asnycThunk`

>`loginByUsername.ts`:

![[Pasted image 20241120163649.png]]

У каждого `AsyncThunk`'а есть три состояния:

- `pending`
- `fulfilled`
- `rejected`

![[four__(three)___v001.png|300]]


<b>to know more about `typePrefix`, refer to the `WTF_is_a` folder</b>

##### <b>TL;DR</b>: 
`typePrefix` is the label for the task. The _real_ states are `pending`, `fulfilled`, and `rejected`. Don't sweat `typePrefix` unless you're doing some advanced Redux wizardry.

---
---


В общем, эти три состояния мы можем обработать

Документация:

![[Pasted image 20241120165505.png]]

Хз то это или нет, у него вот так:

![[Pasted image 20241120165610.png]]
![[Pasted image 20241120165627.png]]
![[Pasted image 20241120165640.png]]


Т.е. для всех трёх состояний добавляем по `reducer`'у и как-то изменяем 




>`loginSlice.ts`:

Щас у нас вот так:

![[Pasted image 20241120165739.png]]

терь вместо `fetchUserById` мы используем наш `Thunk`'овский `loginByUsername`:

>`loginSlice.ts`:

![[Pasted image 20241120165839.png]]
![[Pasted image 20241120165900.png]]


Терь лишнее:

![[1649961167_new_preview_AazteDO9pVU.png|300]]

![[Pasted image 20241120170007.png]]


!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
Тут я умер
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


У нас щас оно красным подсвечивает `loginByUsername`, что нет импорта. Импортировать тоже мы щас хуй импортируем, потому что нет экспорта

>`loginByUsername.ts`:

![[Pasted image 20241120170123.png]]

Щас ESLinter будет выёбываться на длину строки -- она слишком длинная

>`eslintrc.js`:

![[Pasted image 20241120170233.png]]


>`loginSlice.ts`:

Поменяем путь на относительный:

![[Pasted image 20241120170313.png]]


#### Терь разберёмся с самими `reducer`'ами:

Сначала обработаем состояние `pending` -- это, состояние, когда у нас начался выполняться `async action`

Тут обнуляем ошибку, если она, вдург, была и `isLoading` делаем `true`:

>`loginSlice.ts`:

![[Pasted image 20241120170459.png]]

(в этот момент мы будем показывать какой-то спиннер)




Затем, если у нас произошла ошибка или мы успешно загрузили данные, спиннер нам нужно убрать:

>`loginSlice.ts`:

![[Pasted image 20241120170619.png]]


По итогу, вот так:

![[Pasted image 20241120170721.png]]



#### Всё готово, терь попробуем `AsyncThunk` этот вызвать (уже внутри компонента)

>`LoginForm.tsx`:

![[Pasted image 20241120170848.png]]

Т.е. вот эта функци я`onLoginClick` будет отрабатывать в тот момент, когда мы нажали на кнопку

Ещё импорты поправим на относительные:

![[Pasted image 20241120170945.png]]



##### Теперь ёбнем:

```BASH:
npm run start:dev:server
```

Это мы поднимаем сервер, чтобы было куда отправлять запросы 

Щас, если мы откроем модалку и нажмём на "Войти":

Видим сообщение об ошибке:

![[Pasted image 20241120171130.png]]


`403` сообщение -- доступ запрещён

Т.е. мы ввели неправильные данные

>`db.json`:

![[Pasted image 20241120171223.png]]

Если мы откроем нашу БД, то тут увидим, что у нас один единственный пользователь с именем `admin` и паролем `123`


Если теперь попробуем войти под этими кредами:

![[Pasted image 20241120171321.png]]

Если откроем вкладку `network`:

![[Pasted image 20241120171353.png]]

Можем, нажав на последнию запись `login` (этот запрос), увидеть:

![[Pasted image 20241120171446.png]]

Что у нас отправилось две пустые строчки



Т.е. причина ошибки такова, что мы отправляем не те данные на сервер



Зайдём в `Redux Devtools` и убедимся в том, что `state` у нас меняется:

![[Pasted image 20241120171610.png]]


В самом `state`'е данные у нас находятся правильные. Значит, баг происходит в сам момент отправки данных


>`LoginForm.tsx`:

![[Pasted image 20241120171723.png]]

Мы тут забыли передать `username` и `password`. Т.е. должно быть вот так:

>`LoginForm.tsx`:

![[Pasted image 20241120171804.png]]


Щас, если попробуем отправить, то:

![[Pasted image 20241120171830.png]]

получаем `200` статус-код, всё норм

!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
#### Терь в самом интерфейсе обработаем 

Запросы бывают долгими, поэтому обработаем через UI

Сначала за'disable'им кнопку в момент загрузки, чтобы тело не могло нажимать на неё несколько раз

>`Button.tsx`:

![[Pasted image 20241128144459.png]]

![[Pasted image 20241128144525.png]]

И ещё добавим один мод:

![[Pasted image 20241128144713.png]]

Т.е. когда у нас кнопка за'disable'ена, будем добавлять ещё какие-то стили

И в саму кнопку сам пропс:

![[Pasted image 20241128144808.png]]

>`Button.module.scss`:

![[Pasted image 20241128145642.png]]

Т.е. просто сделаем её полупрозрачной


>`Button.stories.tsx`:

Сразу добавим на это состояние SB

![[Pasted image 20241128145752.png]]



Терь вернёмся в форму логина (`LoginForm`). Тут мы все пропсы деструктуризировали. Саму кнопку будем `disable`'ить по флагу `isLoading`: когда он `true`, кнопка за'disable'ена

![[Pasted image 20241128151853.png]]


#### Также будем обрабатывать ошибку -- это будет блок `div`, который будет отрисовываться в том случае, если есть ошибка

>`LoginForm.tsx`:

![[Pasted image 20241128152029.png]]



Терь, если мы нажмём на "Войти", то сама кнопка "войти" за'disable'иться:

![[Pasted image 20241128152125.png|600]]

И, если то, что мы сейчас ввели

![[Pasted image 20241128152249.png|500]]

То выдет вот этот `<div>` с ошибкой:

![[Pasted image 20241128152325.png]]

Но при вводе правильных данных, сообщение об ошибке пропадает:

![[Pasted image 20241128152613.png|500]]



### Создадим новый UI-компонент: `Text`

##### Он будет предназначен для работы конкретно с текстовыми данными 

`Text.tsx`:

![[Pasted image 20241128152812.png]]

В идеале разработать такую библиотеку UI-компонентов, при которой CSS'а мы будем писать по-минимуму

Т.е. все запросы должна удовлетворять библиотека компонентов

У нас компонент `Text` будет принимать два пропса:

1. Заголовок
2. Описание (какой-то текст)

>`Text.tsx`:

![[Pasted image 20241128153412.png]]

Тут основная задача этого компонента  в том, чтобы отобразить по условию заголовок и текст к этому заголовку 

Насчёт семантики (`<h1>` - `<h6>` и прочее) -- пока на это похуй, делаем по-простому

Но, будут особые стили: для заголовка используем `primary` текст, а для `text`'а обычного -- используем `secondary`



>`Text.module.scss`:

![[Pasted image 20241128153946.png]]

##### Поскольку у нас это `shared` слой, то для него напишем storybook

`Text.stories.tsx`:

![[Pasted image 20241128154057.png]]

>`Text.stories.tsx`:

После того, как удалили все лишние примеры:

![[Pasted image 20241128154151.png]]

Также поменяем названия компонента:

>`Text.stories.tsx`:

![[Pasted image 20241128154253.png]]

И теперь, касательно пропсов, удалим старое и поставим то, как оно должно быть:

 ![[Pasted image 20241128155236.png]]



Также реализуем ещё два story-case'а, поскольку этот компонент может быть использован только с заголовком или только с описанием (это значит, что либо только `title`, либо только `text` -- вот либо это, либо то, как пропс могут быть переданы по отдельности без их other counterpart):

![[Pasted image 20241128155526.png]]


И тут Ulbi стреляет моча в голову и он решает добавить ещё SB для тёмной темы (но тут просто можно скопировать всё, что есть и добавить приставку `dark`):

![[Pasted image 20241128155723.png]]

Плюс, нужно добавить декоратор с тёмной темой

![[Pasted image 20241128155818.png]]


### Теперь реализуем разные темы для этого компонента 

У нас будет дефолтная тема и тема, с помощью которой будем отображать ошибки

![[Pasted image 20241128160212.png]]
![[Pasted image 20241128160221.png]]


`error` тему добавили, теперь реализуем соответствующие стили для неё 


>`globals.scss`:

![[Pasted image 20241128160407.png]]

>`Text.module.scss`:

![[Pasted image 20241128160602.png]]

Терь, когда стили готовы, реализуем SB для этой темы

![[Pasted image 20241128160713.png]]


Щас будет ошибка. Это потому что вот тут:

>`Text.tsx`:

![[Pasted image 20241128160753.png]]

`true` должно быть за скобкой:

![[Pasted image 20241128160823.png]]

И щас, по идее, должно быть вот так:

![[Pasted image 20241128161018.png]]


Вернёмся в `LoginForm.tsx`:

>`LoginForm.tsx`:

![[Pasted image 20241128161128.png]]

У нас тут `<div>`, а сейчас мы вместо этого ёбнем `<Text>`:

>`LoginForm.tsx`:

![[Pasted image 20241128161245.png]]

На текущий момент у нас просто два `input`'а и кнопка. Ulbi нашёл это blasphemous и посчитал, что ещё нужно написать для чего эта модалка нужна

>`LoginForm.tsx`:

![[Pasted image 20241128161413.png]]


И терь вот так:

![[Pasted image 20241128161453.png]]



Если хуйню напишем, то:

![[Pasted image 20241128161514.png|600]]



#### Терь Ulbi почитал, что просто сообщение `error` недостаточно осмысленное и нужон смысол

>`loginByUsername.ts`:
 ![[Pasted image 20241128161727.png]]

Тут мы импортируем `i18n` напрямую, потому что `t()` использовать не можем

![[Pasted image 20241128161812.png]]


Этот конфиг `i18n` -- у него есть функция `.t()`, которую мы можем использовать. И будет вот так:

>`loginByUsername.ts`:

![[Pasted image 20241128161945.png]]

#### Мы реализовали логику авторизации, но с данными, которые мы получаем с сервака -- с ними мы ничё не делаем

Их нужно сохранять в `state` и таким образом мы будем определять, авторизован ли пользователь или нет


>30:40

