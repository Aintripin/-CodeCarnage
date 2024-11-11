Щас у нас появится авторизация, поэтому создадим модальное окно

> `Modal.tsx`:

![[Pasted image 20241110195007.png]]


> `Modal.tsx`:

```TSX:
import {classNames} from "shared/lib/classNames/classNames";  
import cls from "./Modal.module.scss"  
import { ReactNode } from 'react';  
  
interface ModalProps {  
    className?: string;  
    children?: ReactNode;  
}  
  
export const Modal = (props: ModalProps) => {  
  
    const {  
        className,  
        children  
    } = props;  
  
    return (  
        <div className={classNames(cls.Modal, {}, [className])}>  
            <div className={cls.overlay}>  
                <div className={cls.content}>  
                    {children}  
                </div>  
            </div>        </div>    )  
}
```

>`Modal.module.scss`:

```SCSS:
.Modal {  
  position: fixed;  
  left: 0;  
  top: 0;  
  right: 0;  
  bottom: 0;  
  z-index: var(--modal-z-index);  
}  
  
.overlay {  
  width: 100%;  
  height: 100%;  
  background-color: var(--overlay-color);  
  display: flex;  
  align-items: center;  
  justify-content: center;  
}  
  
.content {  
  padding: 20px;  
  border-radius: 12px;  
  background-color: var(--bg-color);  
}
```

> `global.scss`:

```SCSS:
:root {  
    --font-family-main: consolas, "Times New Roman", serif;  
    --font-size-m: 16px;  
    --font-line-m: 24px;  
    --font-m: var(--font-size-m) / var(--font-line-m) var(--font-family-main);  
    --font-size-l: 24px;  
    --font-line-l: 32px;  
    --font-l: var(--font-size-l) / var(--font-line-l) var(--font-family-main);  
    --font-size-xl: 32px;  
    --font-line-xl: 40px;  
    --font-xl: var(--font-size-xl) / var(--font-line-xl) var(--font-family-main);  
  
    // Размеры  
    --navbar-height: 50px;  
    --sidebar-width: 300px;  
    --sidebar-width-collapsed: 80px;  
  
    // Индексы  
    --modal-z-index: 10;  
  
    // Цвета  
    --overlay-color: rgba(0, 0, 0, .6);  
}
```




> `App.tsx`:

```TSX:
import React, { Suspense, useEffect } from 'react';  
import './styles/index.scss';  
import { classNames } from 'shared/lib/classNames/classNames';  
import { useTheme } from 'app/providers/ThemeProvider';  
import { AppRouter } from 'app/providers/router';  
import { Navbar } from 'widgets/Navbar';  
import { Sidebar } from 'widgets/Sidebar';  
import { Modal } from 'shared/ui/Modal/Modal';  
  
function App() {  
    const { theme } = useTheme();  
  
    const [isOpen, setIsOpen] = React.useState(false);  
  
    return (  
        <div className={classNames('app', {}, [theme])}>  
            <Suspense fallback="">  
                <Navbar />                <button onClick={() => setIsOpen(true)}>toggle</button>  
                <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}/>  
                <div className="content-page">  
                    <Sidebar />                    <AppRouter />                </div>            </Suspense>        </div>    );  
}  
  
export default App;
```

> `Modal.tsx`:

```TSX:
import {classNames} from "shared/lib/classNames/classNames";  
import cls from "./Modal.module.scss"  
import { ReactNode } from 'react';  
  
interface ModalProps {  
    className?: string;  
    children?: ReactNode;  
    isOpen?: boolean;  
    onClose?: () => void;  
}  
  
export const Modal = (props: ModalProps) => {  
  
    const {  
        className,  
        children,  
        isOpen,  
        onClose,  
    } = props;  
  
    const mods: Record<string, boolean> = {  
        [cls.opened]: isOpen,  
    };  
  
    return (  
        <div className={classNames(cls.Modal, mods, [className])}>  
            <div className={cls.overlay}>  
                <div className={cls.content}>  
                    {children}  
                </div>  
            </div>        </div>    )  
}
```

> `Modal.module.scss`:

```SCSS:
.Modal {  
  position: fixed;  
  left: 0;  
  top: 0;  
  right: 0;  
  bottom: 0;  
  opacity: 0;  
  pointer-events: none;  
  z-index: -1;  
}  
  
.overlay {  
  width: 100%;  
  height: 100%;  
  background-color: var(--overlay-color);  
  display: flex;  
  align-items: center;  
  justify-content: center;  
}  
  
.content {  
  padding: 20px;  
  border-radius: 12px;  
  background-color: var(--bg-color);  
}  
  
.opened {  
  pointer-events: auto;  
  opacity: 1;  
  z-index: var(--modal-z-index);  
}
```

> `Modal.tsx`:

```TSX:
import {classNames} from "shared/lib/classNames/classNames";  
import cls from "./Modal.module.scss"  
import { ReactNode } from 'react';  
  
interface ModalProps {  
    className?: string;  
    children?: ReactNode;  
    isOpen?: boolean;  
    onClose?: () => void;  
}  
  
export const Modal = (props: ModalProps) => {  
  
    const {  
        className,  
        children,  
        isOpen,  
        onClose,  
    } = props;  
  
    const closeHandler = () => {  
        if (onClose) {  
            onClose();  
        }  
    }  
  
    const mods: Record<string, boolean> = {  
        [cls.opened]: isOpen,  
    };  
  
    return (  
        <div className={classNames(cls.Modal, mods, [className])}>  
            <div className={cls.overlay} onClick={closeHandler}>  
                <div className={cls.content}>  
                    {children}  
                </div>  
            </div>        </div>    )  
}
```

Щас, если мы нажмём за пределы контента, то всё норм - модалка закрывается. Но даже, если мы нажмём на сам контент:

![[Pasted image 20241111000145.png]]

То при нажатии на него, модальное окно всё равно закроется

