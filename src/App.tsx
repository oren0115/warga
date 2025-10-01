import "./css/main.css";
import { Routes, Route } from "react-router-dom";
import Login from "./page/auth/login/login";
// import Register from "./page/auth/register/register";
import { AuthProvider } from "./context/auth.context";
import Layout from "./layout/Layout";

// admin pages
import Dashboard from "./page/admin/dashboard";
import UserManagement from "./page/admin/user.management";
import GenerateFees from "./page/admin/generate.fees";
import PaymentReview from "./page/admin/payment.review";
import BroadcastNotification from "./page/admin/BroadcastNotification";

// user pages
import Home from "./page/user/home";
import Iuran from "./page/user/iuran";
import IuranDetail from "./page/user/iuran.detail";
import PaymentHistory from "./page/user/payment.history";
import Notifications from "./page/user/notifications";
import Profile from "./page/user/profile";

// payment status pages
import PaymentProcessing from "./page/user/payment.processing";
import PaymentSuccess from "./page/user/payment.success";
import PaymentPending from "./page/user/payment.pending";
import PaymentFailed from "./page/user/payment.failed";

// error pages
import UnauthorizedPage from "./page/unauthorized";

// proteksi
import { ProtectedRoute } from "./components/protected.route";
import { AdminRoute } from "./components/admin.route";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}

        {/* User routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Home />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/iuran"
          element={
            <ProtectedRoute>
              <Layout>
                <Iuran />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/iuran/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <IuranDetail />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/riwayat"
          element={
            <ProtectedRoute>
              <Layout>
                <PaymentHistory />
              </Layout>
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/payment-history"
          element={
            <ProtectedRoute>
              <Layout>
                <PaymentHistory />
              </Layout>
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Layout>
                <Notifications />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Payment status routes */}
        <Route
          path="/payment/processing"
          element={
            <ProtectedRoute>
              <Layout>
                <PaymentProcessing />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/success"
          element={
            <ProtectedRoute>
              <Layout>
                <PaymentSuccess />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/pending"
          element={
            <ProtectedRoute>
              <Layout>
                <PaymentPending />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/failed"
          element={
            <ProtectedRoute>
              <Layout>
                <PaymentFailed />
              </Layout>
            </ProtectedRoute>
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
  );
}

export default App;
