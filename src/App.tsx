import { Route, Routes } from 'react-router-dom';
import './css/main.css';
import Login from './page/auth/login/login';
// import Register from "./page/auth/register/register";
import { ErrorBoundary } from './components/common';
import { AuthProvider } from './context/auth.context';
import { ErrorProvider } from './context/error.context';
import Layout from './layout/Layout';

// admin pages
import Dashboard from './page/admin/dashboard';
import GenerateFees from './page/admin/manajemen-fees/generate-fees';
import UserManagement from './page/admin/manajemen-users/user-management';
import BroadcastNotification from './page/admin/notifications/broadcast-notifications';
import PaymentReview from './page/admin/payment-review/payment-review';

// user pages
import FeeDetail from './page/user/fees/fee-detail';
import FeesList from './page/user/fees/fees';
import Home from './page/user/home/home';
import Notifications from './page/user/notifications/notifications';
import PaymentHistory from './page/user/payments/payment-history';
import Profile from './page/user/profile/profile';

// payment status pages
import PaymentExpired from './page/user/payments/payment-expired';
import PaymentFailed from './page/user/payments/payment-failed';
import PaymentPending from './page/user/payments/payment-pending';
import PaymentProcessing from './page/user/payments/payment-processing';
import PaymentSuccess from './page/user/payments/payment-success';

// error pages
import UnauthorizedPage from './page/unauthorized';

// proteksi
import { AdminRoute, UserRoute } from './routes';

function App() {
  return (
    <ErrorProvider>
      <ErrorBoundary>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path='/login' element={<Login />} />
            {/* <Route path="/register" element={<Register />} /> */}

            {/* User routes */}
            <Route
              path='/'
              element={
                <UserRoute>
                  <Layout>
                    <Home />
                  </Layout>
                </UserRoute>
              }
            />
            <Route
              path='/iuran'
              element={
                <UserRoute>
                  <Layout>
                    <FeesList />
                  </Layout>
                </UserRoute>
              }
            />
            <Route
              path='/iuran/:id'
              element={
                <UserRoute>
                  <Layout>
                    <FeeDetail />
                  </Layout>
                </UserRoute>
              }
            />
            <Route
              path='/riwayat'
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
              path='/notifications'
              element={
                <UserRoute>
                  <Layout>
                    <Notifications />
                  </Layout>
                </UserRoute>
              }
            />
            <Route
              path='/profile'
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
              path='/payment/processing'
              element={
                <UserRoute>
                  <Layout>
                    <PaymentProcessing />
                  </Layout>
                </UserRoute>
              }
            />
            <Route
              path='/payment/success'
              element={
                <UserRoute>
                  <Layout>
                    <PaymentSuccess />
                  </Layout>
                </UserRoute>
              }
            />
            <Route
              path='/payment/pending'
              element={
                <UserRoute>
                  <Layout>
                    <PaymentPending />
                  </Layout>
                </UserRoute>
              }
            />
            <Route
              path='/payment/failed'
              element={
                <UserRoute>
                  <Layout>
                    <PaymentFailed />
                  </Layout>
                </UserRoute>
              }
            />
            <Route
              path='/payment/expired'
              element={
                <UserRoute>
                  <Layout>
                    <PaymentExpired />
                  </Layout>
                </UserRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path='/admin/dashboard'
              element={
                <AdminRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path='/admin/users'
              element={
                <AdminRoute>
                  <Layout>
                    <UserManagement />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path='/admin/fees'
              element={
                <AdminRoute>
                  <Layout>
                    <GenerateFees />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path='/admin/payments'
              element={
                <AdminRoute>
                  <Layout>
                    <PaymentReview />
                  </Layout>
                </AdminRoute>
              }
            />
            <Route
              path='/admin/broadcast'
              element={
                <AdminRoute>
                  <Layout>
                    <BroadcastNotification />
                  </Layout>
                </AdminRoute>
              }
            />

            {/* Unauthorized & Not Found */}
            <Route path='/unauthorized' element={<UnauthorizedPage />} />
            <Route path='*' element={<h1>404 - Not Found</h1>} />
          </Routes>
        </AuthProvider>
      </ErrorBoundary>
    </ErrorProvider>
  );
}

export default App;
