import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ErrorDisplay, ErrorState } from '../common';
import { useErrorHandler, useAsyncErrorHandler } from '../../hooks/useErrorHandler';
import { userService } from '../../services/user.service';

/**
 * Contoh penggunaan error handling yang baru
 * Menunjukkan bagaimana menangani error tanpa menampilkan URL/IP backend
 */
const ErrorHandlingExample: React.FC = () => {
  const [showExample, setShowExample] = useState(false);
  const errorHandler = useErrorHandler();
  const asyncErrorHandler = useAsyncErrorHandler();

  // Contoh 1: Error handling dengan useErrorHandler
  const handleNetworkError = async () => {
    try {
      // Simulasi network error
      await fetch('http://nonexistent-api.com/data');
    } catch (error) {
      errorHandler.handleError(error, 'network_test');
    }
  };

  // Contoh 2: Error handling dengan useAsyncErrorHandler
  const handleServerError = async () => {
    await asyncErrorHandler.executeWithErrorHandling(
      async () => {
        // Simulasi server error
        const response = await fetch('/api/nonexistent-endpoint');
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        return response.json();
      },
      'server_test'
    );
  };

  // Contoh 3: Error handling dengan API service
  const handleApiError = async () => {
    try {
      // Ini akan menggunakan error handling yang sudah diintegrasikan
      await userService.getFees();
    } catch (error) {
      errorHandler.handleError(error, 'api_test');
    }
  };

  // Contoh 4: Simulasi berbagai jenis error
  const simulateErrors = {
    network: () => {
      const error = new Error('Network Error');
      (error as any).code = 'NETWORK_ERROR';
      errorHandler.handleError(error, 'network_simulation');
    },
    
    server: () => {
      const error = new Error('Internal Server Error');
      (error as any).response = { status: 500 };
      errorHandler.handleError(error, 'server_simulation');
    },
    
    auth: () => {
      const error = new Error('Unauthorized');
      (error as any).response = { status: 401 };
      errorHandler.handleError(error, 'auth_simulation');
    },
    
    validation: () => {
      const error = new Error('Validation Error');
      (error as any).response = { status: 422, data: { detail: 'Data tidak valid' } };
      errorHandler.handleError(error, 'validation_simulation');
    }
  };

  if (!showExample) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Error Handling Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Klik tombol di bawah untuk melihat contoh error handling yang user-friendly.
            Error akan ditampilkan tanpa menampilkan URL/IP backend.
          </p>
          <Button onClick={() => setShowExample(true)}>
            Tampilkan Contoh
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Error Handling Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={simulateErrors.network} variant="outline">
              Simulasi Network Error
            </Button>
            <Button onClick={simulateErrors.server} variant="outline">
              Simulasi Server Error
            </Button>
            <Button onClick={simulateErrors.auth} variant="outline">
              Simulasi Auth Error
            </Button>
            <Button onClick={simulateErrors.validation} variant="outline">
              Simulasi Validation Error
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={handleNetworkError} variant="outline">
              Test Network Error
            </Button>
            <Button onClick={handleServerError} variant="outline">
              Test Server Error
            </Button>
            <Button onClick={handleApiError} variant="outline">
              Test API Error
            </Button>
            <Button onClick={errorHandler.clearError} variant="outline">
              Clear Error
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {errorHandler.isError && (
        <ErrorDisplay
          error={errorHandler.error}
          onRetry={errorHandler.canRetry ? errorHandler.clearError : undefined}
          onContact={errorHandler.shouldContact ? () => alert('Contact support') : undefined}
          showTechnicalDetails={true}
        />
      )}

      {/* Error State (alternative) */}
      {asyncErrorHandler.isError && (
        <ErrorState
          error={asyncErrorHandler.error}
          onRetry={asyncErrorHandler.canRetry ? asyncErrorHandler.clearError : undefined}
          showTechnicalDetails={true}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Error Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p><strong>Has Error:</strong> {errorHandler.isError ? 'Yes' : 'No'}</p>
            <p><strong>Is Network Error:</strong> {errorHandler.isNetworkError ? 'Yes' : 'No'}</p>
            <p><strong>Is Server Error:</strong> {errorHandler.isServerError ? 'Yes' : 'No'}</p>
            <p><strong>Is Auth Error:</strong> {errorHandler.isAuthError ? 'Yes' : 'No'}</p>
            <p><strong>Can Retry:</strong> {errorHandler.canRetry ? 'Yes' : 'No'}</p>
            <p><strong>Should Contact:</strong> {errorHandler.shouldContact ? 'Yes' : 'No'}</p>
          </div>
        </CardContent>
      </Card>

      <Button onClick={() => setShowExample(false)} variant="outline">
        Kembali
      </Button>
    </div>
  );
};

export default ErrorHandlingExample;
