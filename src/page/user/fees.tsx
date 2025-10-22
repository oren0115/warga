import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/user.service";
import type { Fee } from "../../types";
import { User } from "lucide-react";

// shadcn/ui
import NotificationPopup from "../../components/NotificationPopup";
import {
  PageHeader,
  LoadingSpinner,
  ErrorState,
  EmptyState,
  FeeCard,
  PageLayout,
} from "../../components/common";

const IuranList: React.FC = () => {
  const navigate = useNavigate();
  const [fees, setFees] = useState<Fee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [notificationRefreshKey, setNotificationRefreshKey] = useState(0);
  const [error] = useState<string | null>(null);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const feesData = await userService.getFees();
      setFees(feesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationRead = () => {
    setNotificationRefreshKey((prev) => prev + 1);
    // This will trigger NotificationBadge to refresh its data
  };

  if (isLoading) {
    return <LoadingSpinner message="Memuat data..." />;
  }

  if (error) {
    return (
      <ErrorState message={error || "Terjadi kesalahan"} onRetry={fetchData} />
    );
  }

  return (
    <PageLayout>
      {/* Header */}
      <PageHeader
        title="Daftar Iuran"
        subtitle="Kelola pembayaran iuran IPL Anda"
        icon={<User className="w-5 h-5 md:w-6 md:h-6 text-white" />}
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
      <div className="p-4 space-y-6 -mt-2">
        {fees.length > 0 ? (
          <div className="space-y-6">
            {fees.map((fee) => (
              <FeeCard
                key={fee.id}
                fee={fee}
                onPay={(feeId) => navigate(`/iuran/${feeId}`)}
                onView={(feeId) => navigate(`/iuran/${feeId}`)}
                showDueDate={true}
                showPaymentButton={true}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Belum Ada Iuran"
            description="Iuran akan muncul setelah admin membuatnya"
            type="info"
          />
        )}
      </div>
    </PageLayout>
  );
};

export default IuranList;
