

У нас с самого начала после установки jest'а создаётся конфиг, где почти всё закоменченно, это всё мы переносим в папку `config`, где создадим папку `jest`:

Из всего конфига незакомиченных строчек всего две - их можно сгруппировать и перенести наверх

Таже расскоментируем это:

![[Pasted image 20241025151736.png]]

И перенесём всё вместе

![[Pasted image 20241025151847.png]]

Это тоже расскоментируем и перенесём к остальным


И это тоже:

![[Pasted image 20241025151930.png]]


Также расскоментриуем и изменим вот этой свойство (потому что конфиг лежит не в корне проекта):

```JSON:
rootDir: "../../"
```

тут указываем путь до корневой папки. Т.е. мы сначала выходим из папки `jest`, потом из папки `config`и только потом попадаем в корень

Также вот этой свойство:

![[Pasted image 20241025152225.png]]

Тут указываются выражения, по которым находим файлы

Чтобы корректно находить свойства с тестами, вот эту всю херню нужно переделать на:

![[Pasted image 20241025152320.png]]

Мы тут указываем `<rootDir>` в строке - это как раз тот самый путь до корня проекта

### `"<rootDir>src/**/*(*.)@(spec|test).[tj]s?(x)"`

1. **`<rootDir>`:**
    
    - This is a placeholder for the root directory of your project (in your case, defined as `../../`). Jest will replace `<rootDir>` with the actual path to the root directory when it's looking for test files.
2. **`src/`**:
    
    - This specifies that Jest should only look for test files within the `src` folder.
3. **`**/*`**:
    
    - The double asterisk (`**`) is a wildcard that matches any directory, including nested ones. For example, it will search all subdirectories under `src/`.
    - The single asterisk (`*`) matches any file or folder name, but not slashes. Together, `**/*` matches any files in the `src` directory and its subdirectories.
4. **`(*.)@(spec|test)`**:
    
    - This part in parentheses is saying that the test file can either:
        - Have a dot (`.`) followed by `spec` or `test`. For example, files like `App.test.js` or `App.spec.tsx` will match.
        - The `@` symbol is like an OR operator in this glob pattern syntax, so it checks for either `spec` or `test`.
5. **`.[tj]s?(x)`**:
    
    - This part specifies the file extension:
        - `[tj]s`: It matches `.js` or `.ts` files, where `[tj]` is a character class matching either `t` (for TypeScript) or `j` (for JavaScript).
        - `?(x)`: This matches an optional `x`, so it can match either `.js`, `.jsx`, `.ts`, or `.tsx` files.

Вернёмся в `package.json`:

![[Pasted image 20241025152612.png]]

Тут вот эта херня у нас появилась

В видосе вот так:

![[Pasted image 20241025152711.png]]

Но т.к. мы конфиг подвинули, path-wise, то тут тоже изменим и добавим пару вещей:


```JSON:
"unit": "jest --config ./config/jest/jest.config.ts"
```


## Теперь напишем unit-test:

Для этого у нас есть, как раз, прецендент:

![[Pasted image 20241025153053.png]]

Делаем вот так:

![[Pasted image 20241025153145.png]]

Далее, с помощью `describe` создаём обёртку для целой пачки тестов вот так:

![[Pasted image 20241025153208.png]]

Но TS В душе не ебёт чё такое `describe`:

![[Pasted image 20241025153243.png]]

Если мы разуем шары, можем увидеть, что нам даже предлагается это исправить через:

![[Pasted image 20241025153326.png]]

BTW, в паблике указано вот такое:

```JSON:
"@types/jest": "^27.4.1"
```

Теперь одна ошибка ушла, но теперь ругается TS:

![[Pasted image 20241025153510.png]]


Если попробовать найти ошибку в инете, по первой ссылке на stackOverflow:

![[Pasted image 20241025153547.png]]

Теперь сделаем вот такую простую конструкцию:

![[Pasted image 20241025153639.png]]

Чтобы убедиться, что тесты работают через команду:

```BASH:
npm run unit
```

Теперь `classNames.test.ts`:

![[Pasted image 20241025153959.png]]

Щас он успешно не прошёл:

![[Pasted image 20241025154031.png]]

Потому что TS и WP мы подготовили для работы с абсолютными импортами, а jest - это совсем другая среда (тестовая среда) - она с абсолютными импортами пока что рабоать не умеет. Поэтому:

> `classNames.test.ts`

![[Pasted image 20241025154149.png]]

Щас у нас тест снова упал:

![[Pasted image 20241025154226.png]]

Но ругается уже не на импорты, а на тип

В документации написано:

![[Pasted image 20241025154323.png]]

Тоже самое сделаем, но через `npm`:

![[Pasted image 20241025154406.png]]

Внизу пример, как это использовать:

![[Pasted image 20241025154434.png]]

Вот оно лежит в корне проекта:

![[Pasted image 20241025154551.png]]

>`babel.config.json`:

![[Pasted image 20241025155001.png]]


Щас, по идее, должно быть вот так:

![[Pasted image 20241025155032.png]]

### Теперь можно писать несколько test-case'ов:

Сделаем вот так

> `classNames.test.ts`:

![[Pasted image 20241025155240.png]]

![[Pasted image 20241025155337.png]]

Добавим ещё тест:

![[Pasted image 20241025155441.png]]

И ещё тест ёбнем:

![[Pasted image 20241025155510.png]]

`scrollable` у нас тут выше в ожидаемом результате быть не должно, потому что поставили `false`

Сделаем `scrollable: undefined`. В таком случае, по идеи, этот класс тоже не должен добавиться в строку


#### Закоммитим:

Если мы щас попытаемся закоммитить в github, то увидим, что:

![[Pasted image 20241025155826.png]]


Т.е. ESLint нам говорит, что строчки с комментариями слишком длинные: по правилам у нас 100 символов в строке максимум, а тут где как:

![[Pasted image 20241025155912.png]]


Документация ESLint:

![[Pasted image 20241025155943.png]]


Смотрим, открываем

> `eslintrc.js`:

![[Pasted image 20241025160041.png]]


Казалось бы, можно на похуй пушить, но опять будет ошибка, уже не про комменты


Можно перенести на новую строчку:

![[Pasted image 20241025160252.png]]

Вторая ошибка в самом ESLint-конфиге:

![[Pasted image 20241025160315.png]]

Каждый из элементов массива можно просто перенести на новую строчку:

![[Pasted image 20241025160342.png]]


