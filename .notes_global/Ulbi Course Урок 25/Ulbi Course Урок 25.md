После прогона linter'а для TS:

```BASH:
npm run lint:ts
```


![[8d086051017a1293b1ce5dddd13cd32d.gif]]

![[Pasted image 20241102145844.png]]

В общем, пробовал вот это всё:

```BASH:
npm uninstall eslint-plugin-storybook
npm install -D eslint-plugin-storybook
```

```BASH:
rm -rf node_modules
npm cache clean --force
npm install
```

```BASH:
npm uninstall eslint-plugin-storybook
```

```BASH:
npm install -D eslint-plugin-storybook@latest
```

```BASH:
npm uninstall eslint-plugin-storybook storybook @storybook/react @storybook/react-webpack5 @storybook/addon-essentials @storybook/addon-interactions @storybook/addon-onboarding @storybook/blocks @storybook/test
```

```BASH:
npm cache clean --force
```

```BASH:
npx storybook@latest init
npm install -D eslint-plugin-storybook@latest
```

- + менял конфиг `.eslintrc.js`

Из этого всего помогло ровно ничего



можем обнаружить, что на пропс `to`:

> `Navbar.tsx`:

![[Pasted image 20241101100929.png]]
Оно ругается - не хватает переводов
# И щас он начинает объяснять проблему, с решением которой я ебался хер знает сколько времени:

> `tsconfig.json`:

![[Pasted image 20241101101251.png]]

Тут мы добавляли поле `include` для файла `setupTests.ts`:

![[Pasted image 20241101101529.png]]


Если это поле не указывается в `tsconfig.json`, т.е. вот так, как я понял:

![[Pasted image 20241101101719.png]]

То включаются по умолчанию все TS файлы. 

Но, раз мы его определяем distinctly, то указываем сейчас путь ко всем файлам, которые находятся в папке `src`, чтобы типы подхватывались правильно:

![[Pasted image 20241101102000.png]]

Можно было файлы `ts` и `tsx` объединить в одну регулярку, можно в разные строчки - не так важно.

Эта проблема ушла (с импортами):

> `Navbar.tsx`:

![[Pasted image 20241101102051.png]]

#### Теперь вернёмся на проблему с пропсами, конкретно `to`

![[Pasted image 20241101100929.png]]

> `Navbar.tsx`:

```TSX:
import { classNames } from 'shared/lib/classNames/classNames';  
import { AppLink, AppLinkTheme } from 'shared/ui/AppLink/AppLink';  
import { useTranslation } from 'react-i18next';  
import cls from './Navbar.module.scss';  
  
interface NavbarProps {  
    className?: string;  
}  
  
export const Navbar = ({ className }: NavbarProps) => {  
    const { t } = useTranslation();  
  
    return (  
        <div className={classNames(cls.Navbar, {}, [className])}>  
            <div className={cls.links}>  
                <AppLink theme={AppLinkTheme.SECONDARY} to="/" className={cls.mainLink}>  
                    {t('Главная')}  
                </AppLink>  
                <AppLink theme={AppLinkTheme.RED} to="/about">  
                    {t('О сайте')}  
                </AppLink>  
            </div>        </div>    );  
};
```

Это фиксится в `.eslintrc.js`:

![[Pasted image 20241101102311.png]]

> `.eslintrc.js`:

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

И, если мы запустим linter ещё раз:

```BASH:
npm run lint:ts
```

То увидим ошибку, связанную с кнопкой

![[Pasted image 20241101102523.png]]

Это та самая кнопка, которая разворачивает/сворачивает sidebar

## Настраиваем storybook

### В [документации](https://storybook.js.org/blog/storybook-for-webpack-5/) написано:

![[Pasted image 20241101103823.png]]

```BASH:
npx sb init --builder webpack5
```

В `build_08` появляются вот эти два файла:

![[Pasted image 20241101104242.png]]

Также в `package.json` появились вот эти два скрипта:

