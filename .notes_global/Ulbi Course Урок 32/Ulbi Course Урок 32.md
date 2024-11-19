
Итак, у нас есть вот эта БД:

![[Pasted image 20241118142701.png]]

Где у тел есть имя и пароль

Также, у нас есть профиль, по которому чуть позже будем получать более развёрнутую информацию о пользователе (например, аватар, его возраст, фамилию и т.д....)

#### Настал момент сделать первое `entity`

`Counter` у нас тоже был `entity`, но это был, скорее, искуственный пример, а `User` - уже самый настоящий 

![[Pasted image 20241118145757.png]]

> `userSlice.ts`:

Содержимое для этого дерьма скопируем уже из имеющегося `counterSlice.ts`

Удалим лишнее и поменяем местами названия, чтобы было вот так:

![[Pasted image 20241118150011.png]]
![[Pasted image 20241118150037.png]]

Терь перейдём в `index.ts`:

>`index.ts`:

![[Pasted image 20241118150136.png]]

Сохранять пользователя в `state` будем как раз-таки с помощью этих `action`'ов


В папке `./types` создаём файл `user.ts`, откуда будем экспортировать интерфейс

> `user.ts`:

![[Pasted image 20241118150326.png]]

Пароль на фронт'энде не храним, поэтому его сюда не добавляем


Теперь у нас интерфейс для `state`'а: `UserSchema`

![[Pasted image 20241118150501.png]]

Если `authData` будет `undefined`, то значит юзер не авторизован. Если хранятся какие-то данные, то значит пользователь авторизован

![[Pasted image 20241118150326.png]]
![[Pasted image 20241118150507.png]]

> `userSlice.ts`:

![[Pasted image 20241118150611.png]]


Вернёмся в publicAPI и отсюда также экспортируем и типы. Сущность пользователя будет использоваться, практически, везде, поэтому сам тип `User` также экспортируем наружу. Также экспортируем `UserSchema`, т.к. нам будет необходимо добавить этот тип в корневой интерфейс

>`index.ts`:

![[Pasted image 20241118150822.png]]

Теперь откроем конфиг `StateSchema`, куда добавим ещё одно поле:

>`StateSchema.ts`:

![[Pasted image 20241118150917.png]]

>`store.ts`:

![[Pasted image 20241118151014.png]]

Тут нам TS подсказывает, что у нас есть обязательное поле `User`, но мы не добавили для него `reducer`. 

##### Для корневого reducer'а создадим объект отдельно повыше. Для этого у Redux'а есть специальный тип `ReducersMapObject`

###### Откуда это он знает?

##### Если навести с зажатым `ctrl` на `reducer`, то увидим:

![[Pasted image 20241118151208.png]]


Теперь, generic'ом передаём тип для этого reducer'а

> `store.ts`:

![[Pasted image 20241118151257.png]]

```TSX:
import { configureStore, ReducersMapObject } from '@reduxjs/toolkit';  
import { counterReducer } from 'entities/Counter';  
import { userReducer } from 'app/entities/User';  
import { StateSchema } from './StateSchema';  
  
export function createReduxStore(initialState?: StateSchema) {  
    const rootReducers: ReducersMapObject<StateSchema> = {  
        counter: counterReducer,  
        user: userReducer,  
    };  
  
    return configureStore<StateSchema>({  
        reducer: rootReducers,  
        devTools: __IS_DEV__,  
        preloadedState: initialState,  
    });  
}
```

### Щас мы подбираемся к тому, чтобы вот в этой модалке:

![[Pasted image 20241118151349.png]]

### ... у нас была форма авторизации, в которую мы будем вводить `username` и `пароль`

### И тут мы подбираемся к созданию первой фичи:

![[Pasted image 20241118151448.png]]

У нас уже есть 2 `entities` -- `user` и `counter` 

#### Сейчас мы создадим первую фичу, которая будет называться
#### `authByUsername`

![[Pasted image 20241118151718.png]]


> `LoginForm.tsx`:


![[Pasted image 20241118152714.png]]

У нас будет два `input`'а -- один для `username`'а, один для `пароля`

Для пароля оставим `type="text"`, чтобы было видно, что вводим

Также ёбнем кнопку, при нажатии на которую, мы будем логиниться

![[Pasted image 20241118152855.png]]


>`LoginModal.tsx`:

![[Pasted image 20241118152940.png]]

>`index.ts`:

Теперь эту модалку нужно отдать наружу. Тут прикол в том, что саму форму мы наружу не отдаём. Снаружи нам нужна только модалка, которую мы сможем открывать и закрывать. По этой причине из publiAPI экспортируем только её

