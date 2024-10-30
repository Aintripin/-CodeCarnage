
Щас мы можем во вкладке `network` посмотреть сколько весит тот или иной чанк

![[Pasted image 20241029174750.png]]

According to Ulbi, это неудобно

```URL:
https://github.com/webpack-contrib/webpack-bundle-analyzer
```

Типо, можно наглядно с помощью интерфейса следить за размером пакетов

```BASH:
npm i webpack-bundle-analyzer@4.5.0
```

Вот тут у нас в docs import через require:

![[Pasted image 20241029221759.png]]

Мы можем его заменить на обычный вот так:

![[Pasted image 20241029221814.png]]

TS finna start trippin ballz, поэтмоу ещё установим типы:

![[Pasted image 20241029221953.png]]

```BASH:
npm i -D @types/webpack-bundle-analyzer@4.4.1
```

Это всё идёт вот сюда:

![[Pasted image 20241029222210.png]]

И добавим его, как плагин:

![[Pasted image 20241029222245.png]]

Чтобы каждый раз bundle analyzer не открывался, можем передать вот такой флаг:

![[Pasted image 20241029222557.png]]

![[Pasted image 20241029223931.png]]


