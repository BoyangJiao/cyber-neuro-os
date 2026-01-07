import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

export class SanityErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.warn('Sanity Visual Editing crashed:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            // Fail silently or render a minimal warning that doesn't obstruct the UI
            return null;
        }

        return this.props.children;
    }
}
