import {classNames} from "shared/lib/classNames/classNames";
import cls from './Sidebar.module.scss';
import {useState} from "react";

interface SidebarProps {
    className?: string;
}

export const Sidebar = ({className}: SidebarProps) => {

    const [collapsed, setCollaped] = useState(false);


    return (
        // <div className={classNames (cls.Sidebar, {[cls.collapsed], [className])}>
        <div className={classNames(cls.Sidebar, {[cls.collapsed]}, [className])}>


        </div>
    );
};
