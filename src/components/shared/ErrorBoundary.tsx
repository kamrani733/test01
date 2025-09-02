'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-lg">
            <div className="flex items-center justify-center">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="mt-4 text-center text-xl font-semibold text-gray-900">
              خطایی رخ داده است
            </h2>
            <p className="mt-2 text-center text-gray-600">
              متأسفانه مشکلی پیش آمده است. لطفاً صفحه را مجدداً بارگذاری کنید.
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>بارگذاری مجدد</span>
              </Button>
              <Button onClick={this.handleReset} className="flex items-center space-x-2">
                <span>تلاش مجدد</span>
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 rounded border p-4">
                <summary className="cursor-pointer font-medium text-gray-700">
                  جزئیات خطا (فقط در حالت توسعه)
                </summary>
                <pre className="mt-2 whitespace-pre-wrap text-sm text-red-600">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
