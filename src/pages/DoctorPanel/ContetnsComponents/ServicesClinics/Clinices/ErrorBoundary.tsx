import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1 className="text-red-500">خطایی رخ داده است. لطفاً صفحه را رفرش کنید.</h1>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;