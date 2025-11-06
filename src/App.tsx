import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import './css/main.css';
import Login from './page/auth/login/login';
// import Register from "./page/auth/register/register";
import { ErrorBoundary } from './components/common';
import { AuthProvider } from './context/auth.context';
import { ErrorProvider } from './context/error.context';
import { GlobalErrorProvider } from './context/global-error.context';
import { ToastProvider } from './context/toast.context';
import Layout from './layout/Layout';

// Lazy load admin pages untuk optimasi bundle
const Dashboard = lazy(() => import('./page/admin/dashboard/dashboard'));
const GenerateFees = lazy(
  () => import('./page/admin/manajemen-fees/generate-fees')
);
const UserManagement = lazy(
  () => import('./page/admin/manajemen-users/user-management')
);
const BroadcastNotification = lazy(
  () => import('./page/admin/notifications/broadcast-notifications')
);
const PaymentReview = lazy(
  () => import('./page/admin/payment-review/payment-review')
);

// Lazy load user pages
const FeeDetail = lazy(() => import('./page/user/fees/fee-detail'));
const FeesList = lazy(() => import('./page/user/fees/fees'));
const Home = lazy(() => import('./page/user/home/home'));
const Notifications = lazy(
  () => import('./page/user/notifications/notifications')
);
const PaymentHistory = lazy(
  () => import('./page/user/payments/payment-history')
);
const Profile = lazy(() => import('./page/user/profile/profile'));

// Lazy load payment status pages
const PaymentExpired = lazy(
  () => import('./page/user/payments/payment-expired')
);
const PaymentFailed = lazy(() => import('./page/user/payments/payment-failed'));
const PaymentPending = lazy(
  () => import('./page/user/payments/payment-pending')
);
const PaymentProcessing = lazy(
  () => import('./page/user/payments/payment-processing')
);
const PaymentSuccess = lazy(
  () => import('./page/user/payments/payment-success')
);

// error pages
import UnauthorizedPage from './page/unauthorized';

// proteksi
import { AdminRoute, UserRoute } from './routes';

// Loading fallback component
const LoadingFallback = () => (
  <div className='min-h-screen flex items-center justify-center'>
    <div className='text-center'>
      <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600'></div>
      <p className='mt-2 text-gray-600'>Memuat...</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorProvider>
      <ToastProvider>
        <GlobalErrorProvider>
          <ErrorBoundary>
            <AuthProvider>
              <Suspense fallback={<LoadingFallback />}>
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
              </Suspense>
            </AuthProvider>
          </ErrorBoundary>
        </GlobalErrorProvider>
      </ToastProvider>
    </ErrorProvider>
  );
}

export default App;
