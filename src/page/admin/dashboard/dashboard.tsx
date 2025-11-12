import React from 'react';

import { BarChart3, LogOut, Receipt, User2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Progress } from '../../../components/ui/progress';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../components/ui/tabs';

import {
  AdminPageHeader,
  UserPaymentStatusCard,
} from '../../../components/admin';
import ChartsSection from '../../../components/admin/dashboard/ChartsSection';
import OverviewStatsGrid from '../../../components/admin/dashboard/OverviewStatsGrid';
import PaymentsStatsSection from '../../../components/admin/dashboard/PaymentsStatsSection';
import { useAdminDashboard } from '../../../hooks/useAdminDashboard';

const Dashboard: React.FC = () => {
  const {
    stats,
    isLoading,
    monthlyFees,
    paymentStatus,
    chartZoom,
    handleLogout,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
  } = useAdminDashboard();

  // Mobile logout button component
  const MobileLogoutButton = () => (
    <Button
      onClick={handleLogout}
      variant='outline'
      size='sm'
      className='bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white lg:hidden'
    >
      <LogOut className='w-4 h-4 mr-1' />
      <span className='hidden sm:inline'>Logout</span>
    </Button>
  );

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 p-4 sm:p-6'>
        <div className='max-w-6xl mx-auto space-y-4 sm:space-y-6'>
          {/* Header skeleton */}
          <div className='bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-4 sm:p-5 text-white'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 bg-white/30 rounded-lg'></div>
                <div className='space-y-2'>
                  <div className='h-4 bg-white/30 rounded w-40 sm:w-64'></div>
                  <div className='h-3 bg-white/20 rounded w-56 sm:w-80'></div>
                </div>
              </div>
              <div className='h-8 w-20 bg-white/20 rounded lg:hidden'></div>
            </div>
          </div>

          {/* Tabs skeleton */}
          <div className='bg-white/80 rounded-xl border border-gray-200 p-2'>
            <div className='grid grid-cols-3 gap-2'>
              {[1, 2, 3].map(i => (
                <div key={i} className='h-9 bg-gray-200 rounded'></div>
              ))}
            </div>
          </div>

          {/* Overview stats skeleton */}
          <div className='grid grid-cols-2 gap-3 sm:gap-4'>
            {[1, 2].map(i => (
              <div
                key={i}
                className='bg-white border border-gray-200 rounded-xl p-3 sm:p-4'
              >
                <div className='flex items-center justify-between'>
                  <div className='space-y-2 w-2/3'>
                    <div className='h-3 bg-gray-200 rounded w-24'></div>
                    <div className='h-6 bg-gray-200 rounded w-16'></div>
                  </div>
                  <div className='w-9 h-9 bg-gray-100 rounded-xl'></div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress card skeleton */}
          <div className='bg-white border border-gray-200 rounded-2xl p-4'>
            <div className='space-y-3'>
              <div className='h-4 bg-gray-200 rounded w-40'></div>
              <div className='h-3 bg-gray-100 rounded w-56'></div>
              <div className='flex items-center justify-between'>
                <div className='h-3 bg-gray-200 rounded w-32'></div>
                <div className='h-3 bg-gray-200 rounded w-10'></div>
              </div>
              <div className='h-4 bg-gray-100 rounded-full w-full'></div>
              <div className='h-3 bg-gray-100 rounded w-40'></div>
            </div>
          </div>

          {/* Charts skeleton */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
            {[1, 2].map(i => (
              <div
                key={i}
                className='bg-white border border-gray-200 rounded-2xl p-4 h-72'
              >
                <div className='space-y-2 mb-3'>
                  <div className='h-4 bg-gray-200 rounded w-40'></div>
                  <div className='h-3 bg-gray-100 rounded w-56'></div>
                </div>
                <div className='h-full bg-gray-50 rounded'></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-2'>
      {/* Header */}
      <AdminPageHeader
        title='Selamat Datang, Admin!'
        subtitle='Dashboard Manajemen IPL Cluster Cannary'
        icon={<User2 className='w-5 h-5 md:w-6 md:h-6 text-white' />}
        rightAction={<MobileLogoutButton />}
      />


      {stats && (
        <>
          <div className='container mx-auto px-4 md:px-6 space-y-6'>
            {/* Tab-based Stats Navigation */}
            <Tabs defaultValue='overview' className='w-full'>
              <TabsList className='grid w-full grid-cols-3 mb-6 bg-white/80 backdrop-blur-sm '>
                <TabsTrigger
                  value='overview'
                  className='flex cursor-pointer items-center gap-2 data-[state=active]:bg-green-200'
                >
                  <User2 className='w-4 h-4' />
                  <span className='hidden sm:inline'>Overview</span>
                </TabsTrigger>
                <TabsTrigger
                  value='payments'
                  className='flex cursor-pointer items-center gap-2 data-[state=active]:bg-green-200'
                >
                  <Receipt className='w-4 h-4' />
                  <span className='hidden sm:inline'>Payments</span>
                </TabsTrigger>
                <TabsTrigger
                  value='analytics'
                  className='flex cursor-pointer items-center gap-2 data-[state=active]:bg-green-200'
                >
                  <BarChart3 className='w-4 h-4' />
                  <span className='hidden sm:inline'>Analytics</span>
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value='overview' className='space-y-6'>
                <OverviewStatsGrid
                  totalUsers={stats.totalUsers}
                  totalFees={stats.totalFees}
                />

                {/* Status Pengumpulan */}
                <Card className='rounded-2xl shadow-md hover:shadow-xl transition mb-4'>
                  <CardHeader>
                    <CardTitle>Status Pengumpulan Bulan Ini</CardTitle>
                    <CardDescription>
                      Progress iuran warga bulan berjalan
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='flex justify-between items-center mb-3'>
                      <span className='text-gray-600'>
                        {`Rp ${
                          stats.currentMonthCollection?.toLocaleString() || 0
                        }`}{' '}
                        terkumpul
                      </span>
                      <span className='text-sm font-semibold text-gray-700'>
                        {stats.collectionRate}%
                      </span>
                    </div>
                    <Progress
                      value={stats.collectionRate}
                      className='h-4 rounded-full'
                    />
                    <p className='text-xs text-gray-500 mt-2'>
                      Target pengumpulan iuran bulan ini
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Payments Tab */}
              <TabsContent value='payments' className='space-y-6'>
                <PaymentsStatsSection
                  approvedPayments={stats.approvedPayments}
                  pendingPayments={stats.pendingPayments}
                  unpaidFees={stats.unpaidFees || 0}
                />

                {/* Users Payment Status */}
                <UserPaymentStatusCard />
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value='analytics' className='space-y-6'>
                <ChartsSection
                  monthlyFees={monthlyFees}
                  paymentStatus={paymentStatus}
                  chartZoom={chartZoom}
                  onZoomIn={handleZoomIn}
                  onZoomOut={handleZoomOut}
                  onResetZoom={handleResetZoom}
                />
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
