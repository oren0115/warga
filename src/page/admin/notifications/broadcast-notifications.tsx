import React from 'react';

// shadcn + lucide
import { Bell } from 'lucide-react';
import { AdminPageHeader } from '../../../components/admin';
import BroadcastFormCard from '../../../components/admin/broadcast/BroadcastFormCard';
import TelegramStatusCard from '../../../components/admin/broadcast/TelegramStatusCard';
import { useBroadcastNotifications } from '../../../hooks/useBroadcastNotifications';

const BroadcastNotification: React.FC = () => {
  const {
    formData,
    setFormData,
    telegramStatus,
    broadcastResult,
    isLoading,
    isTestingTelegram,
    message,
    error,
    handleSubmit,
    testTelegramConnection,
  } = useBroadcastNotifications();

  return (
    <div className='min-h-screen bg-gray-50 bg-gradient-to-br from-blue-50 to-indigo-100'>
      {/* Header */}
      <AdminPageHeader
        title='Broadcast Notifikasi'
        subtitle='Kirim notifikasi ke semua pengguna dalam sistem'
        icon={<Bell className='w-5 h-5 md:w-6 md:h-6 text-white' />}
      />

      <div className='container mx-auto px-4 md:px-6 space-y-6 pb-10 md:pb-16'>
        <TelegramStatusCard
          telegramStatus={telegramStatus}
          isTestingTelegram={isTestingTelegram}
          onTest={testTelegramConnection}
        />

        <BroadcastFormCard
          isLoading={isLoading}
          formData={formData}
          setFormData={setFormData}
          message={message}
          error={error}
          broadcastResult={broadcastResult}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default BroadcastNotification;
