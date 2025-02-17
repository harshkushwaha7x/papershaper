import { Component, ErrorInfo, ReactNode } from "react";
import {
  ExclamationTriangleIcon,
  ArrowPathIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error: error,
      errorInfo: null,
      showDetails: false,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by Error Boundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-8">
          <div className="max-w-2xl w-full p-6 md:p-10">
            <div className="flex flex-col items-center text-center space-y-6 md:space-y-8">
              <div className="bg-red-100 p-4 rounded-full animate-pulse">
                <ExclamationTriangleIcon className="w-12 h-12 text-red-600" />
              </div>

              <div className="space-y-3">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Oops! Something Went Wrong
                </h1>
                <p className="text-gray-600 md:text-lg">
                  We're sorry for the inconvenience. Let's get you back on
                  track.
                </p>
                <div className="p-3 bg-green-50 rounded-lg mt-4">
                  <p className="text-sm text-red-700 font-medium">
                    {this.state.error?.toString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
                <button
                  onClick={this.handleReload}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-green-600 text-white rounded-xl
                    hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <ArrowPathIcon className="w-5 h-5" />
                  <span className="font-semibold">Refresh Page</span>
                </button>

                <a
                  href="/contact"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white text-green-600 rounded-xl
                    border-2 border-green-100 hover:border-green-200 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <DocumentTextIcon className="w-5 h-5" />
                  <span className="font-semibold">Report Issue</span>
                </a>
              </div>

              {this.state.errorInfo && (
                <div className="w-full mt-6">
                  <button
                    onClick={this.toggleDetails}
                    className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-2 mx-auto"
                  >
                    <span>
                      {this.state.showDetails
                        ? "Hide Technical Details"
                        : "Show Technical Details"}
                    </span>
                  </button>

                  {this.state.showDetails && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg overflow-auto max-h-96 shadow-inner">
                      <pre className="text-xs text-green-800 font-mono whitespace-pre-wrap leading-relaxed">
                        {this.state.error?.stack}
                        {"\n\n"}
                        {this.state.errorInfo?.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
