import React, {Suspense} from 'react';
import './styles/index.scss';
import {Link, Route, Routes} from 'react-router-dom';
import {classNames} from "shared/lib/classNames/classNames";
import {useTheme} from "app/providers/ThemeProvider";
import {AppRouter} from "app/providers/router";


const App = () => {

    const {theme, toggleTheme} = useTheme()

    return (
        <div className={classNames("app", {}, [theme])}>

            <button onClick={() => toggleTheme()}>Change Theme</button>

            <Link to={`/`}>Главная</Link>
            < br/>
            <Link to={`/about`}>О сайте</Link>
            <br/>
            <Link to={`/niggas`}>Niggaz</Link>
            <br/>
            <Link to={`/white_people`}>wipepo</Link>

            <AppRouter />

        </div>
    );
};

export default App;
