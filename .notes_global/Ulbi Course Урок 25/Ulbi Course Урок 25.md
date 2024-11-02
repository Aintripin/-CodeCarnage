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


Откроем `Button.stories.tsx`:s

Поудаляем комментарии, чтобы кода было поменьше.

Потом заменим название сториса:

![[Pasted image 20241101123959.png]]

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