![[Pasted image 20241118153108.png]]

Сама форма остаётся изолирована внутри этого модуля

У меня, вообще, вот так:

![[Pasted image 20241119115233.png]]

```BASH:
TS2307: Cannot find module './ui/LoginModal/LoginModal' or its corresponding type declarations.
```

Какого-то хуя, опять, несмотря на явно правильный путь, оно мне пишет, что такой хуйни не существует

Теперь вернёмся к `Navbar.tsx`:

>`Navbar.tsx`:

Вместо той модалки, которая у нас здесь использовалась (за'hardcode'женная, используем `<LoginModal />`):

![[Pasted image 20241118153244.png]]

Также добавим пропсы, которые будут отвечать за видимость модалки 

>`LoginModal.tsx`:


![[Pasted image 20241118153359.png]]

Если мы теперь, удерживая `ctrl`, нажмём на:

![[Pasted image 20241118153435.png]]

То попадём сюда, где передаём те самые пропсы щас:


![[Pasted image 20241118153538.png]]

`onClose` -- это мы поменяли название `onToggleModal` на `onClose`

![[Pasted image 20241118153618.png]]

Там же передаём `false`, а не `prev => !prev`. Т.е. щас у нас за'hardcode'жено будет

Терь сделаем такую же функцию, но теперь которая будет эту модалку показывать: 

![[Pasted image 20241118153747.png]]

Тут тоже хардкодим, задавая `true`

И вешаем эту функцию на кнопку:

![[Pasted image 20241118154118.png]]

Теперь, при нажатии на `Войти`, имеем:

![[Pasted image 20241118154146.png]]


ulbi посчитал, что это не pinnacle of UI


> `LoginForm.module.scss`:

![[Pasted image 20241118160202.png]]

Я немного навалил своего кринжа:

```SCSS:
.LoginForm {  
  display: flex;  
  flex-direction: column;  
  width: 400px;  
}  
  
.input {  
  margin-top: 10px;  
  border-radius: 8px;  
  
  &:focus {  
    border: 2px solid var(--inverted-bg-color);  
  }  
}  
  
.loginBtn {  
  margin-top: 15px;  
  margin-left: auto;  
  font-weight: bold;  
}
```

>`LoginForm.tsx`:

Терь соответствующие классы повесим на кнопки

![[Pasted image 20241118160117.png]]

```TSX:
import { classNames } from 'shared/lib/classNames/classNames';  
import { useTranslation } from 'react-i18next';  
import { Button } from 'shared/ui/Button/Button';  
import cls from './LoginForm.module.scss';  
  
interface LoginFormProps {  
    className?: string;  
}  
  
export const LoginForm = ({ className }: LoginFormProps) => {  
    const { t } = useTranslation();  
  
    return (  
        <div className={classNames(cls.LoginForm, {}, [className])}>  
            <input type="text" className={cls.input} />  
            <input type="text" className={cls.input} />  
            <Button className={cls.loginBtn}>  
                {t('Войти')}  
            </Button>  
        </div>    );  
};
```

Терь вот так:


![[Pasted image 20241118160214.png]]

Теперь просто божественно выглядит



### Возникает интерес:

#### Для кнопок и ссылок мы делали отдельные компоненты в `shared` слое. Почему не сделали такой компонент для `input`'а?

### Поэтому щас сделаем переиспользуемый компонент для `input`'а в `shared` слое

![[Pasted image 20241118160414.png]]

Интернационализация нам тут нахуй не нужна, поэтому убираем `useTranslation` нахуй

![[Pasted image 20241118160448.png]]

Тут же создадим файл для стилей

>`Input.module.scss`:

![[Pasted image 20241118160546.png]]

Это мы добавляем корневой класс `.Input`

Вернёмся пока к компоненту `Input.tsx`. Разберёмся с пропсами, которые `Input` будет принимать

В `Button.tsx` мы указывали вот такую конструкцию:

>`Button.tsx`:

![[Pasted image 20241118161235.png]]

Т.е. мы расширяли стандартные пропсы, которые принимает кнопка

Нечто подобное сделаем для `Input`'а, только теперь аттрибуты `Input`'овские:

>`Input.tsx`:

![[Pasted image 20241118161424.png]]

Щас у нас TS будет выёбываться:

![[Pasted image 20241118161440.png]]

