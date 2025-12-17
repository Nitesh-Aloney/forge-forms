import { Box, Link, Typography } from '@mui/material';
import { Component, type ErrorInfo, type PropsWithChildren } from 'react';
import type { TErrorResponse } from '@/schemas/errors/error-response';
import FormsForgeWebError from '@/schemas/errors/ForgeFormsWebError';
import ResponseError from '@/schemas/errors/ResponseError';
import { StatusCode } from '@/schemas/http/StatusCode';
import Error403 from './Error403';

type ErrorLike = TErrorResponse;

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error | ErrorLike;
  lastRetryTime?: number;
  retryCount: number;
}

const MAX_RETRIES = 3;
const RETRY_COOLDOWN = 5000; // 5 seconds

const TryAgain = ({ onRetry }: { onRetry: () => void }) => (
  <Link onClick={onRetry} sx={{ cursor: 'pointer' }}>
    try again
  </Link>
);

class ErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  constructor(props: PropsWithChildren) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    let processedError: Error | ErrorLike;

    if (error instanceof Error) {
      processedError = error;
    } else if (typeof error === 'object' && error !== null) {
      const errorLike: Partial<ErrorLike> = error;
      processedError = {
        code: errorLike.code || 'UNKNOWN',
        message: errorLike?.message || 'An unknown error occurred',
      };
    } else {
      processedError = new Error('An unknown error occurred');
    }

    return {
      error: processedError,
      hasError: true,
      retryCount: 0,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  // customize this error if the use cases require
  handleRetry = () => {
    const now = Date.now();
    const { retryCount, lastRetryTime } = this.state;

    if (lastRetryTime && now - lastRetryTime < RETRY_COOLDOWN) {
      // Check if we're within the cooldown period
      return; // Still in cooldown
    }

    if (retryCount >= MAX_RETRIES) {
      // Check if we've exceeded max retries
      return; // Max retries exceeded
    }

    this.setState(prevState => ({
      error: undefined,
      hasError: false,
      lastRetryTime: now,
      retryCount: prevState.retryCount + 1,
    }));

    if (this.state.error instanceof FormsForgeWebError && this.state.error.retry) {
      this.state.error.retry?.();
    }
  };

  render() {
    const { error, hasError, retryCount } = this.state;

    // Check for forbidden error, supporting both ResponseError and ErrorLike
    const isForbidden =
      (error instanceof ResponseError && error.status === StatusCode.FORBIDDEN) ||
      (error && 'status' in error && error.status === StatusCode.FORBIDDEN);

    if (isForbidden) {
      return <Error403 />;
    }

    if (hasError) {
      const canRetry = this.state.error instanceof FormsForgeWebError && this.state.error.retry && retryCount < MAX_RETRIES;

      return (
        <Box data-test="error-view" sx={{ height: '100%', p: '3rem 2rem', width: '100%' }}>
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              textAlign: 'center',
            }}
          >
            <Box alt="error" component="img" src="/images/error.svg" />
            <Typography fontWeight={600} variant="body1">
              {this.state.error instanceof FormsForgeWebError && this.state.error?.message
                ? this.state.error?.message
                : 'An unexpected error occurred'}
              {canRetry && (
                <>
                  , <TryAgain onRetry={this.handleRetry} />
                </>
              )}
              .
            </Typography>
            <Typography variant="body2">Please contact your system admin for assistance.</Typography>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
