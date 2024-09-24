import React, {useState} from 'react';
import classes from './Counter.module.scss';

interface ICounter {
    initialValue?: number
}

const Counter: React.FC<ICounter> = ({initialValue = 0}) => {
    const [count, setCount] = useState(initialValue);

    const increment = () => {
        setCount(count + 1);
    }

    return (
        <div className={classes.btn}>
            <h1>{count}</h1>
            <button onClick={increment}>increment</button>
        </div>
    );
};

export default Counter;
