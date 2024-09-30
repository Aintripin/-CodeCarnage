import React, {Suspense} from 'react';
import Counter from "./components/Counter";
import './styles/index.scss';
import {Link, Route, Routes} from 'react-router-dom';
import AboutPageAsync from "./pages/AboutPage/AboutPage.async";
import MainPageAsync from "./pages/MainPage/MainPage.async";
import {useTheme} from "./theme/useTheme";
import {classNames} from "./helpers/classNames/classNames";


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

            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path={`/about`} element={<AboutPageAsync />} />
                    <Route path={`/`} element={<MainPageAsync />} />
                    <Route path={`/niggas`} element={<Counter initialValue={420} key={`niggas`} />} />
                    <Route path={`/white_people`} element={<Counter key={`crackaz`} />} />
                </Routes>
            </Suspense>

        </div>
    );
};

export default App;
