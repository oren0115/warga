import { User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalError } from '../../../context/global-error.context';
import { useToast } from '../../../context/toast.context';
import { userService } from '../../../services/user.service';
import type { Fee } from '../../../types';
import {
  getToastDuration,
  isLightweightError,
} from '../../../utils/error-handling.utils';

// shadcn/ui
import {
  EmptyState,
  ErrorState,
  FeeCard,
  LoadingSpinner,
  PageHeader,
  PageLayout,
} from '../../../components/user';
import NotificationPopup from '../../../components/user/notification/NotificationPopup';

const IuranList: React.FC = () => {
  const navigate = useNavigate();
  const [fees, setFees] = useState<Fee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [notificationRefreshKey, setNotificationRefreshKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { showError } = useToast();
  const { setGlobalError } = useGlobalError();
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const feesData = await userService.getFees();
      setFees(feesData);
      setError(null);
    } catch (err: any) {
      const message =
        err?.errorMapping?.userMessage || err?.message || 'Gagal memuat data';
      setError(message);
      // Gunakan toast untuk error ringan, banner untuk error kritis
      if (isLightweightError(err)) {
        showError(message, getToastDuration(err));
      } else {
        setGlobalError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationRead = () => {
    setNotificationRefreshKey(prev => prev + 1);
    // This will trigger NotificationBadge to refresh its data
  };

  if (isLoading) {
    return <LoadingSpinner message='Memuat data...' />;
  }

  if (error) {
    return (
      <ErrorState message={error || 'Terjadi kesalahan'} onRetry={fetchData} />
    );
  }

  return (
    <PageLayout>
      {/* Header */}
      <PageHeader
        title='Daftar Iuran'
        subtitle='Kelola pembayaran iuran IPL Anda'
        icon={<User className='w-5 h-5 md:w-6 md:h-6 text-white' />}
        showNotification={true}
        onNotificationClick={() => setShowNotificationPopup(true)}
        notificationRefreshKey={notificationRefreshKey}
      />

      {/* Notifikasi Popup */}
      <NotificationPopup
        isOpen={showNotificationPopup}
        onClose={() => setShowNotificationPopup(false)}
        onNotificationRead={handleNotificationRead}
      />

      {/* Daftar Iuran */}
      <div className='p-4 space-y-6 -mt-2'>
        {fees.length > 0 ? (
          <div className='space-y-6'>
            {fees.map(fee => (
              <FeeCard
                key={fee.id}
                fee={fee}
                onPay={feeId => navigate(`/iuran/${feeId}`)}
                onView={feeId => navigate(`/iuran/${feeId}`)}
                showDueDate={true}
                showPaymentButton={true}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title='Belum Ada Iuran'
            description='Iuran akan muncul setelah admin membuatnya'
            type='info'
          />
        )}
      </div>
    </PageLayout>
  );
};

export default IuranList;
