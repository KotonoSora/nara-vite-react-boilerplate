import type { ComponentType, ReactNode } from "react";
import { Component, type ErrorInfo } from "react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

const DefaultErrorFallback = ({ error, retry }: { error: Error; retry: () => void }) => (
  <Card className="max-w-md mx-auto mt-8">
    <CardHeader>
      <CardTitle className="text-destructive">Something went wrong</CardTitle>
      <CardDescription>
        An unexpected error occurred while rendering this component.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <details className="text-sm">
        <summary className="cursor-pointer font-medium">Error details</summary>
        <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
          {error.message}
        </pre>
      </details>
      <Button onClick={retry} className="w-full">
        Try again
      </Button>
    </CardContent>
  </Card>
);

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error} retry={this.retry} />;
    }

    return this.props.children;
  }
}

/**
 * Higher-order component that wraps a component with an error boundary
 */
export function withErrorBoundary<T extends ComponentType<any>>(
  WrappedComponent: T,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, "children">,
) {
  return function ComponentWithErrorBoundary(props: React.ComponentProps<T>) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}