На то, что в `InputHTMLAttributes` уже есть `value` и `onChange`. А мы их объявили самостоятельно, так они ещё и немного оличаются (default'ный `onChange` принимает `event`,  а не само `value`)

Воспользуемся для разрешения этого всего конструкцией `<Omit>` -- он позволяет забрать из типа все пропсы, но те, которые нам не нужны - их можно исключить

![[Pasted image 20241118161740.png]]

Щас у нас выёбывается ESLinter, что эти пропсы мы нигде не используем, поэтому сделаем деструктуризацию (ещё обернём компонент в `memo`)

> `Input.tsx`:

![[Pasted image 20241118161945.png]]


Ещё раз, стандартный `input` HTML'овский -- он в качестве аргумента функции `onChange` принимает `event`, а мы наверх хотим сразу отдавать `value` (типо, нам наверху `event` не нужен, если мы просто хотим поменять значение)


![[Pasted image 20241118162721.png]]

`type` у нас может быть тоже разный -- может быть `number`, `date`, ...

Поэтому, его тоже деструктуризируем:

![[Pasted image 20241118162806.png]]
![[Pasted image 20241118162814.png]]


Т.е., если мы это значение хотим пере-определить, то передаём что-то другое. В ином случае - это текст

>`Input.tsx`:

![[Pasted image 20241118163015.png]]

И терь реализуем функцию для этого слушателя события

Опять-таки, принимает она `event`. И для этого `event`'а есть тип, который называется `ChangeEvent` и, как `generic` мы передаём туда `input`

![[Pasted image 20241118163313.png]]

Внутри мы вызываем сам пропс `onChange`, который мы передаём извне. Поскольку этот пропс необязателен (т.е. его могут и не передать), мы используем оператор optional chaining, т.е. `?`

В таком случае, если этот пропс не передан, то функция вызвана не будет

> `Input.tsx`:

```TSX:
import { classNames } from 'shared/lib/classNames/classNames';  
import React, { ButtonHTMLAttributes, InputHTMLAttributes, memo } from 'react';  
import { ButtonSize, ButtonTheme } from 'shared/ui/Button/Button';  
import cls from './Input.module.scss';  
  
interface InputProps extends InputHTMLAttributes<HTMLInputElement>{  
    className?: string;  
    value?: string;  
    onChange?: (value: string) => void;  
}  
  
export const Input = memo((props: InputProps) => {  
    const {  
        className,  
        value,  
        onChange,  
        type = 'text',  
        ...otherPropps  
    } = props;  
  
    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {  
        onChange?.(e.target.value);  
    };  
  
    return (  
        <div className={classNames(cls.Input, {}, [className])}>  
            <input                type={type}  
                value={value}  
                onChange={onChangeHandler}  
            />  
        </div>    );  
});
```

>`LoginForm.tsx`:

Щас у нас вот так:

![[Pasted image 20241118163531.png]]

Это надо будет поменять на наши кастомные `Input`'ы:

![[Pasted image 20241118170730.png]]

Терь откроем `MainPage.tsx` и добавим `<Input>`, чтобы мы могли его протестировать:


>`MainPage.tsx`:

Мы уже добавляли его в модалку, но, по мнению Ulbi, открывать последнюю каждый раз неудобно, поэтому добавим в `MainPage`

![[Pasted image 20241118171445.png]]

Сразу сделаем `onChange`, который будет в качестве значения принимать строку и сразу её ставить

```TSX:
import React, { useState } from 'react';  
import { useTranslation } from 'react-i18next';  
import { Input } from 'shared/ui/input/Input';  
  
const MainPage = () => {  
    const { t } = useTranslation();  
    const [value, setValue] = useState('');  
  
    const onChange = (val: string) => {  
        setValue(val);  
    };  
  
    return (  
        <div>  
            {t('Главная страница')}  
            <Input  
                value={value}  
                onChange={onChange}  
            />  
        </div>    );  
};  
  
export default MainPage;
```

Щас на главной странице у нас получился обычный input:

![[Pasted image 20241118171542.png]]

#### Терь разберёмся со стилизацией

Делаем франкенштейна - идея сделать так, чтобы была прогерская анимация при вводе

>`Input.tsx`:

![[Pasted image 20241118174638.png]]

Для `placeholder`'а создаём отдельный блок:

![[Pasted image 20241118174715.png]]

Внутри которого сам `{placeholder}`

Чисто, чтобы выглядело "по-прогерски", добавим вот такую стрелочку `>`:

![[Pasted image 20241118174807.png]]

Ещё переименуем имя класса:

![[Pasted image 20241118174910.png]]

>`Input.module.scss`:

![[Pasted image 20241118174934.png]]

>`MainPage.tsx`:

Укажем тут `placholder`, чтобы посмотреть, как это всё выглядит

![[Pasted image 20241118175131.png]]

Терь вот так:

![[Pasted image 20241118175149.png]]


Терь нужно разобраться со случаем, когда `placeholder` не указали

17:05

