import React from 'react';
import Counter from "./components/Counter";
import './index.scss';
import {Routes, Route, Link} from 'react-router-dom';
import AboutPage from "./pages/AboutPage/AboutPage";
import MainPage from "./pages/MainPage/MainPage";

const App = () => {
    return (
        <div className="app">

            <Link to={`/`}>Главная</Link>
            < br/>
            <Link to={`/about`}>О сайте</Link>
            <br/>
            <Link to={`/niggas`}>Niggaz</Link>
            <br/>
            <Link to={`/white_people`}>wipepo</Link>


            <Routes>
                <Route path={`/about`} element={<AboutPage/>}/>
                <Route path={`/`} element={<MainPage/>}/>
                <Route path={`/niggas`} element={<Counter initialValue={420} key={`niggas`}/>}/>
                <Route path={`/white_people`} element={<Counter key={`crackaz`}/>}/>
            </Routes>

        </div>
    );
};

export default App;
