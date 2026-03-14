import { Component, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    /** Displayed when an error is caught. Defaults to a themed fallback UI. */
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

/**
 * Global error boundary that prevents uncaught exceptions (especially from
 * Three.js / WebGL / dynamic imports) from crashing the entire application.
 *
 * Usage:
 *   <AppErrorBoundary>
 *     <Canvas> ... </Canvas>
 *   </AppErrorBoundary>
 */
export class AppErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        if (import.meta.env.DEV) {
            console.error('[AppErrorBoundary] Caught:', error, info.componentStack);
        }
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;

            return (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 text-brand-primary font-mono">
                    <div className="max-w-md text-center space-y-4 p-8">
                        <div className="text-xs tracking-[0.4em] text-red-500/80 uppercase">
                            ⚠ SYSTEM ERROR
                        </div>
                        <h2 className="text-lg tracking-widest font-bold">
                            NEURAL LINK INTERRUPTED
                        </h2>
                        <p className="text-xs text-text-secondary leading-relaxed">
                            A rendering error occurred. This is usually caused by a WebGL context loss or a failed resource load.
                        </p>
                        {import.meta.env.DEV && this.state.error && (
                            <pre className="text-[10px] text-red-400/60 max-h-24 overflow-auto text-left bg-black/50 p-2 mt-2">
                                {this.state.error.message}
                            </pre>
                        )}
                        <button
                            onClick={this.handleRetry}
                            className="mt-4 px-6 py-2 text-xs tracking-widest border border-brand-primary/50 text-brand-primary hover:bg-brand-primary hover:text-black transition-all uppercase"
                        >
                            RETRY CONNECTION
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
