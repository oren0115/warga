import "./css/main.css";
import { Routes, Route } from "react-router-dom";
import Login from "./page/auth/login/login";
// import Register from "./page/auth/register/register";
import { AuthProvider } from "./context/auth.context";
import { ErrorProvider } from "./context/error.context";
import { ErrorBoundary } from "./components/common";
import Layout from "./layout/Layout";

// admin pages
import Dashboard from "./page/admin/dashboard";
import UserManagement from "./page/admin/user-management";
import GenerateFees from "./page/admin/generate-fees";
import PaymentReview from "./page/admin/payment-review";
import BroadcastNotification from "./page/admin/broadcast-notifications";

// user pages
import Home from "./page/user/home";
import FeesList from "./page/user/fees";
import FeeDetail from "./page/user/fee-detail";
import PaymentHistory from "./page/user/payment-history";
import Notifications from "./page/user/notifications";
import Profile from "./page/user/profile";

// payment status pages
import PaymentProcessing from "./page/user/payment-processing";
import PaymentSuccess from "./page/user/payment-success";
import PaymentPending from "./page/user/payment-pending";
import PaymentFailed from "./page/user/payment-failed";

// error pages
import UnauthorizedPage from "./page/unauthorized";

// proteksi
import { AdminRoute, UserRoute } from "./routes";

function App() {
  return (
    <ErrorProvider>
      <ErrorBoundary>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            {/* <Route path="/register" element={<Register />} /> */}

            {/* User routes */}
            <Route
              path="/"
              element={
                <UserRoute>
                  <Layout>
                    <Home />
                  </Layout>
                </UserRoute>
              }
            />
            <Route
              path="/iuran"
              element={
                <UserRoute>
                  <Layout>
                    <FeesList />
                  </Layout>
                </UserRoute>
              }
            />
            <Route
              path="/iuran/:id"
              element={
                <UserRoute>
                  <Layout>
                    <FeeDetail />
                  </Layout>
                </UserRoute>
              }
            />
            <Route
              path="/riwayat"
              element={
                <UserRoute>
                  <Layout>
                    <PaymentHistory />
                  </Layout>
                </UserRoute>
              }
            />
            {/* <Route
          path="/payment-history"
          element={
            <UserRoute>
              <Layout>
                <PaymentHistory />
              </Layout>
            </UserRoute>
          }
        /> */}
            <Route
              path="/notifications"
              element={
                <UserRoute>
                  <Layout>
                    <Notifications />
                  </Layout>
                </UserRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <UserRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </UserRoute>
              }
            />

            {/* Payment status routes */}
            <Route
              path="/payment/processing"
              element={
                <UserRoute>
                  <Layout>
                    <PaymentProcessing />
                  </Layout>
                </UserRoute>
              }
            />
            <Route
              path="/payment/success"
              element={
                <UserRoute>
                  <Layout>
                    <PaymentSuccess />
                  </Layout>
                </UserRoute>
              }
            />
            <Route
              path="/payment/pending"
              element={
                <UserRoute>
                  <Layout>
                    <PaymentPending />
                  </Layout>
                </UserRoute>
              }
            />
            <Route
              path="/payment/failed"
              element={
                <UserRoute>
                  <Layout>
                    <PaymentFailed />
                  </Layout>
                </UserRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <Layout>
                    <UserManagement />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/fees"
              element={
                <AdminRoute>
                  <Layout>
                    <GenerateFees />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/payments"
              element={
                <AdminRoute>
                  <Layout>
                    <PaymentReview />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/broadcast"
              element={
                <AdminRoute>
                  <Layout>
                    <BroadcastNotification />
                  </Layout>
                </AdminRoute>
              }
            />

            {/* Unauthorized & Not Found */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="*" element={<h1>404 - Not Found</h1>} />
          </Routes>
        </AuthProvider>
      </ErrorBoundary>
    </ErrorProvider>
  );
}

export default App;
