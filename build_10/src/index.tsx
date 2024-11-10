import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
<<<<<<< HEAD
import { ThemeProvider } from 'app/providers/ThemeProvider';
import App from './app/App';

import './shared/config/i18n/i18n';
import { ErrorBoundary } from './app/providers/ErrorBoundary';
=======
// import { ThemeProvider } from 'app/providers/ThemeProvider';
import { ThemeProvider } from 'app/providers/ThemeProvider/index';
import App from './app/App';

import './shared/config/i18n/i18n';
// import { ErrorBoundary } from './app/providers/ErrorBoundary';
import { ErrorBoundary } from './app/providers/ErrorBoundary/index';
>>>>>>> 35dabf958a47fd06b6403b61bdad746e330fba6d

render(
    <BrowserRouter>
        <ErrorBoundary>
            <ThemeProvider>
                <App />
            </ThemeProvider>
        </ErrorBoundary>
    </BrowserRouter>,
    document.getElementById('root'),
);