Это происходит из-за event propagation - всплытия событий 

Этот контент - часть overlay'а — оно находится внутри

Чтобы это предотвратить, на контентную часть тоже нужно повесить слушатель и пердотвратить всплытие:

![[Pasted image 20241111000904.png]]

>`Modal.tsx`:

```TSX:
import {classNames} from "shared/lib/classNames/classNames";  
import cls from "./Modal.module.scss"  
import React, { ReactNode } from 'react';  
  
interface ModalProps {  
    className?: string;  
    children?: ReactNode;  
    isOpen?: boolean;  
    onClose?: () => void;  
}  
  
export const Modal = (props: ModalProps) => {  
  
    const {  
        className,  
        children,  
        isOpen,  
        onClose,  
    } = props;  
  
    const closeHandler = () => {  
        if (onClose) {  
            onClose();  
        }  
    }  
  
    const onContentClick = (e: React.MouseEvent) => {  
        e.stopPropagation();  
    }  
  
    const mods: Record<string, boolean> = {  
        [cls.opened]: isOpen,  
    };  
  
    return (  
        <div className={classNames(cls.Modal, mods, [className])}>  
            <div className={cls.overlay} onClick={closeHandler}>  
                <div className={cls.content} onClick={onContentClick}>  
                    {children}  
                </div>  
            </div>        </div>    )  
}
```

> `Modal.tsx`

Щас у нас ESLinter будет ругаться на:

![[Pasted image 20241111001144.png]]

Это из-за семантики. На `<div>` либо не вешать такое и повесить на кнопку, либо повесить ещё обработку пробела и `enter`'а (то, что по умолчанию идёт в кнопке)

![[Pasted image 20241111001259.png]]

>`eslintrc.js`:

![[Pasted image 20241111001506.png]]



Добавим анимацию:

> `Modal.module.scss`:

```SCSS:
.Modal {  
  position: fixed;  
  left: 0;  
  top: 0;  
  right: 0;  
  bottom: 0;  
  opacity: 0;  
  pointer-events: none;  
  z-index: -1;  
}  
  
.overlay {  
  width: 100%;  
  height: 100%;  
  background-color: var(--overlay-color);  
  display: flex;  
  align-items: center;  
  justify-content: center;  
}  
  
.content {  
  padding: 20px;  
  border-radius: 12px;  
  background-color: var(--bg-color);  
  
  transition: .3s transform;  
  transform: scale(.5);  
  max-width: 60%;  
}  
  
.opened {  
  pointer-events: auto;  
  opacity: 1;  
  z-index: var(--modal-z-index);  
  
  .content {  
    transform: scale(1);  
  }  
}
```

> `App.tsx`:

```TSX:
import {classNames} from "shared/lib/classNames/classNames";  
import cls from "./Modal.module.scss"  
import React, { ReactNode } from 'react';  
  
interface ModalProps {  
    className?: string;  
    children?: ReactNode;  
    isOpen?: boolean;  
    onClose?: () => void;  
}  
  
export const Modal = (props: ModalProps) => {  
  
    const {  
        className,  
        children,  
        isOpen,  
        onClose,  
    } = props;  
  
    const closeHandler = () => {  
        if (onClose) {  
            onClose();  
        }  
    }  
  
    const onContentClick = (e: React.MouseEvent) => {  
        e.stopPropagation();  
    }  
  
    const mods: Record<string, boolean> = {  
        [cls.opened]: isOpen,  
    };  
  
    return (  
        <div className={classNames(cls.Modal, mods, [className])}>  
            <div className={cls.overlay} onClick={closeHandler}>  
                <div                    className={classNames(cls.content, {[cls.contentOpened]: isOpen})}  
                    onClick={onContentClick}  
                >  
                    {children}  
                </div>  
            </div>        </div>    )  
}
```

> `Modal.tsx`:

```TSX:
import {classNames} from "shared/lib/classNames/classNames";  
import cls from "./Modal.module.scss"  
import React, { ReactNode } from 'react';  
  
interface ModalProps {  
    className?: string;  
    children?: ReactNode;  
    isOpen?: boolean;  
    onClose?: () => void;  
}  
  
export const Modal = (props: ModalProps) => {  
  
    const {  
        className,  
        children,  
        isOpen,  
        onClose,  
    } = props;  
  
    const closeHandler = () => {  
        if (onClose) {  
            onClose();  
        }  
    }  
  
    const onContentClick = (e: React.MouseEvent) => {  
        e.stopPropagation();  
    }  
  
    const mods: Record<string, boolean> = {  
        [cls.opened]: isOpen,  
    };  
  
    return (  
        <div className={classNames(cls.Modal, mods, [className])}>  
            <div className={cls.overlay} onClick={closeHandler}>  
                <div                    className={classNames(cls.content, {[cls.contentOpened]: isOpen})}  
                    onClick={onContentClick}  
                >  
                    {children}  
                </div>  
            </div>        </div>    )  
}
```


Короче, у него изначально не работала анимация. После нескольких минут тыкания по клавишам, выяснилось, что была опечатка в `scss` файле. В общем, при таком раскладе `classnames()` можно убрать и теперь:

> `Modal.tsx`:

```TSX:
import { classNames } from 'shared/lib/classNames/classNames';  
import React, { ReactNode } from 'react';  
import cls from './Modal.module.scss';  
  
    interface ModalProps {  
        className?: string;  
        children?: ReactNode;  
        isOpen?: boolean;  
        onClose?: () => void;  
    }  
  
export const Modal = (props: ModalProps) => {  
    const {  
        className,  
        children,  
        isOpen,  
        onClose,  
    } = props;  
  
    const closeHandler = () => {  
        if (onClose) {  
            onClose();  
        }  
    };  
  
    const onContentClick = (e: React.MouseEvent) => {  
        e.stopPropagation();  
    };  
  
    const mods: Record<string, boolean> = {  
        [cls.opened]: isOpen,  
    };  
  
    return (  
        <div className={classNames(cls.Modal, mods, [className])}>  
            <div className={cls.overlay} onClick={closeHandler}>  
                <div                    className={cls.content}  
                    onClick={onContentClick}  
                >  
                    {children}  
                </div>  
            </div>        </div>    );  
};
```

