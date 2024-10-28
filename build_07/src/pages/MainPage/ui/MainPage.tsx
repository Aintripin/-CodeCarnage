import React from 'react';
import { useTranslation } from 'react-i18next';
import {Loader} from "shared/ui/Loader/Loader";

const MainPage = () => {
    const { t } = useTranslation();

    return (
        <div>
            {t('Главная страница')}
        </div>
    );
};

export default MainPage;
