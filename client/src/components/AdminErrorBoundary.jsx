import React from 'react';

class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('AdminErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // You can also log to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
          <div className="max-w-2xl w-full bg-slate-900 border border-red-500/30 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <span className="text-3xl">⚠️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  Admin Dashboard Error
                </h1>
                <p className="text-slate-400 text-sm">
                  A runtime error occurred in the admin interface
                </p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-6">
              <p className="text-red-400 font-mono text-sm mb-2">
                {this.state.error?.toString() || 'Unknown error'}
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                <details className="mt-4">
                  <summary className="text-slate-500 text-xs cursor-pointer hover:text-slate-300 mb-2">
                    Component Stack (Development Only)
                  </summary>
                  <pre className="text-xs text-slate-600 font-mono overflow-auto max-h-48 bg-black/40 p-3 rounded border border-slate-800">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/admin'}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Return to Dashboard
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-6 text-center">
              If this error persists, please contact system administration.
            </p>
          </div>
        </div>
      );
    }

    // Render children normally if no error
    return this.props.children;
  }
}

export default AdminErrorBoundary;

