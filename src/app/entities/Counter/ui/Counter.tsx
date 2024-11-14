import { Button } from 'shared/ui/Button/Button';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { counterActions } from 'app/entities/Counter/model/slice/counterSlice';
import { StateSchema } from 'app/providers/StoreProvider/config/StateSchema';

export const Counter = () => {
    const dispatch = useDispatch();
    const counterValue = useSelector((state: StateSchema) => state.counter.);
    const { t } = useTranslation();

    const increment = () => {
        dispatch(counterActions.increment());
    };

    const decrement = () => {
        dispatch(counterActions.decrement());
    };

    return (
        <div>
            <h1>
                {t('value')}
            </h1>
            <Button onClick={increment}>
                {t('Increment')}
            </Button>
            <Button onClick={decrement}>
                {t('Decrement')}
            </Button>
        </div>
    );
};