Щас у нас открывание плавное, но закрывание модалки резкое. Ulbi говорит, что средствами CSS мы хуй чё сделаем, поэтому будем добавлять по `timeout`'у добавлять стили для закрытия


![[Pasted image 20241111103240.png]]

В момент, когда  у нас отработал `closeHandler`, когда мы попытались закрыть модальное окно, мы будем вешать `timeout`, а его будем помещать в `timerRef` (чтобы, если что, мы могли его очистить)


> `Modal.tsx`:

```TSX:
import { classNames } from 'shared/lib/classNames/classNames';  
import React, { ReactNode, useRef, useState } from 'react';  
import cls from './Modal.module.scss';  
  
interface ModalProps {  
    className?: string;  
    children?: ReactNode;  
    isOpen?: boolean;  
    onClose?: () => void;  
}  
  
const ANIMATION_DELAY = 300;  
  
export const Modal = (props: ModalProps) => {  
    const {  
        className,  
        children,  
        isOpen,  
        onClose,  
    } = props;  
  
    const [isClosing, setIsClosing] = useState(false);  
    const timeRef = useRef<ReturnType<typeof setTimeout>>();  
  
    const closeHandler = () => {  
        if (onClose) {  
            onClose();  
            timeRef.current = setTimeout(() => {  
                onClose();  
            }, ANIMATION_DELAY);  
        }  
    };  
  
    const onContentClick = (e: React.MouseEvent) => {  
        e.stopPropagation();  
    };  
  
    const mods: Record<string, boolean> = {  
        [cls.opened]: isOpen,  
    };  
  
    return (  
        <div className={classNames(cls.Modal, mods, [className])}>  
            <div className={cls.overlay} onClick={closeHandler}>  
                <div                    className={cls.content}  
                    onClick={onContentClick}  
                >  
                    {children}  
                </div>  
            </div>        </div>    );  
};
```

#### Что тут происходит:

Вот эта тема:

```TSX:
const timeRef = useRef<ReturnType<typeof setTimeout>>();  
```

`ReturnType` возвращает нам тип функции `setTimeout` в нашем случае

Изначально было вот так:

![[Pasted image 20241111104341.png]]

И, если мы нажмём на `setTimeout` сейчас, то в моём случае меня кидает в ебеня:

![[Pasted image 20241111104433.png]]

Вообще, у Ulbi было вот так:

![[Pasted image 20241111104501.png]]

У ся тоже нашёл, это `timers.d.ts`:

![[Pasted image 20241111104613.png]]

Мы, по какой-то причине, как сказал Ulbi, тащить `NodeJS` не будем. И, чтобы не тащить, делаем


```TSX:
const timeRef = useRef<ReturnType<typeof setTimeout>>();  
```

Т.е., как я понял, то, что выше и:

```TSX:
const timeRef = useRef<NodeJS.Timeout>();  
```

-- одно и то же

#### А почему именно первый вариант всё-таки:

- **`NodeJS.Timeout`**:
    
    - This is the specific type for `setTimeout`'s return value **in Node.js**.
    - It won’t work properly in a browser because browsers don’t use `NodeJS.Timeout`—they just use a `number` for the ID returned by `setTimeout`.
- **`ReturnType<typeof setTimeout>`**:
    
    - This is a flexible way of getting whatever type `setTimeout` returns, depending on where it’s run.
    - If you’re in Node.js, it’ll be `NodeJS.Timeout`. In a browser, it’ll be `number`.
    - This is best for cross-environment compatibility because it adapts based on the environment.


> `Modal.tsx`:

```TSX:
import { classNames } from 'shared/lib/classNames/classNames';  
import React, { ReactNode, useRef, useState } from 'react';  
import cls from './Modal.module.scss';  
  
interface ModalProps {  
    className?: string;  
    children?: ReactNode;  
    isOpen?: boolean;  
    onClose?: () => void;  
}  
  
const ANIMATION_DELAY = 300;  
  
export const Modal = (props: ModalProps) => {  
    const {  
        className,  
        children,  
        isOpen,  
        onClose,  
    } = props;  
  
    const [isClosing, setIsClosing] = useState(false);  
    const timeRef = useRef<ReturnType<typeof setTimeout>>();  
  
    const closeHandler = () => {  
        if (onClose) {  
            setIsClosing(true);  
            timeRef.current = setTimeout(() => {  
                onClose();  
            }, ANIMATION_DELAY);  
        }  
    };  
  
    const onContentClick = (e: React.MouseEvent) => {  
        e.stopPropagation();  
    };  
  
    const mods: Record<string, boolean> = {  
        [cls.opened]: isOpen,  
        [cls.isClosing]: isClosing,  
    };  
  
    return (  
        <div className={classNames(cls.Modal, mods, [className])}>  
            <div className={cls.overlay} onClick={closeHandler}>  
                <div                    className={cls.content}  
                    onClick={onContentClick}  
                >  
                    {children}  
                </div>  
            </div>        </div>    );  
};
```


> `Modal.module.scss`:

```SCSS:
.Modal {  
  position: fixed;  
  left: 0;  
  top: 0;  
  right: 0;  
  bottom: 0;  
  opacity: 0;  
  pointer-events: none;  
  z-index: -1;  
}  
  
.overlay {  
  width: 100%;  
  height: 100%;  
  background-color: var(--overlay-color);  
  display: flex;  
  align-items: center;  
  justify-content: center;  
}  
  
.content {  
  padding: 20px;  
  border-radius: 12px;  
  background-color: var(--bg-color);  
  
  transition: .3s transform;  
  transform: scale(.5);  
  max-width: 60%;  
}  
  
.opened {  
  pointer-events: auto;  
  opacity: 1;  
  z-index: var(--modal-z-index);  
  
  .content {  
    transform: scale(1);  
  }  
}  
  
.isClosing {  
  .content {  
    transform: scale(.2 );  
  }  
}
```

