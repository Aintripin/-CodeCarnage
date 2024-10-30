
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
npm i -D @testing-library/jest-dom
```

Далее создадим `setupTests.ts`:

![[Pasted image 20241029230033.png]]

Потом в самом конфиге нужно, согласно документации, добавить:

![[Pasted image 20241029230159.png]]



![[Pasted image 20241029230432.png]]


В нашем случае ещё поменяем название:

![[Pasted image 20241029230515.png]]

Щас нам нужно сделать так, чтоблы та конфигурация, которую мы написали, работал с TS. Сделаем это вот так:

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

Попробуем запустить тесты ещё раз:

```BASH:
npm run unit Button.test.tsx
```

Терь у нас всё прошло

![[Pasted image 20241029233210.png]]

Напишем ещё один тест, где у нас будет проверяться, что на кнопке есть тот класс, который мы ей передаём

![[Pasted image 20241029233336.png]]


12:40

