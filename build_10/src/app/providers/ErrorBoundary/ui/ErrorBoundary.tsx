<<<<<<< HEAD
=======
// ErrorBoundary.tsx
>>>>>>> 35dabf958a47fd06b6403b61bdad746e330fba6d
import React, { ErrorInfo, ReactNode, Suspense } from 'react';
import { ErrorPage } from 'widgets/ErrorPage/ui/ErrorPage';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

<<<<<<< HEAD
class ErrorBoundary
=======
export class ErrorBoundary
>>>>>>> 35dabf958a47fd06b6403b61bdad746e330fba6d
    extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
<<<<<<< HEAD
        // Update state so the next render will show the fallback UI.
=======
>>>>>>> 35dabf958a47fd06b6403b61bdad746e330fba6d
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
<<<<<<< HEAD
        // You can also log the error to an error reporting service
=======
>>>>>>> 35dabf958a47fd06b6403b61bdad746e330fba6d
        console.log(error, errorInfo);
    }

    render() {
        const { hasError } = this.state;
        const { children } = this.props;

        if (hasError) {
<<<<<<< HEAD
            // You can render any custom fallback UI
=======
>>>>>>> 35dabf958a47fd06b6403b61bdad746e330fba6d
            return (
                <Suspense fallback="">
                    <ErrorPage />
                </Suspense>
            );
        }

        return children;
    }
<<<<<<< HEAD
}

export default ErrorBoundary;
=======
}
>>>>>>> 35dabf958a47fd06b6403b61bdad746e330fba6d