![[Pasted image 20241101104451.png]]


### На:

```URL:
http://localhost:6006/?path=/story/example-button--primary&onboarding=false
```

открывается `storybook`, который представляет из себя витрину компонентов:

![[Pasted image 20241101104944.png]]

Также, в папке `./src` создалась папка `./stories`:

![[Pasted image 20241101105222.png]]


Папку `./.storybook` перенесём в папку `congig`, чтобы не захламлять проект

И ещё поменяем имя папки, убрав точку. Будет вот так:

![[Pasted image 20241101105653.png]]

#### Нам нужно указать путь до конфига. Если найти в интернете

```TEXT:
storybook path to config
```

![[Pasted image 20241101105923.png]]

Т.е. нудно добавить флаг `-c` и далее идёт путь до конфига

Этот флаг и добавляем в `package.json`:

> `package.json`:

![[Pasted image 20241101111619.png]]

```BASH:
npm run storybook
```

Щас у нас упадёт с ошибкой. Если мы посмотрим, увидим, что проблема с путями:

![[Pasted image 20241101111715.png]]

Это связано с тем, что мы перенесли наш конфиг из одной папки в другую, а пути в самом конфиге не поправили

Если посмотрим в `main.ts`, то увидим, что у нас неправильный путь до папки с исходным кодом: 
![[Pasted image 20241101112007.png]]

Поправим это:

![[Pasted image 20241101111923.png]]

Нужно было выйти на один уровень выше. Первую регулярку, которая тут была, мы можем убрать, потому что расширения у нас будут либо `.ts`, либо `.tsx`

Запустим скрипт ещё раз:

```BASH:
npm run storybook
```


### Напишем первую Story

в этот раз уже для своего компонента по аналогии с теми Stories, которые нам сделал storybook при инициализации

Откроем папку `/Button` и создадим файлик с расширением `.stories.tsx`:

![[Pasted image 20241101123250.png]]

`.stories` в расширении обязательно, т.к. это задано конфигом в `main.ts`:

![[Pasted image 20241101123336.png]]


Затем откроем пример, который нам автоматически сгенерировал storybook:

![[Pasted image 20241101123443.png]]

Потом скопируем и перенесём его в нашу кнопку

Терь эту папку с примерами можно удалить:

![[Pasted image 20241101123653.png]]

По сути, большинство stories - это просто copy/paste'а и переписывание пропсов, которые мы хотим передать в компоненты 


Откроем `Button.stories.tsx`:

Поудаляем комментарии, чтобы кода было поменьше.

Потом заменим название сториса:

![[Pasted image 20241101123959.png]]

>`Button.stories.tsx`:

```TSX:
import type { Meta, StoryObj } from '@storybook/react';  
import { fn } from '@storybook/test';  
  
import { Button } from './Button';  
  
export default {  
    title: 'shared/Button',  
    component: Button,  
    argTypes: {  
        backgroundColor: { control: 'color' },  
    },  
} as ComponentMeta<typeof Button>;  
  
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;  
  
export const Primary = Template.bind({});  
  
Primary.args = {  
primary: true,  
label: 'Button',  
}
```

Попробуем:

```BASH:
npm run storybook
```

Всё нахуй наебнулось:

![[Pasted image 20241101124109.png]]

Проблема с абсолютным импортом:

![[Pasted image 20241101124150.png]]

Конфигурация storybook'а в душе не ебёт, что у нас абсолютные импорты 

Если написать:

# ```Storybook absolute path```

У Storybook есть своя дефолтная конфигурация, `storybook extends webpack`

Один из способов для переопределения конфига - это создание в папке `storybook` файла `webpack.config.ts`: 

![[Pasted image 20241101124632.png]]


> `webpack.config.ts`:

![[Pasted image 20241101124811.png]]

В папке `./build` есть файл `buildResolvers.ts`:

![[Pasted image 20241101151223.png]]

