import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth.context";
import { ErrorProvider } from "./context/error.context";
import { GlobalErrorProvider } from "./context/global-error.context";
import { ToastProvider } from "./context/toast.context";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorProvider>
        <ToastProvider>
          <GlobalErrorProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </GlobalErrorProvider>
        </ToastProvider>
      </ErrorProvider>
    </BrowserRouter>
  </StrictMode>
);
