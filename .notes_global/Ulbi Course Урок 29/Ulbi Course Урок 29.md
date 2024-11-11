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


11:23
