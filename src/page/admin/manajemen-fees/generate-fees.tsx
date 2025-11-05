import { Info, Receipt } from 'lucide-react';
import React from 'react';
import {
  AdminPageHeader,
  RegenerationHistory,
} from '../../../components/admin';
import FeeFormCard from '../../../components/admin/fees-manajement/FeeFormCard';
import TabsNav from '../../../components/admin/fees-manajement/TabsNav';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import ConfirmationDialog from '../../../components/ui/confirmation-dialog';
import { useGenerateFees } from '../../../hooks/useGenerateFees';

const GenerateFees: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    formData,
    setFormData,
    months,
    currentYear,
    isLoading,
    message,
    error,
    showConfirm,
    showRegenerateConfirm,
    handleGenerate,
    handleRegenerate,
    openRegenerateConfirm,
    openGenerateConfirm,
    setShowConfirm,
    setShowRegenerateConfirm,
  } = useGenerateFees();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'generate':
        return (
          <>
            {isLoading && (
              <div className='space-y-4 sm:space-y-6'>
                <div className='bg-white border border-gray-200 rounded-xl p-3 sm:p-4'>
                  <div className='space-y-3'>
                    <div className='h-4 bg-gray-200 rounded w-32'></div>
                    <div className='h-9 bg-gray-200 rounded w-full'></div>
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                      {[1, 2, 3].map(i => (
                        <div key={i} className='space-y-2'>
                          <div className='h-3 bg-gray-200 rounded w-24'></div>
                          <div className='h-9 bg-gray-200 rounded w-full'></div>
                        </div>
                      ))}
                    </div>
                    <div className='flex justify-end gap-2'>
                      <div className='h-9 bg-gray-200 rounded w-28'></div>
                      <div className='h-9 bg-gray-200 rounded w-32'></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <FeeFormCard
              isLoading={isLoading}
              message={message}
              error={error}
              months={months}
              currentYear={currentYear}
              formData={formData}
              setFormData={setFormData}
              onSubmit={openGenerateConfirm}
              onOpenRegenerate={openRegenerateConfirm}
            />

            {/* Info Card */}
            <Card className='hover:shadow-lg transition-all duration-300 border rounded-xl'>
              <CardHeader>
                <CardTitle className='text-xl text-gray-800'>
                  Informasi Generate Iuran
                </CardTitle>
                <CardDescription>
                  Detail mengenai proses generate iuran
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className='space-y-3 text-sm text-gray-600'>
                  {[
                    'Iuran akan dibuat untuk semua warga yang terdaftar berdasarkan tipe rumah mereka',
                    'Setiap tipe rumah memiliki tarif IPL yang berbeda (60M², 72M², Hook)',
                    'Warga dengan tipe rumah yang tidak dikenali akan dilewati',
                    'Setiap warga akan menerima notifikasi tentang iuran baru',
                    'Iuran akan memiliki status Belum Bayar secara default',
                    'Warga dapat melakukan pembayaran melalui metode yang tersedia',
                  ].map((item, i) => (
                    <li key={i} className='flex items-start gap-2'>
                      <Info className='h-4 w-4 text-blue-600 mt-0.5' />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </>
        );
      case 'history regenerate iuran':
        return <RegenerationHistory />;
      default:
        return null;
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 bg-gradient-to-br from-blue-50 to-indigo-100'>
      <AdminPageHeader
        title='Generate Iuran Bulanan'
        subtitle='Kelola iuran IPL Cluster Anda dengan mudah'
        icon={<Receipt className='w-5 h-5 md:w-6 md:h-6 text-white' />}
      />

      <div className='container mx-auto px-4 md:px-6 space-y-6'>
        <TabsNav
          activeTab={activeTab}
          setActiveTab={id => setActiveTab(id as any)}
        />
        {renderTabContent()}
      </div>

      <ConfirmationDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleGenerate}
        title='Konfirmasi Generate Iuran'
        description={`Iuran akan dibuat untuk semua warga pada bulan ${
          months.find(m => m.value === formData.bulan)?.label
        } ${currentYear}.`}
        confirmText={isLoading ? 'Memproses...' : 'Ya, Generate'}
        cancelText='Batal'
        isLoading={isLoading}
      />
      <ConfirmationDialog
        isOpen={showRegenerateConfirm}
        onClose={() => setShowRegenerateConfirm(false)}
        onConfirm={handleRegenerate}
        title='Konfirmasi Regenerate Iuran'
        description={`Regenerate akan menghapus iuran bulan ${
          months.find(m => m.value === formData.bulan)?.label
        } ${currentYear} dan membuat ulang berdasarkan tipe rumah terbaru.`}
        confirmText={isLoading ? 'Memproses...' : 'Ya, Regenerate'}
        cancelText='Batal'
        variant='warning'
        isLoading={isLoading}
      />
    </div>
  );
};

export default GenerateFees;
