
Т.к. we fuckin B.R.O.K.E., то платить за движения на github мы не будем. В качестве альтернативы будем использовать `husky`

[Документация](https://typicode.github.io/husky/get-started.html)

```BASH:
npm install --save-dev husky
```

```BASH:
npx husky init
```

![[Pasted image 20241120111700.png|300]]


Появилась папка `./husky` в корне проекта, там файл `pre-commit`

По дефолту тут запускается команда

```BASH:
npm test
```

![[Pasted image 20241120111807.png]]

По сути, запускать мы тут можем всё, что угодно, но, обычно, запускаются тут только Linter'ы

Запускать сборку, SB, тесты -- это очень долго. На этапе pre-commit'а это долго, но у нас аналогов нет, поэтому будем всё тут запускать (хоть не вручную)

>`pre-commit`:

![[Pasted image 20241120112305.png]]

```BASH:
npm run build:prod  
npm run lint:ts  
npm run lint:scss  
npm run test:unit  
npm run storybook:build  
npm run test:ui
```

 По итогу:
 
![[Pasted image 20241120112720.png]]

Ошибка связана со stylelint, который проверяет `scss`, в файле `Login.module.scss`:

![[Pasted image 20241120113051.png]]

А этот файл у нас вот:

![[Pasted image 20241120113306.png]]

Типо, Linter выёбывается, что файл пустым быть не может

Поэтому 

![[1649961167_new_preview_AazteDO9pVU.png|350]]


![[Pasted image 20241120113541.png|350]]

По факту у меня:

![[Pasted image 20241120115831.png]]

... это было ошибкой

> `LoginModal.tsx`:

Удалим этот удалённый файл из импортов:

![[Pasted image 20241120113831.png]]

`cls.LoginModal` -- это лишний теперь класс, его удаляем

Оставляем пустую строчку:

![[Pasted image 20241120113913.png]]

Попробуем сделать коммит ещё раз:

![[Pasted image 20241120113949.png]]

Щас вот так:

![[Pasted image 20241120114438.png]]

У нас проблема при получении stories

Когда мы запускали UI-тесты в CI, мы делали перед этим сборку SB и на основании этой сборки уже переснимали тесты

Мы можем просто запустить SB:

```BASH:
npm run storybook
```

И после его запуска можем прогнать тесты:

```BASH:
npm run test:ui
```

Смотрим скрины. Если там всё ОК, то подтверждаем эти скрины командой:

```BASH:
npm run test:ui:ok
```

