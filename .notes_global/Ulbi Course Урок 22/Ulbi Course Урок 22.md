
Рассмотрим следующее:

В `useEffect` у нас прилетает какая-то ошибка

![[Pasted image 20241028162734.png]]

и мы её никак не отработали, в `try/catch` не обернули. Т.е. просто пропустили

Вот у нас ошибка вылетела:

![[Pasted image 20241028162817.png]]

И приложение наебнулось полностью


#### Для подобного рода ошибок у React есть механизм, который называется `ErrorBoundary`

В нашем случае - это будет Provider, который глобально будет оборачивать всё приложение. Поэтому и создаём его в папке `providers`


```URL:
https://legacy.reactjs.org/docs/error-boundaries.html
```

говорит:

![[Pasted image 20241028165357.png]]

Вот верхнюю пачку кода копируем

Далее вот так:

![[Pasted image 20241028165517.png]]


Нам ещё типы нужно проставить:

![[Pasted image 20241028165640.png]]

Вот эту строчку:

![[Pasted image 20241028165730.png]]

Заменяем на простой `clg` вместо `logErrorToMyService`

Ещё добавим интерфейсы:

![[Pasted image 20241028165853.png]]

Ещё вот так укажем тип пропсов:

![[Pasted image 20241028165940.png]]

И в `render()` дестркутуризируем и достанем нужные поля:


![[Pasted image 20241028170958.png]]

Раньше мы писали с хуком `useTranslate`в функциональных компонентах. В классовых такое не прокатит . Есть такой HOC - обёртка, которая называется `withTranslation`

![[Pasted image 20241028171213.png]]

Аргументом сама функция принимает все те же аргументы, которые принимает хук `useTranslation`, а сам error boundary передаём в `HOC` вот так:

![[Pasted image 20241028171316.png]]


Но мы так делать не будем

![[artworks-VWr8i69n68tKATlz-mJDF9Q-t500x500.jpg]]

Интернационализации в классовом компоненте не будет, `ErrorBoundary` принял Ислам

В нашем случае в качестве возвращаемого значения мы сделаем отдельный компонент, но пока оставим так:

![[Pasted image 20241028171720.png]]


В целом, при попытке осуществить the American Dream, пока что вот так:

![[Pasted image 20241029150827.png]]

По итогу:

> `ErrorBoundary.tsx`:

```TSX:
import React, { ReactNode } from 'react';  
import {withTranslation} from "react-i18next";  
  
interface ErrorBoundaryProps {  
    children: ReactNode;  
}  
  
interface ErrorBoundaryState {  
    hasError: boolean;  
}  
  
class ErrorBoundary  
    extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {  
    constructor(props: ErrorBoundaryProps) {  
        super(props);  
        this.state = { hasError: false };  
    }  
  
    static getDerivedStateFromError(error: Error) {  
        return { hasError: true };  
    }  
  
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {  
        console.log(error, errorInfo);  
    }  
  
    render() {  
        const { hasError } = this.state;  
        const { children } = this.props;  
        if (hasError) {  
            return <h1>Something went wrong</h1>;  
        }  
  
        return children;  
    }  
}  
  
// export default withTranslation()(ErrorBoundary);  
export default ErrorBoundary;
```

Теперь импортируем всё это в PublicAPI


![[Pasted image 20241028172018.png]]

> `index.ts`:

```TS:
import ErrorBoundary from './ui/ErrorBoundary';  
  
export {  
    ErrorBoundary,  
};
```

Теперь корневой компонент `index.tsx` обвернём в `errorBoundary`:

![[Pasted image 20241028172057.png]]

> `index.tsx`:

```TSX:
import { render } from 'react-dom';  
import { BrowserRouter } from 'react-router-dom';  
import { ThemeProvider } from 'app/providers/ThemeProvider';  
import ErrorBoundary from 'app/providers/ErrorBoundary/ui/ErrorBoundary';  
import App from './app/App';  
  
import './shared/config/i18n/i18n';  
  
render(  
    <BrowserRouter>  
        <ErrorBoundary>            
	        <ThemeProvider>                
		        <App />            
	        </ThemeProvider>        
        </ErrorBoundary>    
    </BrowserRouter>,  
    document.getElementById('root'),  
);
```

Теперь, если чё, у нас выбрасывает ошибку вот так:

![[Pasted image 20241028172118.png]]

Приложение теперь не тупо падает, а мы показываем какой-то запасной интерфейс

#### Теперь для этого запасного интерфейса создадим отдельный компонент

![[Pasted image 20241028172234.png]]


![[Pasted image 20241028172327.png]]


Создадим функцию с кнопкой, с помощью которой будем перезагружать страницу:

![[Pasted image 20241028172603.png]]

По итогу имеем:

> `ErrorPage.tsx`:

```TSX:
import { classNames } from 'shared/lib/classNames/classNames';  
import { useTranslation } from 'react-i18next';  
import cls from './ErrorPage.module.scss';  
  
interface ErrorPageProps {  
    className?: string;  
}  
  
export const ErrorPage = ({ className }: ErrorPageProps) => {  
    const { t } = useTranslation();  
  
    const reloadPage = () => {  
        location.reload();  
    };  
  
    return (  
        <div className={classNames(cls.ErrorPage, {}, [className])}>  
            <p>{t("Hol' on, wait a minute, some' ain't right!")}</p>  
            <Button onClick={reloadPage}>  
                {t('Обновить страницу')}  
            </Button>  
        </div>    );  
};
```