Щас тема такая, что всё анимируется, но после закрытия и нажатия на `toggle` снова, чтобы вновь открыть окно, вот так:

![[Pasted image 20241111112114.png]]

У нас вот эта часть сохраняется:

![[Pasted image 20241111112210.png]]
Это фиксится тем, что после того как модалка закрылась, мы вернём состояние `setIsClosing` значение `false`

![[Pasted image 20241111112342.png]]

Т.е. перед тем, как закрывать, мы делаем его `true`, а после закрытия -- `false`

#### Почему `timeout` поместили в `ref`?

Если модальное окно, по какой-то причине демонтируется из дерева, у нас отработает `timeout`:

![[Pasted image 20241111112538.png]]

И мы попытаемся изменить состояние несуществующего уже удалённого компонента

В таком случае приложение у нас упадёт с ошибкой

Все `timeout`'ы, `timer`'ы, которые мы используем внутри компонента -- любые асинхронные операции внутри `useEffect`'а, по хорошему, нужно очищать


![[Pasted image 20241111113543.png]]

Терь сделаем так, чтобы модалку можно было закрыть при нажатии `esc` на клавиатуре

```TSX:
useEffect(() => () => {  
    if (isOpen) {  
        window.addEventListener('keydown', onKeyDown);  
    }  
  
    clearTimeout(timeRef.current);  
}, [isOpen]);
```

В качестве `callback` передаём `onKeyDown`:

```TSX:
const onKeyDown = (e: KeyboardEvent) => {  
    if (e.key === 'Escape') {  
        closeHandler();  
    }  
};
```

Щас мы повесили слушатель события на `window`. Даже после закрытия этого модального окна, слушатель всё равно останется. Его тоже нужно в `useEffect` очистить

```TSX:
useEffect(() => () => {  
    if (isOpen) {  
        window.addEventListener('keydown', onKeyDown);  
    }  
  
    clearTimeout(timeRef.current);  
    window.removeEventListener('keydown', onKeyDown);  // <------------------
}, [isOpen]);
```

#### Щас следующий нюанс:

`onKeyDown` -- стрелочная функция. На каждый пере-рендер компонента, у нас вот эти функции:

![[Pasted image 20241111114502.png]]

создаются заново

Соответственно, у каждой из, будет новая ссылка

Чтобы ссылку на функцию сохранять, используем функцию, которая мемоизирует значения какой-то функции, запоминает его и всегда возвращает нам ссылку на функцию - `useCallback` (если в массиве зависимостей нчиего не изменилось)


> `Modal.tsx`:

```TSX:
import { classNames } from 'shared/lib/classNames/classNames';  
import React, {  
    ReactNode, useCallback, useEffect, useRef, useState,  
} from 'react';  
import cls from './Modal.module.scss';  
  
interface ModalProps {  
    className?: string;  
    children?: ReactNode;  
    isOpen?: boolean;  
    onClose?: () => void;  
}  
  
const ANIMATION_DELAY = 300;  
  
export const Modal = (props: ModalProps) => {  
    const {  
        className,  
        children,  
        isOpen,  
        onClose,  
    } = props;  
  
    const [isClosing, setIsClosing] = useState(false);  
    const timeRef = useRef<ReturnType<typeof setTimeout>>();  
  
    const closeHandler = () => {  
        if (onClose) {  
            setIsClosing(true);  
            timeRef.current = setTimeout(() => {  
                onClose();  
                setIsClosing(false);  
            }, ANIMATION_DELAY);  
        }  
    };  
  
    const onKeyDown = useCallback((e: KeyboardEvent) => {  
        if (e.key === 'Escape') {  
            closeHandler();  
        }  
    }, [closeHandler]);  
  
    const onContentClick = (e: React.MouseEvent) => {  
        e.stopPropagation();  
    };  
  
    useEffect(() => {  
        if (isOpen) {  
            window.addEventListener('keydown', onKeyDown);  
        }  
  
        return () => {  
            clearTimeout(timeRef.current);  
            window.removeEventListener('keydown', onKeyDown);  
        };  
    }, [isOpen, onKeyDown]);  
  
    const mods: Record<string, boolean> = {  
        [cls.opened]: isOpen,  
        [cls.isClosing]: isClosing,  
    };  
  
    return (  
        <div className={classNames(cls.Modal, mods, [className])}>  
            <div className={cls.overlay} onClick={closeHandler}>  
                <div                    className={cls.content}  
                    onClick={onContentClick}  
                >  
                    {children}  
                </div>  
            </div>        </div>    );  
};
```

#### Ulbi говорит, что эти зависимости, мемоизация, сохранение ссылок, значений и проче -- процесс тонкий 

Можно передать лишнее, забыть чё-то убрать и прочее

##### Поэтому настроим на это Linter

![[Pasted image 20241111122729.png]]

Это вот оно:

![[Pasted image 20241111122810.png]]

```BASH:
npm install eslint-plugin-react-hooks --save-dev
```


Терь добавим в массив `plugins`:

>`.eslintrc.js`:

