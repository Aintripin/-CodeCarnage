import {classNames} from "shared/lib/classNames/classNames";
import {useTheme} from "app/providers/ThemeProvider";
import LightIcon from "shared/assets/icons/theme-light.svg";
import DarkIcon from "shared/assets/icons/dark-light.svg";

interface ThemeSwitcherProps {
    className?: string;
}



export const ThemeSwitcher = ({className}: ThemeSwitcherProps) => {
const { theme, toggleTheme } = useTheme();
    return (
        <button className={classNames("", {}, [className])} onClick={toggleTheme}>
            <DarkIcon />
        </button>
    );
};
