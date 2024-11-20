import { classNames } from 'shared/lib/classNames/classNames';
import { Modal } from 'shared/ui/Modal/Modal';
import { LoginForm } from 'app/features/AuthByUsername/ui/LoginForm/LoginForm';
import { ReactNode } from 'react';

interface LoginModalProps {
    className?: string;
    isOpen: boolean;
    onClose: () => void;
    children?: ReactNode;
}

export const LoginModal = ({
    className, isOpen, onClose, children,
}: LoginModalProps) => (
    <Modal
        className={classNames('', {}, [className])}
        isOpen={isOpen}
        onClose={onClose}
    >
        {children}
        <LoginForm />
    </Modal>
);