```JS:
module.exports = {  
    env: {  
        browser: true,  
        es2021: true,  
        jest: true,  
    },  
    extends: [  
        'plugin:react/recommended',  
        'airbnb',  
        'plugin:i18next/recommended',  
    ],  
    parser: '@typescript-eslint/parser',  
    parserOptions: {  
        ecmaFeatures: {  
            jsx: true,  
        },  
        ecmaVersion: 'latest',  
        sourceType: 'module',  
    },  
    plugins: [  
        'react',  
        '@typescript-eslint',  
        'i18next',  
        'react-hooks',  // <----------------------------------------------------
    ],  
    rules: {  
        'react/jsx-indent': [2, 4],  
        'react/jsx-indent-props': [2, 4],  
        indent: [2, 4],  
        'react/jsx-filename-extension': [  
            2,  
            { extensions: ['.js', '.jsx', '.tsx'] },  
        ],  
        'import/no-unresolved': 'off',  
        'import/prefer-default-export': 'off',  
        'no-unused-vars': 'warn',  
        'react/require-default-props': 'off',  
        'react/react-in-jsx-scope': 'off',  
        'react/jsx-props-no-spreading': 'warn',  
        'react/function-component-definition': 'off',  
        'no-shadow': 'off',  
        'import/extensions': 'off',  
        'import/no-extraneous-dependencies': 'off',  
        'no-underscore-dangle': 'off',  
        'i18next/no-literal-string': [  
            'error',  
            {  
                markupOnly: true,  
                ignoreAttribute: ['data-testid', 'to'],  
            },  
        ],  
        'max-len': ['error', { ignoreComments: true, code: 100 }],  
    },  
    globals: {  
        __IS_DEV__: true,  
    },  
    overrides: [  
        {  
            files: ['**/src/**/*.test.{ts,tsx}'],  
            rules: {  
                'i18next/no-literal-string': 'off',  
            },  
        },  
    ],  
};
```

Ещё нужно указать два правила:

![[Pasted image 20241111142205.png]]

Они идут в массив `rules`

>`.eslintrc.js`:

```JS:
module.exports = {  
    env: {  
        browser: true,  
        es2021: true,  
        jest: true,  
    },  
    extends: [  
        'plugin:react/recommended',  
        'airbnb',  
        'plugin:i18next/recommended',  
    ],  
    parser: '@typescript-eslint/parser',  
    parserOptions: {  
        ecmaFeatures: {  
            jsx: true,  
        },  
        ecmaVersion: 'latest',  
        sourceType: 'module',  
    },  
    plugins: [  
        'react',  
        '@typescript-eslint',  
        'i18next',  
        'react-hooks',  
    ],  
    rules: {  
        'react/jsx-indent': [2, 4],  
        'react/jsx-indent-props': [2, 4],  
        indent: [2, 4],  
        'react/jsx-filename-extension': [  
            2,  
            { extensions: ['.js', '.jsx', '.tsx'] },  
        ],  
        'import/no-unresolved': 'off',  
        'import/prefer-default-export': 'off',  
        'no-unused-vars': 'warn',  
        'react/require-default-props': 'off',  
        'react/react-in-jsx-scope': 'off',  
        'react/jsx-props-no-spreading': 'warn',  
        'react/function-component-definition': 'off',  
        'no-shadow': 'off',  
        'import/extensions': 'off',  
        'import/no-extraneous-dependencies': 'off',  
        'no-underscore-dangle': 'off',  
        'i18next/no-literal-string': [  
            'error',  
            {  
                markupOnly: true,  
                ignoreAttribute: ['data-testid', 'to'],  
            },  
        ],  
        'max-len': ['error', { ignoreComments: true, code: 100 }],  
        'jsx-a11y/no-static-element-interactions': 'off',  
        'jsx-a11y/click-events-have-key-events': 'off',  
        'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks  
        'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies  
    },  
    globals: {  
        __IS_DEV__: true,  
    },  
    overrides: [  
        {  
            files: ['**/src/**/*.test.{ts,tsx}'],  
            rules: {  
                'i18next/no-literal-string': 'off',  
            },  
        },  
    ],  
};
```

В документации:

```JS:
'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
```

Ulbi рекомендует это ставить на:

```JSX:
'react-hooks/exhaustive-deps': 'error', // Checks effect dependencies
```

Вот это правило как раз и отвечает за массив зависимостей в `useEffect`, `useCallback` и `useMemo`

> `Modal.tsx`:

![[Pasted image 20241111142726.png]]

Щас у нас ESLinter начинает выёбываться, что у нас эта функция не мемоизирована


Пофиксим на:

```JSX:
const closeHandler = useCallback(() => {  
    if (onClose) {  
        setIsClosing(true);  
        timeRef.current = setTimeout(() => {  
            onClose();  
            setIsClosing(false);  
        }, ANIMATION_DELAY);  
    }  
}, [onClose]);
```

У нас щас по HTML-структуре вот так:

![[Pasted image 20241111143028.png]]

У нас модалка не должна быть никуда вложена 

## Это всё нас приводит к концепции порталов

![[Pasted image 20241111143407.png]]

![[Pasted image 20241111143741.png]]

`react portal` - это механизм, который позволяет нам любой компонент/элемент закинуть в любое место. Т.е. не в то место, куда мы его физически добавили, а реально взять и перекинуть его из одного места в другое


#### Начнём с того, что сделаем переиспользуемое решение (в будущем также для tooltip'ов, диалогов, drop-downs, etc...)

> `Portal.tsx`:

```TSX:
import { ReactNode } from 'react';  
import { createPortal } from 'react-dom';  
  
interface PortalProps {  
    children: ReactNode;  
    element?: HTMLElement;  
}  
  
export const Portal = (props: PortalProps) => {  
    const {  
        children,  
        element = document.body,  
    } = props;  
  
    return createPortal(children, element);  
};
```

Тут у нас `element` -- это КУДА мы хотим поместить наш контент -- `children`

Это мы тут:

```TSX:
element = document.body,  
```

Сделали присвоение по умолчанию, чтобы, если ничё не указано, телепортация происходила туда

> `Modal.tsx`:

