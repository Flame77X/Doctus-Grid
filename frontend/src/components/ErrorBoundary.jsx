import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 font-mono">
                    <h1 className="text-red-500 text-3xl font-bold mb-4">Something went wrong.</h1>
                    <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 max-w-4xl overflow-auto text-left w-full">
                        <p className="text-xl mb-4 text-blue-400">{this.state.error && this.state.error.toString()}</p>
                        <pre className="text-xs text-gray-500 whitespace-pre-wrap">
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-8 px-6 py-3 bg-white text-black font-semibold rounded hover:bg-gray-200 transition-colors"
                    >
                        Reload Application
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
