
Щас, если мы введём в строку что-то по типу:

```URL:
http://localhost:3000/about
```

То получим:

![[Pasted image 20241028103801.png]]

Но если мы введём какую-то несуществующую страницу по типу:


```BASH:
http://localhost:3000/IHATENIGGERZ
```


То у нас будет пустая страница:

![[Pasted image 20241028110409.png]]

Это как-то надоо отрабатывать - показывать сообщение пользователю, что-то по типу того, что эта страница не найдена

В `/pages` создадим папку `NotFoundPage`, внутри папку `ui`:

![[Pasted image 20241028110524.png]]

Там же внутри воспользуемся хуком `useTranslation`

![[Pasted image 20241028110618.png]]

```TSX:
import { classNames } from 'shared/lib/classNames/classNames';  
import { useTranslation } from 'react-i18next';  
import cls from './NotFoundPage.module.scss';  
  
interface NotFoundPageProps {  
    className?: string;  
}  
  
export const NotFoundPage = ({ className }: NotFoundPageProps) => {  
    const { t } = useTranslation();  
  
    return (  
        <div className={classNames(cls.NotFoundPage, {}, [className])}>  
            {t('Страница не найдена')}  
        </div>  
    );  
};
```

![[Pasted image 20241028110652.png]]


Рядом с `.tsx`-файлом создаём файлик для стилей

![[Pasted image 20241028111304.png]]



Со стилями закончили, осталось добавить этот компонент в publicAPI. Создаём `index.ts` файл:

![[Pasted image 20241028110933.png]]

Делать страницу асинхронной смысла нет, т.к. в ней нет никакой бизнес-логики, она маленькая и т.д.

`shift` + `shift`, находим `routeConfig.tsx`, добавим новый маршрут:

![[Pasted image 20241028111030.png]]

Потом TS начнёт триповать, говорить, что не хватает поля. Добавим:

![[Pasted image 20241028111102.png]]

И тут тоже:

![[Pasted image 20241028111149.png]]

Сам компонент также импортируем, как и другие, из верхнего уровня



#### Сейчас у нас при подрузке любого чанка, у нас убогий loader

Создадим в `shared` слое новый компонент:

![[Pasted image 20241028111433.png]]


![[Pasted image 20241028111530.png]]



```URL:
https://loading.io/css/
```

> `PageLoader.module.scss`:

```CSS:

.lds-ellipsis,
.lds-ellipsis div {
  box-sizing: border-box;
}
.lds-ellipsis {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ellipsis div {
  position: absolute;
  top: 33.33333px;
  width: 13.33333px;
  height: 13.33333px;
  border-radius: 50%;
  background: currentColor;
  animation-timing-function: cubic-bezier(0, 1, 1, 0);
}
.lds-ellipsis div:nth-child(1) {
  left: 8px;
  animation: lds-ellipsis1 0.6s infinite;
}
.lds-ellipsis div:nth-child(2) {
  left: 8px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(3) {
  left: 32px;
  animation: lds-ellipsis2 0.6s infinite;
}
.lds-ellipsis div:nth-child(4) {
  left: 56px;
  animation: lds-ellipsis3 0.6s infinite;
}
@keyframes lds-ellipsis1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes lds-ellipsis3 {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
@keyframes lds-ellipsis2 {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
}


```

> `PageLoader.tsx`:

![[Pasted image 20241028113525.png]]

Теперь поменяем `<Suspense>` вот тут:

![[Pasted image 20241028113650.png]]

У нас вот тут лишняя обёртка:

![[Pasted image 20241028113805.png]]

Её удалить



Щас проблема в том, что при светлой теме, индикатора загрузки почти не видно. Поменяем на:

![[Pasted image 20241028114422.png]]

Щас у нас loader за'hardcode'жен внутри компонента `PageLoader`. Мы бы захотели бы его использовать ещё где угодно. Вынесем в отдельный компонент:

![[Pasted image 20241028114656.png]]

Всё из `Pageloader.module.scss` вырезаем (кроме первого блока) и вставляем в в `loader.scss`

Вот эту часть разметки:

![[Pasted image 20241028114830.png]]

Переносим тоже 

> `Loader.tsx`:

```TSX:
import { classNames } from 'shared/lib/classNames/classNames';  
import cls from './Loader.module.scss';  
  
interface LoaderProps {  
    className?: string;  
}  
  
export const Loader = ({ className }: LoaderProps) => (  
    <div className={classNames(cls.lds_ellipsis, {}, [className])}>  
            <div />            <div />            <div />            <div />    </div>);
```

> `Loader.scss`:

```SCSS:
.lds_ellipsis,  
.lds_ellipsis div {  
  box-sizing: border-box;  
}  
.lds_ellipsis {  
  display: inline-block;  
  position: relative;  
  width: 80px;  
  height: 80px;  
}  
.lds_ellipsis div {  
  position: absolute;  
  top: 33.33333px;  
  width: 13.33333px;  
  height: 13.33333px;  
  border-radius: 50%;  
  //background: currentColor;  
  background: var(--inverted-bg-color);  
  animation-timing-function: cubic-bezier(0, 1, 1, 0);  
}  
.lds_ellipsis div:nth-child(1) {  
  left: 8px;  
  animation: lds_ellipsis1 0.6s infinite;  
}  
.lds_ellipsis div:nth-child(2) {  
  left: 8px;  
  animation: lds_ellipsis2 0.6s infinite;  
}  
.lds_ellipsis div:nth-child(3) {  
  left: 32px;  
  animation: lds_ellipsis2 0.6s infinite;  
}  
.lds_ellipsis div:nth-child(4) {  
  left: 56px;  
  animation: lds_ellipsis3 0.6s infinite;  
}  
@keyframes lds_ellipsis1 {  
  0% {  
    transform: scale(0);  
  }  
  100% {  
    transform: scale(1);  
  }  
}  
@keyframes lds_ellipsis3 {  
  0% {  
    transform: scale(1);  
  }  
  100% {  
    transform: scale(0);  
  }  
}  
@keyframes lds_ellipsis2 {  
  0% {  
    transform: translate(0, 0);  
  }  
  100% {  
    transform: translate(24px, 0);  
  }  
}
```


Потом в `PageLoader.tsx` делаем так:

> `PageLoader.tsx`:

```TSX:
import {classNames} from "shared/lib/classNames/classNames";  
import cls from './PageLoader.module.scss';  
import {Loader} from "shared/ui/Loader/Loader";  
  
interface PageLoaderProps {  
    className?: string;  
}  
  
export const PageLoader = ({className}: PageLoaderProps) => {  
    return (  
        <div className={classNames(cls.PageLoader, {}, [className])}>  
            <Loader />        
        </div>    
    );  
};
```


Т.е. просто переиспользуем компонент

> `PageLoader.module.scss`:

```SCSS:
.PageLoader {  
  min-height: calc(100vh - var(--navbar-height));  
  display: flex;  
  justify-content: center;  
  align-items: center;  
  flex-grow: 1  
}
```

