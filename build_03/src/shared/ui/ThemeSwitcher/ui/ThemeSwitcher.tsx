import {classNames} from "shared/lib/classNames/classNames";
import cls from './ThemeSwitcher.module.scss';
import {useTheme} from "app/providers/ThemeProvider";
import LightIcon from "shared/assets/icons/theme-light.svg";
import DarkIcon from "shared/assets/icons/dark-light.svg";

interface ThemeSwitcherProps {
    className?: string;
}



export const ThemeSwitcher = ({className}: ThemeSwitcherProps) => {
const { theme, toggleTheme } = useTheme();
    return (
        <button className={classNames(cls.ThemeSwitcher, {}, [className])} onClick={toggleTheme}>
            <DarkIcon />
        </button>
    );
};