По идее, мы можем целиком переиспользовать всю эту функцию. Но нам достаточно переопределить поле `modules` и поле `extensions`. 

Вернёмся к **локальному** `webpack.config.ts`:

![[Pasted image 20241101151427.png]]

Итак, `config`, поле `resolve` и нас интересует свойство `modules` - это массив. В него нам нужно добавить путь до папки с исходным кодом. 
Тут мы можем воспользоваться типом, который называется `buildPaths`. Путь импорта заменим на относительный, потому что абсолютные пути работают только в папке `./src`

Воспользуемся типизацией `BuildPaths` - тут TS нам сам полсказывает, что есть 4 свойства и нужно чё-то каждому дать. Нас первые три не интересуют, а, вот, четвёртый - да. Тут укажем путь до папки `./src`. Для этого нам необходимо выйти на два уровня выше из папки `storybook` в `config`, а оттуда уже в корень проекта

![[Pasted image 20241101152022.png]]

А потом уже до корня проекта 

Т.к. у нас TS, то нужно добавить вот это:

![[Pasted image 20241101152537.png]]

По итогу:

> `webpack.config.ts`:

![[Pasted image 20241101152601.png]]

> `webpack.config.ts`:

```TSX:
import webpack from "webpack";  
import { BuildPaths } from "../build/types/config";  
import path from "path";  
  
export default ({ config }: {config: webpack.Configuration}) => {  
    const paths: BuildPaths = {  
        build: '',  
        html: '',  
        entry: '',  
        src: path.resolve(__dirname,  '..', '..' ,'src'),  
    };  
    config.resolve.modules.push(paths.src);  
    config.resolve.extensions.push('.ts', '.tsx');  
  
  
  
    return config;  
}
```

Щас попробуем ещё раз ёбнуть:

```BASH:
npm run storybook
```

![[Pasted image 20241101153903.png]]