Теперь остаётся компонент вернуть из `errorBoundary`:

![[Pasted image 20241028173554.png]]



Короче, да, у нас error boundary идёт отдельно. Поэтому оборачиваем его также в `<Suspense>`

![[Pasted image 20241029115655.png]]

В качестве `fallback` будем ставить просто пустую строчку


Ещё у нас тут будет ругаться на:

![[Pasted image 20241029120408.png]]

на `location`. Типо, что это глобальная переменная. Чтобы так не было, можно написать коммент выше

Если мы где-то хотим осознанно обойти какое-то правило, то можем писать комменты, как это мы делали тут:

![[Pasted image 20241029120637.png]]

> `ErrorPage.tsx`:

```TSX:
import { classNames } from 'shared/lib/classNames/classNames';  
import { useTranslation } from 'react-i18next';  
import { Button } from 'shared/ui/Button/Button';  
import cls from './ErrorPage.module.scss';  
  
interface ErrorPageProps {  
    className?: string;  
}  
  
export const ErrorPage = ({ className }: ErrorPageProps) => {  
    const { t } = useTranslation();  
  
    const reloadPage = () => {  
        // eslint-disable-next-line no-restricted-globals  
        location.reload();  
    };  
  
    return (  
        <div className={classNames(cls.ErrorPage, {}, [className])}>  
            <p>{t("Hol' on, wait a minute, some' ain't right!")}</p>  
            <Button onClick={reloadPage}>  
                {t('Обновить страницу')}  
            </Button>  
        </div>    );  
};
```

Щас будем это дело стилизовать:

![[Pasted image 20241029121622.png]]

Т.е выравниваем по горизонтали и вертикали

> `ErrorBoundary.tsx`:

```TSX:
import React, {ReactNode, Suspense} from 'react';  
import {withTranslation} from "react-i18next";  
import {ErrorPage} from "widgets/ErrorPage/ui/ErrorPage";  
  
interface ErrorBoundaryProps {  
    children: ReactNode;  
}  
  
interface ErrorBoundaryState {  
    hasError: boolean;  
}  
  
class ErrorBoundary  
    extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {  
    constructor(props: ErrorBoundaryProps) {  
        super(props);  
        this.state = { hasError: false };  
    }  
  
    static getDerivedStateFromError(error: Error) {  
        return { hasError: true };  
    }  
  
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {  
        console.log(error, errorInfo);  
    }  
  
    render() {  
        const { hasError } = this.state;  
        const { children } = this.props;  
        if (hasError) {  
            return (  
                <Suspense fallback="">  
                    <ErrorPage />                </Suspense>            );  
        }  
  
        return children;  
    }  
}  
  
// export default withTranslation()(ErrorBoundary);  
export default ErrorBoundary;
```

Вернёмся в `App.tsx` и уберём `useEffect`, который пробрасывает ошибку:


![[Pasted image 20241029121910.png]]


Теперь сделаем баг-кнопку для тестирования

> `BugButtom.tsx`:

![[Pasted image 20241029122222.png]]

Щас `i18` будет выёбываться, что мы не добавили перевод. Посылаем нахуй, т.к. компонент тестовый и нам поебать, мы удалим

> `BugButton.tsx`:

```TSX:
import { classNames } from 'shared/lib/classNames/classNames';  
import { Button } from 'shared/ui/Button/Button';  
import { useEffect, useState } from 'react';  
  
interface BugButtonProps {  
    className?: string;  
}  
  
export const BugButton = ({ className }: BugButtonProps) => {  
    const [error, setError] = useState(false);  
  
    const onThrow = () => setError(true);  
  
    useEffect(() => {  
        throw new Error();  
    }, [error]);  
  
    return (  
        <Button onClick={onThrow}>  
            throw some hands  
        </Button>  
    );  
};
```


Добавим теперь в publicAPI:

![[Pasted image 20241029122350.png]]


Щас при сборке всё наебнётся, потому что мы забыли удалить тут стили:

![[Pasted image 20241029122532.png]]

Стилей у нас тут тоже нет:

![[Pasted image 20241029122647.png]]

Теперь эту кнопку нужно куда-то добавить, добавим в `mainPage`

![[Pasted image 20241029122938.png]]


Щас всё наебнётся, потому что в `MainPage` вот так:

![[Pasted image 20241029123042.png]]


Пофиксим на:

![[Pasted image 20241029123117.png]]

Теперь `BugButton.tsx`:

Добавим-таки интернализацию:

![[Pasted image 20241029123824.png]]


![[Pasted image 20241029123914.png]]


Сам компонент `BugButton.tsx` у нас без пропсов, потому интерфейс щас удалим

> `MainPage.tsx`:

```TSX:
import { Button } from 'shared/ui/Button/Button';  
import { useEffect, useState } from 'react';  
import { useTranslation } from 'react-i18next';  
  
// Чисто компонент для тестирования  
export const BugButton = () => {  
    const [error, setError] = useState(false);  
    const { t } = useTranslation();  
  
    const onThrow = () => setError(true);  
  
    useEffect(() => {  
        if (error) {  
            throw new Error();  
        }  
    }, [error]);  
  
    return (  
        // eslint-disable-next-line i18next/no-literal-string  
        <Button onClick={onThrow}>  
            {t('throw some hands')}  
        </Button>  
    );  
};
```