```TSX:
import { classNames } from 'shared/lib/classNames/classNames';
import React, {
    ReactNode, useCallback, useEffect, useRef, useState,
} from 'react';
import cls from './Modal.module.scss';
import { Portal } from '../Portal/Portal';

interface ModalProps {
    className?: string;
    children?: ReactNode;
    isOpen?: boolean;
    onClose?: () => void;
}

const ANIMATION_DELAY = 300;

export const Modal = (props: ModalProps) => {
    const {
        className,
        children,
        isOpen,
        onClose,
    } = props;

    const [isClosing, setIsClosing] = useState(false);
    const timeRef = useRef<ReturnType<typeof setTimeout>>();

    const closeHandler = useCallback(() => {
        if (onClose) {
            setIsClosing(true);
            timeRef.current = setTimeout(() => {
                onClose();
                setIsClosing(false);
            }, ANIMATION_DELAY);
        }
    }, [onClose]);

    const onKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            closeHandler();
        }
    }, [closeHandler]);

    const onContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('keydown', onKeyDown);
        }

        return () => {
            clearTimeout(timeRef.current);
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [isOpen, onKeyDown]);

    const mods: Record<string, boolean> = {
        [cls.opened]: isOpen,
        [cls.isClosing]: isClosing,
    };

    return (
        <Portal>
            <div className={classNames(cls.Modal, mods, [className])}>
                <div className={cls.overlay} onClick={closeHandler}>
                    <div
                        className={cls.content}
                        onClick={onContentClick}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </Portal>
    );
};
```

Т.е. мы всё оберунли в `<Portal>`

Теперь модальное окно лежит рядом с `root`:

![[Pasted image 20241111145249.png]]

Т.е. в самом `root` - само приложение (все странички, navbar'ы, header'ы)


Но у нас попыли стили, отвечающие за тему, за шрифты

![[Pasted image 20241111145353.png]]

Это потому что мы делали так, что всё завязано на классе `App`, который лежит в корне приложения


Перенесём импорт глобальных стилей в `index`:

> `index.tsx`:

```TSX:
import { render } from 'react-dom';  
import { BrowserRouter } from 'react-router-dom';  
import { ThemeProvider } from 'app/providers/ThemeProvider';  
import App from './app/App';  
import 'app/styles/index.scss';  
import './shared/config/i18n/i18n';  
import { ErrorBoundary } from './app/providers/ErrorBoundary';  
  
render(  
    <BrowserRouter>  
        <ErrorBoundary>            <ThemeProvider>                <App />            </ThemeProvider>        </ErrorBoundary>    </BrowserRouter>,  
    document.getElementById('root'),  
);
```

Вот это мы взяли

```TSX:
import 'app/styles/index.scss';  
```

Из `App.tsx`

> `index.scss`:

![[Pasted image 20241111150647.png]]

Перенесём всё это из `app` в `body`

И щас уже лучше:

![[Pasted image 20241111150722.png]]

Но при переключении темы:

![[Pasted image 20241111150759.png]]

чё-то не совсем то

![[Pasted image 20241111150852.png]]

И теперь всё норм

Но для модалки при смене темы, внутри модалки тема не меняется


## Щас сделаем хуйню полную, которую потом будем исправлять


> `Modal.tsx`:

```TSX:
import { classNames } from 'shared/lib/classNames/classNames';  
import React, {  
    ReactNode, useCallback, useEffect, useRef, useState,  
} from 'react';  
import cls from './Modal.module.scss';  
import { Portal } from '../Portal/Portal';  
import { useTheme } from 'app/providers/ThemeProvider';  
  
interface ModalProps {  
    className?: string;  
    children?: ReactNode;  
    isOpen?: boolean;  
    onClose?: () => void;  
}  
  
const ANIMATION_DELAY = 300;  
  
export const Modal = (props: ModalProps) => {  
    const {  
        className,  
        children,  
        isOpen,  
        onClose,  
    } = props;  
  
    const [isClosing, setIsClosing] = useState(false);  
    const timeRef = useRef<ReturnType<typeof setTimeout>>();  
    const { theme } = useTheme();  
  
    const closeHandler = useCallback(() => {  
        if (onClose) {  
            setIsClosing(true);  
            timeRef.current = setTimeout(() => {  
                onClose();  
                setIsClosing(false);  
            }, ANIMATION_DELAY);  
        }  
    }, [onClose]);  
  
    const onKeyDown = useCallback((e: KeyboardEvent) => {  
        if (e.key === 'Escape') {  
            closeHandler();  
        }  
    }, [closeHandler]);  
  
    const onContentClick = (e: React.MouseEvent) => {  
        e.stopPropagation();  
    };  
  
    useEffect(() => {  
        if (isOpen) {  
            window.addEventListener('keydown', onKeyDown);  
        }  
  
        return () => {  
            clearTimeout(timeRef.current);  
            window.removeEventListener('keydown', onKeyDown);  
        };  
    }, [isOpen, onKeyDown]);  
  
    const mods: Record<string, boolean> = {  
        [cls.opened]: isOpen,  
        [cls.isClosing]: isClosing,  
        [cls[theme]]: true,  
    };  
  
    return (  
        <Portal>  
            <div className={classNames(cls.Modal, mods, [className])}>  
                <div className={cls.overlay} onClick={closeHandler}>  
                    <div                        className={cls.content}  
                        onClick={onContentClick}  
                    >  
                        {children}  
                    </div>  
                </div>            </div>        </Portal>    );  
};
```


> `Modal.module.scss`:

```SCSS:
.Modal {  
  position: fixed;  
  left: 0;  
  top: 0;  
  right: 0;  
  bottom: 0;  
  opacity: 0;  
  pointer-events: none;  
  z-index: -1;  
  color: var(--primary-color);  
}  
  
.Modal.dark {  
  --bg-color: #090949;  
  --primary-color: #04ff04;  
}  
  
.overlay {  
  width: 100%;  
  height: 100%;  
  background-color: var(--overlay-color);  
  display: flex;  
  align-items: center;  
  justify-content: center;  
}  
  
.content {  
  padding: 20px;  
  border-radius: 12px;  
  background-color: var(--bg-color);  
  
  transition: .3s transform;  
  transform: scale(.5);  
  max-width: 60%;  
}  
  
.opened {  
  pointer-events: auto;  
  opacity: 1;  
  z-index: var(--modal-z-index);  
  
  .content {  
    transform: scale(1);  
  }  
}  
  
.isClosing {  
  .content {  
    transform: scale(.2);  
  }  
}
```