Тут вторая проблема (такую же решали при настройки Jest'а) - это CSS-модули. По умолчанию storybook работать с этим не умеет. Приходится настраивать вручную

В поиске напишем:
### `Storybook CSS modules`

И открываем первую же ссылку. Там примеры того, как настравить CSS in JS

Тут

![[Pasted image 20241101154233.png]]

нам говорят, что для webpack конфига storybook'а добавить соответствующие loader'ы

Создадим папку `loaders` в папке `build` и внутри файл `buildCssLoader.ts`:

![[Pasted image 20241101154454.png]]

Зайдём в `buildLoaders.ts`:

![[Pasted image 20241101154605.png]]

И вот эту часть:

![[Pasted image 20241101154618.png]]

![[Pasted image 20241101155118.png]]

И вставляем в

![[Pasted image 20241101154454.png]]

И потом уже обратно в 
![[Pasted image 20241101154605.png]]

где пишем:

![[Pasted image 20241101155211.png]]


>`buildCssLoader.ts`:

Тут у нас используется `isDev` - глобальная переменная. Можно в эту функцию принять целиком весь объект с опциями, можно только переменную `isDev`

![[Pasted image 20241101155526.png]]

> `buildLoader.ts`:

Тут передадим `isDev` как аргумент

![[Pasted image 20241101155823.png]]

И ещё поправим путь на относительный:

![[Pasted image 20241101155926.png]]




`buildCssLoader` - эта функция переиспользуемая

> `webpack.config.ts` в storybook:

![[Pasted image 20241101160331.png]]

`rules` - это у нас массив, в который добавляем чё-то. 


Щас, если попробуем:

```BASH:
npm run storybook
```

То оно запустится:

![[Pasted image 20241101160552.png]]

Только кнопка рендерится странно. Посмотрим чё там по пропсам, которые мы передаём в неё

> `Button.stories.tsx`:

```TSX:
import type { Meta, StoryObj } from '@storybook/react';  
import { fn } from '@storybook/test';  
  
import { Button } from './Button';  
  
export default {  
    title: 'shared/Button',  
    component: Button,  
    argTypes: {  
        backgroundColor: { control: 'color' },  
    },  
} as ComponentMeta<typeof Button>;  
  
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;  
  
export const Primary = Template.bind({});  
  
Primary.args = {  
primary: true,  
label: 'Button',  
}
```


Тут у нас щас выскакивает вот это:

![[Pasted image 20241102234015.png]]

Типо, для работы с `scss`-файлами нам нужны loader'ы

#### На [stackoverflow](https://stackoverflow.com/questions/59761361/storybook-ui-with-css-modules-and-less):

![[Pasted image 20241102234341.png]]

```TSX:
module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader'],
            }, {
                test: /\.css$/,
                use: {
                    loader: "css-loader",
                    options: {
                        modules: true,
                    }
                }
            }
        ],
    },
}
```


Короче, из `buildLoaders.ts` берём вот этот кусок:

![[Pasted image 20241104011348.png]]

И вырезаем в `buildCssLoader.ts`. А тут заменяем на вызов этого файла самого вот так:

![[Pasted image 20241104011513.png]]


`buildCssLoader.tsx`:

![[Pasted image 20241104011549.png]]

![[Pasted image 20241104011631.png]]

Тут, типо, используется глобальная перменая `__IS_DEV__` и мы её сюда передадим в качестве аргумента функции

Чтобы её получить в `buildCssLoader.ts`, её нужно туда передать из `buildLoaders.ts`:

![[Pasted image 20241104011823.png]]

![[Pasted image 20241104011914.png]]

Вот эта функция:

![[Pasted image 20241104012007.png]]

Теперь переиспользуемая. Мы её теперь можем использовать для настройки `storybook`'а

> `webpack.config.ts`:

![[Pasted image 20241104012125.png]]

`isDev` можем указать, как `true`, потому что SB будет использоваться только на этапе разработки

Поправим ещё импорты:

![[Pasted image 20241104012250.png]]


Щас можно попробовать:

```BASH:
npm run storybook
```

Щас будет выглядеть не очень

>`Button.stpries.tsx`:

Осталась хуйня, которая мы скопировали из оригинала:

![[Pasted image 20241104012711.png]]

Уберём её:

![[Pasted image 20241104012750.png]]

У нас кнопка принимает пропс `children` для содержимого. Также переименуем названия: одна story у нас будет для кнопки обычной, а вторая с темой `clear`:

![[Pasted image 20241104013016.png]]

Т.к. вторая кнопка с темой `clear`, то передадим ещё туда и тему `theme`:

![[Pasted image 20241104013058.png]]

Чтобы storybook не был слишком пустым, добавим ещё одну кнопку с темой `OUTLINE`

> `Button.tsx`:

![[Pasted image 20241104013211.png]]

> `Button.module.scss`:

![[Pasted image 20241104013312.png]]

> `Button.stories.tsx`:

![[Pasted image 20241104013404.png]]


Щас оно будет выглядеть вот так:

![[Pasted image 20241104013441.png]]

Забыли убрать задний фон кнопки + не добавили рамку и не изменили цвет шрифта:

> `Button.module.scss`:

![[Pasted image 20241104013539.png]]

Щас выглядит вот так:

![[Pasted image 20241104013606.png]]

Т.е. рамки всё также нет

Если мы откроем код элемента:

![[Pasted image 20241104013718.png]]

То увидим, что ссылки на переменные не кликабельные (а должны быть)

Это потому что эти переменные привязаны к конкретной теме, а компонент у нас рендерится изолированно и вообще ничё не ебёт про темы. Импортируем файл со стилями:

![[Pasted image 20241104014736.png]]

Это файл, где у нас объявлены все глобальные переменные

Опять проебались на локальных стилях, вернёмся:

> `Button.module.scss`:

![[Pasted image 20241104014838.png]]


Ну и щас норм:

![[Pasted image 20241104014946.png]]

Но щас чё происходит — это для каждой story мы импортируем глобальные стили. Это могло бы быть лучше

> `Button.stories.tsx`:

Поэтому удаляем нахуй:

![[Pasted image 20241104015146.png]]

Мы можем добавлять специальные обёртки, которые будут глобально оборачивать каждый SB-компонент

![[Pasted image 20241104015329.png]]

Щас сюда вернёмся, сначала создадим папку, где будут лежать декораторы

Создадим такую в папке `config`:

![[Pasted image 20241104015439.png]]

Этот декоратр будет отвечать именно за подключение глобальных стилей

![[Pasted image 20241104015752.png]]

Сама папка `StyleDecorator` должна быть перенесена в папку `storybook`:

![[Pasted image 20241104015857.png]]


Пофиксим импорт в

> `preview.js`:

![[Pasted image 20241104015929.png]]

Щас мы должны увидеть, что цвета используются глобальные, что значит, что всё хорошо:

![[Pasted image 20241104020026.png]]


Механизм, с помощью которого мы сможем задавать темы. Для этого идёт ещё один декоратор

Вот `App.tsx`:

![[Pasted image 20241104020820.png]]

Как у нас навешивается тема: у нас есть класс `app` и дополнительно идёт название темы: `dark` или `light`. Таким образом, в зависимости от выбранной темы, у нас определяются переменные, ответственные за цвета


> `ThemeDecorator.tsx`:

![[Pasted image 20241104021015.png]]

Тут мы можем воспользоваться механизмом замыкания: из функции вернуть функцию. Причём, верхнеуровняя функция у нас в качестве агрумента принимать тему и эта верхнеуровневая функция будет возвращать декоратор, в котором указанная переданная пользователем тема

Т.е. из вне мы можем определять: отрисовать story для светлой темы или для тёмной

Он наконец-то исправил имя декоратора:

> `ThemeDecorator.tsx`:

![[Pasted image 20241104021230.png]]

Сейчас добавим этот декоратор глобально в `preview`:

`preview.js`:

![[Pasted image 20241104021401.png]]


Т.к. декоратор из себя представляет функцию, которая представляет сам декоратор, то мы можем эту функцию вызывать и передать нужную тему. Вот так:

![[Pasted image 20241104021556.png]]

(ещё путь для `Theme` поправили)



Терь у нас есть цвет фона:

![[Pasted image 20241104021635.png]]

(синий т.к. мы указали тёмную тему)


Вот это:

![[Pasted image 20241104021754.png]]

Можно добавлять не глобально

Уберём из `preview` и попробуем добавить на конкретную story

У каждой story есть такое свойство, как `decorators` — это массив, в который мы можем передать много декораторов 

> `Button.stories.tsx`:

![[Pasted image 20241104021951.png]]

Продублируем этот декоратор для каждой из stories:

![[Pasted image 20241104022035.png]]


![[Pasted image 20241104022109.png]]

Теперь в браузере:

![[Pasted image 20241104022134.png]]

Можем видеть, что у нас применилась светлая тема для трёх из четырёх изначальных элементов. А для `Outline Dark` тёмная

Главной темой, по какой-то причине, является светлая, поэтому по дефолту её добавим глобально в `preview`:

> `preview.js`:

![[Pasted image 20241104022338.png]]


А в тех местах, где понадобится тёмная тема — тма уже локально 


Теперь можем декораторы, которые использовали локально для каждой из Stories поудалять:

![[Pasted image 20241104154844.png]]

Но только те, которые с light-темой, потому что она и так идёт по дефолту. Те, что с тёмной - их оставим:


![[Pasted image 20241104154926.png]]

Можем убедиться теперь, что в этом случае она перекроет тук  светлую тему, которая подключена глобально:

![[Pasted image 20241104155017.png]]


### Напишем ещё одну story для более сложного компонента, например, для `Sidebar`:

![[Pasted image 20241104155141.png]]

скопируем заготовку из файла с кнопкой

![[Pasted image 20241104155233.png]]

Поменяем название на `widget/Sidebar`, удалим импорт кнопки и добавим импорт `Sidebar`'а + поправим путь на относительный:

![[Pasted image 20241104155439.png]]

Терь следующее, что сделаем - разберёмся с названиями stories

Название первой заменим на `Light`, также уберём пропсы:

![[Pasted image 20241104155600.png]]

Название второго story заменим на `Dark`, также уберём прпосы:

![[Pasted image 20241104155726.png]]

Теперь уберём вот это:

![[Pasted image 20241104155800.png]]

И для темы `Dark` поменяем декоратор на

![[Pasted image 20241104155826.png]]


#### Терь у нас на SB появился раздел `widgets`:

![[Pasted image 20241104155954.png]]

И там уже `Sidebar` с этими двумя темами

Но у нас возникает проблема с `.svg`:


![[Pasted image 20241104160104.png]]


Возникают те же самые проблемы, которые вохникали при настройке `jest` — это абсолютные импорты, CSS-модули, `svg`. Для последних мы используем специальные loader, SB об этом ничего не знает

в `webpack.config.ts` мы настроили уже абсолюные импорты CSS-модулей

![[Pasted image 20241104160411.png]]

Терь сделаем тоже самое с `svg`—иконками:

Мы щас с помощью функции `map` по всем `laoder`'ам пройдёмся:

Если у нас регулярка loader'а содержит в себе `svg`, 

У нас регулярка лежит в файле `buildLoaders.ts` в поле `test` вот так:

![[Pasted image 20241104160631.png]]

> `webpack.config.ts`:

![[Pasted image 20241104160703.png]]

В таком случае мы вернём новый объект и в него развернём старое правило, но добавим ещё одно поле — `exclude`, с помощью которого можно искелючить какие0то файлы по регулярному  выражению

В нашем сдучае — это loader, который был настроен на `svg`. Т.е. щас он никак не будет её обрабатывать:

![[Pasted image 20241104160920.png]]

> `webpack.config.ts`:

![[Pasted image 20241104160928.png]]

Т.е. мы находим правило, которе обрабатывает `svg`'шки и, если это правило нашли, берём и исключаем обработку `svg`'шок для этого правила

В обратном случае, если это правило никак не связано с `svg`'шками, то его просто овзвращаем:

![[Pasted image 20241104161144.png]]

Там начинает выёбываться ESLinter на чё-то, мы просто supress вот это через комментарий. По поводу типов: можно принудительн оскастовать к типу `string`


Терб остаётся наш `loader`, с помощью которого обрабтатывем `svg`'шки добавить в массив `rules`

Вот так:

![[Pasted image 20241104161556.png]]

Терь , если мы перезапустим SB, то увидим:

![[Pasted image 20241104161633.png]]


#### Далее двигаемся дальше и напишем stories для каждого компонента. Следующим идёт компонент `Navbar.tsx`

![[Pasted image 20241104161745.png]]



![[Pasted image 20241104161830.png]]


Меняем имена:

>`Navbar.stories.tsx`:

![[Pasted image 20241104161910.png]]

Можем видеть, что оно появилось в SB:


![[Pasted image 20241104162124.png]]


Но он выёбывается на то, что мы исползуем ссылки

У нас компонент рендерится изолированно, а для того, чтобы использовать функциональность React Router DOM, необходимо всё обернуть в Router

Чтобы с этим справиться, обернём всё в Router

Создадим папку с одноимённым файлом и скопируем туда вот эту конструкцию из `StyleDecorator.ts`:

![[Pasted image 20241104162326.png]]

И там уже обернём нашу Story в `BrowserRouter`

> `RouterDecorator.tsx`:

![[Pasted image 20241104162450.png]]

Терь остаётся этот декортаор глобально добавить в `preview`

![[Pasted image 20241104162537.png]]

И подправим путь:

![[Pasted image 20241104162711.png]]


### Остаётся ещё один widget, на который мы не написали storybook - `ErrorPage`

Создадим и скопируем код из `Navbar`:

![[Pasted image 20241105102342.png]]

Заменяем названия на `ErrorPage`:

![[Pasted image 20241105102443.png]]


Оно не принимает никаких аргументов, поэтому можем оставить также

Тут всё норм:

![[Pasted image 20241105102525.png]]


### С widgets закончили, переходим к `shared` слою. Начнём с `AppLink`:

![[Pasted image 20241105102716.png]]

И имена также меняем

> `AppLink.tsx`:


![[Pasted image 20241105102758.png]]

#### У нас у ссылок есть несколько тем: `primary`, `secondary`, и `red`

#### Для каждой из этих тем напишем по SB

![[Pasted image 20241105102921.png]]

![[Pasted image 20241105102933.png]]

![[Pasted image 20241105102942.png]]

Для каждой темы описали соответствующий SB:

![[Pasted image 20241105103004.png]]

Тут у нас всё нахуй падает. Причиной этому - использование ссылок. Мы используем ссылки, но не используем обязательный пропс `to`. В данном случае его указывать обязательно

Сейчас нам нужно пропс `to` прокинуть в каждую из stories. Чтобы это не делать вручную, мы можем в свойстве `args` указать этот пропс. Он прокинется в абсолюнто каждую story

> `AppLink.stories.tsx`:

![[Pasted image 20241105103215.png]]

Терь ссылки работают нормально:

![[Pasted image 20241105103234.png]]


#### Для тех компонентов, что используются в `shared` слое важно писать много тество, потому что первые переиспользуются часто. Поэтому сделаем ещё всё тоже самое с тёмным вариантом

Сделаем мы это с помощью декоратора `ThemeDecorator`:

![[Pasted image 20241105103625.png]]

Терь у нас для каждой возможной ссылки есть также вариант с тёмной темой:

![[Pasted image 20241105103702.png]]


#### Терь напишем story для `Loader.tsx`:

![[Pasted image 20241105103845.png]]

![[Pasted image 20241105103856.png]]


![[Pasted image 20241105103912.png]]


#### `PageLoader` можно пропустить, потому что он содержит в себе loader, который мы протестировали выше. Мы идём теперь на `ThemeSwitcher`

![[Pasted image 20241105104040.png]]

![[Pasted image 20241105104103.png]]


![[Pasted image 20241105104112.png]]

Получаем:

![[Pasted image 20241105104127.png]]


#### Далее у нас идут страницы `pages`. У нас есть три страницы, и на каждую из мы пишем по SB

Т.е. сначала мы пишем SB's на `shared` слой, затем на `entities`, потом на `featues`, потом на на страницы. Получается, что за счёт композиции по итогу на самом верхнем уровне мы ещё тестируем и нижележащие уровни 

> `AboutPage.stories.tsx`:

![[Pasted image 20241105104527.png]]

![[Pasted image 20241105104534.png]]

Там мы ещё меняем `title` с папки `shared` на `pages`, чтобы внутри самого SB на сайте у нас всё правильно группировалось

 У нас вот тут:
![[Pasted image 20241105104639.png]]

Используется именованный экспорт

А сама страница:

`AboutPage.tsx`:

![[Pasted image 20241105104725.png]]

Мы её экспортируем по дефолту

Короче, вот тут убираем:

> `AboutPage.stories.tsx`:

![[Pasted image 20241105104806.png]]


Терь у нас внутри SB всё сгруппировано по слоям:

![[Pasted image 20241105104833.png]]


#### Терь у нас остаётся ещё две страницы для SB: `MainPage` и `NotFoundPage`:

### `MainPage.stories.tsx`:

![[Pasted image 20241105105027.png]]

### `NotFoundPage.stories.tsx`:

![[Pasted image 20241105105135.png]]


Терь в самом SB видим:

![[Pasted image 20241105105151.png]]

