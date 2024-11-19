import { classNames } from 'shared/lib/classNames/classNames';
import React, { ButtonHTMLAttributes, InputHTMLAttributes, memo } from 'react';
import { ButtonSize, ButtonTheme } from 'shared/ui/Button/Button';
import cls from './Input.module.scss';

// interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
//     className?: string;
//     value?: string;
//     onChange?: (value: string) => void;
// }

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    className?: string;
    value?: string;
    onChange?: (value: string) => void;
}

export const Input = memo((props: InputProps) => {
    const {
        className,
        value,
        onChange,
        type = 'text',
        placeholder,
        ...otherPropps
    } = props;

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.value);
    };

    return (
        <div className={classNames(cls.InputWrapper, {}, [className])}>
            <div className={cls.placeholder}>
                {`${placeholder} >`}
            </div>
            <input
                type={type}
                value={value}
                onChange={onChangeHandler}
            />
        </div>
    );
});
