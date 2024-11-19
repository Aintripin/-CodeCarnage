`Live Templates` -> `user`:

![[Pasted image 20241118152600.png]]

### Contents:

![[Pasted image 20241118152626.png]]


```TSX:
import {classNames} from "shared/lib/classNames/classNames";
import cls from './$FILE$.module.scss';

interface $FILE$Props {
    className?: string;
}

export const $FILE$ = ({className}: $FILE$Props) => {
    return (
        <div className={classNames (cls.$FILE$, {}, [className])}>
            
        </div>
    );
};

```

![[Pasted image 20241119114003.png]]