Теперь удалим модалку из `App.tsx`:

>`App.tsx`:

```TSX:
import React, { Suspense, useEffect } from 'react';  
import { classNames } from 'shared/lib/classNames/classNames';  
import { useTheme } from 'app/providers/ThemeProvider';  
import { AppRouter } from 'app/providers/router';  
import { Navbar } from 'widgets/Navbar';  
import { Sidebar } from 'widgets/Sidebar';  
import { Modal } from 'shared/ui/Modal/Modal';  
  
function App() {  
    const { theme } = useTheme();  
  
    return (  
        <div className={classNames('app', {}, [theme])}>  
            <Suspense fallback="">  
                <Navbar />                <div className="content-page">  
                    <Sidebar />                    <AppRouter />                </div>            </Suspense>        </div>    );  
}  
  
export default App;
```

И добавим модалку в `Navbar`

> `Navbar.tsx`:

```TSX:
import { classNames } from 'shared/lib/classNames/classNames';  
import { useTranslation } from 'react-i18next';  
import { Modal } from 'shared/ui/Modal/Modal';  
import { Button, ButtonTheme } from 'shared/ui/Button/Button';  
import { useCallback, useState } from 'react';  
import cls from './Navbar.module.scss';  
  
interface NavbarProps {  
    className?: string;  
}  
  
export const Navbar = ({ className }: NavbarProps) => {  
    const { t } = useTranslation();  
    const [isAuthModal, setIsAuthModal] = useState(false);  
  
    const onToggleModal = useCallback(() => {  
        setIsAuthModal((prev) => !prev);  
    }, []);  
  
    return (  
        <div className={classNames(cls.Navbar, {}, [className])}>  
            <Button                theme={ButtonTheme.CLEAR_INVERTED}  
                className={cls.links}  
                onClick={onToggleModal}  
            >  
                {t('Войти')}  
            </Button>  
            <Modal isOpen={isAuthModal} onClose={onToggleModal}>  
                Eenee menee monee mo cath a nigga by his toe, if he hollers let him go  
            </Modal>  
        </div>    );  
};
```

> `Button.module.scss`:

```SCSS:
.Button {  
    cursor: pointer;  
    color: var(--primary-color);  
    padding: 6px 15px;  
}  
  
.clear,  
.clearInverted {  
    padding: 0;  
    border: none;  
    background: none;  
    outline: none;  
}  
  
.clearInverted {  
    color: var(--inverted-primary-color);  
}  
  
.outline {  
    border: 1px solid var(--primary-color);  
    color: var(--primary-color);  
    background: none;  
}  
  
.background {  
    background: var(--bg-color);  
    color: var(--primary-color);  
    border: none;  
}  
  
.backgroundInverted {  
    background: var(--inverted-bg-color);  
    color: var(--inverted-primary-color);  
    border: none;  
}  
  
.square {  
    padding: 0;  
}  
  
.square.size_m {  
    width: var(--font-line-m);  
    height: var(--font-line-m);  
}  
  
.square.size_l {  
    width: var(--font-line-l);  
    height: var(--font-line-l);  
}  
  
.square.size_xl {  
    width: var(--font-line-xl);  
    height: var(--font-line-xl);  
}  
  
.size_m {  
    font: var(--font-m);  
}  
  
.size_l {  
    font: var(--font-l);  
}  
  
.size_xl {  
    font: var(--font-xl);  
}
```

#### Напишем `story` на модалку:

> `Modal.stories.tsx`:

```TSX:
import React from 'react';  
import { ComponentStory, ComponentMeta } from '@storybook/react';  
import { Modal } from 'shared/ui/Modal/Modal';  
import { ThemeDecorator } from 'shared/config/storybook/ThemeDecorator/ThemeDecorator';  
import { Theme } from 'app/providers/ThemeProvider';  
  
export default {  
    title: 'shared/Modal',  
    component: Modal,  
    argTypes: {  
        backgroundColor: { control: 'color' },  
    },  
} as ComponentMeta<typeof Modal>;  
  
const Template: ComponentStory<typeof Modal> = (args) => <Modal {...args} />;  
  
export const Primary = Template.bind({});  
Primary.args = {  
    isOpen: true,  
    children: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean at magna ultricies, efficitur odio in, sagittis felis. Sed tempus orci ut augue luctus, non tempus neque volutpat. Nam posuere lacinia tellus, sed placerat ligula elementum ac. Cras vitae sapien ut neque fermentum porta nec in enim. Aliquam dolor purus, viverra vel bibendum quis, consequat ac risus. Phasellus rutrum urna dignissim est dictum, non sollicitudin felis accumsan. Vestibulum semper velit in nulla accumsan, ac suscipit libero blandit. Donec turpis lectus, sagittis vitae luctus vel, pellentesque id massa. Fusce sit amet pretium urna, sed interdum velit. Suspendisse semper, felis ac mattis suscipit.',  
};  
  
export const Dark = Template.bind({});  
Primary.args = {  
    isOpen: true,  
    children: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean at magna ultricies, efficitur odio in, sagittis felis. Sed tempus orci ut augue luctus, non tempus neque volutpat. Nam posuere lacinia tellus, sed placerat ligula elementum ac. Cras vitae sapien ut neque fermentum porta nec in enim. Aliquam dolor purus, viverra vel bibendum quis, consequat ac risus. Phasellus rutrum urna dignissim est dictum, non sollicitudin felis accumsan. Vestibulum semper velit in nulla accumsan, ac suscipit libero blandit. Donec turpis lectus, sagittis vitae luctus vel, pellentesque id massa. Fusce sit amet pretium urna, sed interdum velit. Suspendisse semper, felis ac mattis suscipit.',  
};  
Dark.decorators = [ThemeDecorator(Theme.DARK)];
```

