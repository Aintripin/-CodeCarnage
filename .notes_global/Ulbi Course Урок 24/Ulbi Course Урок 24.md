
При абсолютном ипорте не работают тесты. Поэтому добавим в:

> `jest.config.ts`:

![[Pasted image 20241029225053.png]]

Это вязато с stackoverflow. В нашем случае, путь до модулей — это папка `./src`

Поэтому вот так:

![[Pasted image 20241029225150.png]]


Перейдём на сайт с [документацией](https://github.com/testing-library/jest-dom)

```BASH:
npm i -D @testing-library/react@12.1.3
```

Напишем тест для кнопки:

![[Pasted image 20241029225556.png]]

Далее при попытке написать что-то по типу:

![[Pasted image 20241029225737.png]]

У нас не будет метода `toBeInTheDocument`. Для этого нам нужен JEST

Поэтому поставим это:

```BASH:
npm i -D @testing-library/jest-dom@5.16.2
```

Далее создадим `setupTests.ts`:

![[Pasted image 20241029230033.png]]

Потом в самом конфиге нужно, согласно документации, добавить:

![[Pasted image 20241029230159.png]]



![[Pasted image 20241029230432.png]]


В нашем случае ещё поменяем название:

![[Pasted image 20241029230515.png]]

Щас нам нужно сделать так, чтобы та конфигурация, которую мы написали, работал с TS. Сделаем это вот так:

![[Pasted image 20241029230628.png]]

> `tsconfig.json`:

![[Pasted image 20241029230716.png]]


> `Button.test.tsx`:

![[Pasted image 20241029230857.png]]

Теперь можно видеть, что эта функция подхватывается

И щас запустим вот так тесты:

![[Pasted image 20241029231102.png]]

Щас эта блядота упадёт:

![[Pasted image 20241029231211.png]]

Это ебаный JEST. Если перейдём по ссылке:

![[Pasted image 20241029231325.png]]

Нам говорят установить preset для TS

```BASH:
npm i -D @babel/preset-typescript@7.16.7
```

Но, если мы откроем конфигурацию,

![[Pasted image 20241029231453.png]]

То, как оказалось, этот preset мы уже устанаваливали

Если в поиске написать

#### `JEST REACT BABEL`

то по одной из ссылок получим:

![[Pasted image 20241029231621.png]]

Это то, что мы не поставили и нужно поставить:

```BASH:
npm i -D @babel/preset-react@7.16.7
```

Там далее, пролистав ниже, увидим, что его нужно добавить в список preset'ов в config:

> `babel.config.json`:

![[Pasted image 20241029231811.png]]

Терь попробуем запустить тест:

```BASH:
npm run unit Button.test.tsx
```

![[Pasted image 20241029231930.png]]

Терь мы можем видеть, что JS не воспринимает файл со стилями

Если в поиске написать

#### `JEST CSS MODULES`

Нам нужно вот это:

![[Pasted image 20241029232049.png]]

```BASH:
npm i -D identity-obj-proxy@3.0.0
```

Теперь перейдём в:

> `jest.config.ts`:

![[Pasted image 20241029232237.png]]

`?` тут добавили, чтобы, в случае чего, `CSS`-файлы у нас обрабатывались тоже

Попробуем запустить тесты ещё раз:

```BASH:
npm run unit Button.test.tsx
```


![[Pasted image 20241029232432.png]]

На инете вот такое решение есть:

![[Pasted image 20241029232535.png]]

> `babel.config.json`:

![[Pasted image 20241029232717.png]]

> `setupTests.ts`:

```TSX:
import "@testing-library/jest-dom";
```

Попробуем запустить тесты ещё раз:

```BASH:
npm run unit Button.test.tsx
```

Терь у нас всё прошло

![[Pasted image 20241029233210.png]]

Напишем ещё один тест, где у нас будет проверяться, что на кнопке есть тот класс, который мы ей передаём

![[Pasted image 20241029233336.png]]

Забыли поменять названия, по итогу 

> `Button.test.tsx`:

![[Pasted image 20241030103034.png]]

> `Button.test.tsx`:

```TSX:
import { render, screen } from '@testing-library/react';  
import { Button, ThemeButton } from 'shared/ui/Button/Button';  
  
describe('classnames', () => {  
    test('Test render', () => {  
        render(<Button>TEST</Button>);  
        expect(screen.getByText('TEST')).toBeInTheDocument();  
    });  
  
    test('with only first param', () => {  
        render(<Button theme={ThemeButton.CLEAR}>TEST</Button>);  
        expect(screen.getByText('TEST')).toHaveClass('clear');  
        screen.debug();  
    });  
});
```

```BASH:
npm run unit Button.test.ts
```

![[Pasted image 20241030151341.png]]

Щас напишем тест на что-то белее сложное, это будет для `Sidebar`

Для начала

> `Sidebar.test.tsx`:

![[Pasted image 20241030103132.png]]

Щас упадёт всё нахуй:

![[Pasted image 20241030103157.png]]

Дело в том, что в этом компоненте бы используем `SVG`'s

Импорты для `SCSS` мы настроили, но не настроили их для файлов

Для этого придётся лезть в конфигурацию JEST'а


![[Pasted image 20241030103338.png]]

Т.е. мы щас будем создавать тот самый `jestEmptyComponent.tsx` - это mock, который будет использоваться для всех импортов, в которых присутствует `SVG`

> `jestEmptyComponent.tsx`:

![[Pasted image 20241030104342.png]]

Терь запустим тест для sidebar'а:

```BASH:
npm run unit Sidebar.tsx
```

У нас тест падает:

![[Pasted image 20241030104523.png]]

Щас у нас вот так:

![[Pasted image 20241030104552.png]]

Мы исправим `expect`, потому что он сейчас не несёт ничего на:

![[Pasted image 20241030104631.png]]

> `Sidebar.tsx`:

![[Pasted image 20241030104720.png]]

Щас всё падает


Если в поиске написать

#### `JEST ReferenceError: regeneratorRuntime is not defined`

То получим:

![[Pasted image 20241030105031.png]]

>`setupTests.ts`:

![[Pasted image 20241030105223.png]]

Теперь поставим зависимость через:

```BASH:
npm i -D regenerator-runtime@0.13.9
```

Теперь попробуем запустить тест ещё раз:

```BASH:
npm run unit Sidebar.tsx
```


У меня, после двух дней ебли с проектом и битьём головой об стену, наконец-то стало всё работать. 

# ДЕЛО БЫЛО В ЕБАНОЙ ТОЧКЕ!!!!!!!!!!!

![[Pasted image 20241031144025.png]]

Е-БА-НУТЬ-СЯ, БЛЯДЬ

Тест проходит успешно, он зелёный, но у нас ругается на использование `useTranslation`:

![[Pasted image 20241030105718.png]]


Если в поиске написать

#### `i18next testing`

В документации есть вот такой HOC:

![[Pasted image 20241030110145.png]]

>`Sidebar.test.tsx`:

![[Pasted image 20241030110242.png]]

```TSX:
import { render, screen } from '@testing-library/react';  
import { Sidebar } from 'widgets/Sidebar/ui/Sidebar/Sidebar';  
import { withTranslation } from 'react-i18next';  
  
describe('Sidebar', () => {  
    test('Test render', () => {  
        const SidebarWithTranslation = withTranslation()(Sidebar);  
        render(<SidebarWithTranslation />);  
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();  
    });  
});
```

Терь тесты проходят всё также успешно, но мы получаем другой warning:

![[Pasted image 20241030110320.png]]

Мы не ипортировали `i18n`

Мы ипортировали конфигурацию в файл `index.tsx`, а здесь мы рендерим изолированный компонент

В документации есть вот такой раздел:

![[Pasted image 20241030110457.png]]

Он нам и нужен

Тут нам предлагается сделать тестовый конфиг именно для тестовой среды

В `shared` слое у нас есть папка `config`, там есть `i18n` папка, там создаём и вставляем от и до из документации:

> `i18nForTests.ts`:


![[Pasted image 20241030111018.png]]

`i18nForTests.ts`:

```TSX:
import i18n from 'i18next';  
import { initReactI18next } from 'react-i18next';  
  
i18n  
    .use(initReactI18next)  
    .init({  
        lng: 'ru',  
        fallbackLng: 'ru',  
  
        debug: false,  
        interpolation: {  
            escapeValue: false, // not needed for react!!  
        },  
  
        resources: { ru: { translations: {} } },  
    });  
  
export default i18n;
```

Чтобы не делать импорт этого файла абсолютно в каждый тест, сделаем helper

![[Pasted image 20241030111141.png]]


> `renderWithTranslation.tsx`:

![[Pasted image 20241030111305.png]]

Т.е. всё, что эта функция делает - это оборачивает тестируемый компонент, который эта функция принимает аргументом


ESLint ругался на длину строки, поэтому сделали вот так:

![[Pasted image 20241030111443.png]]

`Sidebar.test.tsx`:

```TSX:
import { render, screen } from '@testing-library/react';  
import { Sidebar } from 'widgets/Sidebar/ui/Sidebar/Sidebar';  
import {  
    renderWithTranslation,  
} from 'shared/lib/tests/renderWithTranslation/renderWIthTranslation';  
  
describe('Sidebar', () => {  
    test('Test render', () => {  
        renderWithTranslation(<Sidebar />);  
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();  
    });  
});
```

Теперь напишем тест на сворачивание и разворачивание sidebar'а. Повесим для этого на кнопку, с помощью которой мы разворачиваем и сворачиваем sidebar `data-testid`: 

> `SideBar.tsx`:

![[Pasted image 20241030111641.png]]

У нас ругается сейчас плагин, который мы добавляли, на то, что перевода для `sidebar-toggle` нет

```TSX:
import { classNames } from 'shared/lib/classNames/classNames';  
import { useState } from 'react';  
import { ThemeSwitcher } from 'shared/ui/ThemeSwitcher';  
import { LangSwitcher } from 'shared/ui/LangSwitcher/LangSwitcher';  
import { Button } from 'shared/ui/Button/Button';  
import cls from './Sidebar.module.scss';  
  
interface SidebarProps {  
    className?: string;  
}  
  
export const Sidebar = ({ className }: SidebarProps) => {  
    const [collapsed, setCollapsed] = useState(false);  
  
    const onToggle = () => {  
        setCollapsed((prev) => !prev);  
    };  
  
    return (  
        <div  
            data-testid="sidebar"  
            className={classNames(cls.Sidebar, { [cls.collapsed]: collapsed }, [className])}  
        >  
            <Button                data-testid="sidebar-toggle"  
                onClick={onToggle}  
            >  
                toggle  
            </Button>  
            <div className={cls.switchers}>  
                <ThemeSwitcher />                <LangSwitcher className={cls.lang} />  
            </div>        </div>    );  
};
```

И теперь в тестах для этой кнопки, будем получать её с помощью тестового ID'шника:

![[Pasted image 20241030112017.png]]

Потому на эту кнопку нам нужно нажать, поэтому будем для этого использовать `fireEvent`

Мы ожидаем, что после нажатия, на кнопку навесится класс `collapsed`, который мы и хотим получить:

![[Pasted image 20241030112135.png]]

Щас, если попытаемся закоммитить, начнёт ругаться на переводы. Помимо тех, которые отсутствуют, на `data-testid`

Если в поиске написать

#### `i18next eslint`

то получим документацию на github, в которой написано про такое свойство, как `ignoreAttribute`

![[Pasted image 20241030112534.png]]

Т.е. для каких аттрибутов не требуется перевод. В нашем случае это `data-testid`

Откроем конфиг ESLint'а:

> `.eslint.js`:


![[Pasted image 20241030112722.png]]

Теперь также добавим в конфиг свойство `overrides`, которое позволяет для определённых файлов переопределит какие-то правила. В качестве значения укзаываем регулярку, которая будет искать тестовые файлы с расширением `ts` или `tsx`. В таких файлах нам переводы не нужны, поэтому их отключим:

> `.eslint.js`:

![[Pasted image 20241030113140.png]]


Теперь в тестовых файлах по типу `Button.test.tsx` проблемы с переводами больше нет