`.eslintrc.js`:

```JS:
module.exports = {  
    env: {  
        browser: true,  
        es2021: true,  
        jest: true,  
    },  
    extends: [  
        'plugin:react/recommended',  
        'airbnb',  
        'plugin:i18next/recommended',  
    ],  
    parser: '@typescript-eslint/parser',  
    parserOptions: {  
        ecmaFeatures: {  
            jsx: true,  
        },  
        ecmaVersion: 'latest',  
        sourceType: 'module',  
    },  
    plugins: [  
        'react',  
        '@typescript-eslint',  
        'i18next',  
        'react-hooks',  
    ],  
    rules: {  
        'react/jsx-indent': [2, 4],  
        'react/jsx-indent-props': [2, 4],  
        indent: [2, 4],  
        'react/jsx-filename-extension': [  
            2,  
            { extensions: ['.js', '.jsx', '.tsx'] },  
        ],  
        'import/no-unresolved': 'off',  
        'import/prefer-default-export': 'off',  
        'no-unused-vars': 'warn',  
        'react/require-default-props': 'off',  
        'react/react-in-jsx-scope': 'off',  
        'react/jsx-props-no-spreading': 'warn',  
        'react/function-component-definition': 'off',  
        'no-shadow': 'off',  
        'import/extensions': 'off',  
        'import/no-extraneous-dependencies': 'off',  
        'no-underscore-dangle': 'off',  
        'i18next/no-literal-string': [  
            'error',  
            {  
                markupOnly: true,  
                ignoreAttribute: ['data-testid', 'to'],  
            },  
        ],  
        'max-len': ['error', { ignoreComments: true, code: 100 }],  
        'jsx-a11y/no-static-element-interactions': 'off',  
        'jsx-a11y/click-events-have-key-events': 'off',  
        'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks  
        'react-hooks/exhaustive-deps': 'error', // Checks effect dependencies  
    },  
    globals: {  
        __IS_DEV__: true,  
    },  
    overrides: [  
        {  
            files: ['**/src/**/*.{test,stories}.{ts,tsx}'],  
            rules: {  
                'i18next/no-literal-string': 'off',  
                'max-len': 'off',  
            },  
        },  
    ],  
};
```


> `ThemeDecorator.tsx`:

```TSX:
import { Story } from '@storybook/react';  
import { Theme, ThemeProvider } from 'app/providers/ThemeProvider';  
  
export const ThemeDecorator = (theme: Theme) => (StoryComponent: Story) => (  
    <ThemeProvider>  
        <div className={`app ${theme}`}>  
            <StoryComponent />        
        </div>   
    </ThemeProvider>);
```

> `ThemeProvider.tsx`:

```TSX:
import React, { FC, useMemo, useState } from 'react';  
import { LOCAL_STORAGE_THEME_KEY, Theme, ThemeContext } from '../lib/ThemeContext';  
  
const defaultTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as Theme || Theme.LIGHT;  
  
interface ThemeProviderProps {  
    initialTheme?: Theme;  
}  
  
const ThemeProvider: FC<ThemeProviderProps> = (props) => {  
    const {  
        initialTheme,  
        children,  
    } = props;  
  
    const [theme, setTheme] = useState<Theme>(initialTheme || defaultTheme);  
  
    const defaultProps = useMemo(() => ({  
        theme,  
        setTheme,  
    }), [theme]);  
  
    return (  
        <ThemeContext.Provider value={defaultProps}>  
            {children}  
        </ThemeContext.Provider>  
    );  
};  
  
export default ThemeProvider;
```

> `ThemeDecorator.tsx`:

```TSX:
import { Story } from '@storybook/react';  
import { Theme, ThemeProvider } from 'app/providers/ThemeProvider';  
  
export const ThemeDecorator = (theme: Theme) => (StoryComponent: Story) => (  
    <ThemeProvider initialTheme={theme}>  
        <div className={`app ${theme}`}>  
            <StoryComponent />        </div>    </ThemeProvider>);
```


#### Терь ёбнем скриншотные тесты:

```BASH:
npm run test:ui
```

После чего подтверждаем скрины:

```BASH:
npm run test:ui:ok
```


`Navbar.tsx`: ESLinter продолжает ругаться на переводы

>`Navbar.tsx`:

Обернём, чтобы не выёбывался:

```TSX:
import { classNames } from 'shared/lib/classNames/classNames';  
import { useTranslation } from 'react-i18next';  
import { Modal } from 'shared/ui/Modal/Modal';  
import { Button, ButtonTheme } from 'shared/ui/Button/Button';  
import { useCallback, useState } from 'react';  
import cls from './Navbar.module.scss';  
  
interface NavbarProps {  
    className?: string;  
}  
  
export const Navbar = ({ className }: NavbarProps) => {  
    const { t } = useTranslation();  
    const [isAuthModal, setIsAuthModal] = useState(false);  
  
    const onToggleModal = useCallback(() => {  
        setIsAuthModal((prev) => !prev);  
    }, []);  
  
    return (  
        <div className={classNames(cls.Navbar, {}, [className])}>  
            <Button                theme={ButtonTheme.CLEAR_INVERTED}  
                className={cls.links}  
                onClick={onToggleModal}  
            >  
                {t('Войти')}  
            </Button>  
            <Modal isOpen={isAuthModal} onClose={onToggleModal}>  
                {/* eslint-disable-next-line */}  
                {t('Eenee menee monee mo cath a nigga by his toe, if he hollers let him go')}  
            </Modal>  
        </div>    );  
};
```

