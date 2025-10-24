import { AlertTriangle, History, Info, Receipt } from 'lucide-react';
import React, { useState } from 'react';
import {
  AdminPageHeader,
  RegenerationHistory,
} from '../../../components/admin';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '../../../components/ui/alert';
import { Button } from '../../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Skeleton } from '../../../components/ui/skeleton';
import { adminService } from '../../../services/admin.service';

const GenerateFees: React.FC = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const [formData, setFormData] = useState({
    bulan: '',
    tarif_60m2: 0,
    tarif_72m2: 0,
    tarif_hook: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);

  const currentYear = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
  ).getFullYear();

  const months = [
    { value: '1', label: 'Januari' },
    { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' },
    { value: '4', label: 'April' },
    { value: '5', label: 'Mei' },
    { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' },
    { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
  ];

  const tabs = [
    {
      id: 'generate',
      label: 'Generate Iuran',
      icon: <Receipt className='w-4 h-4' />,
      description: 'Buat iuran baru untuk semua warga',
    },
    {
      id: 'history regenerate iuran',
      label: 'Riwayat Regenerate Iuran',
      icon: <History className='w-4 h-4' />,
      description: 'Lihat dan kelola history regenerate iuran',
    },
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      // Convert bulan to YYYY-MM format
      const bulanFormatted = `${currentYear}-${formData.bulan.padStart(
        2,
        '0'
      )}`;
      const requestData = {
        ...formData,
        bulan: bulanFormatted,
      };

      await adminService.generateFees(requestData);
      setMessage('✅ Iuran berhasil dibuat untuk semua warga');
      setFormData({
        bulan: '',
        tarif_60m2: 0,
        tarif_72m2: 0,
        tarif_hook: 0,
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Gagal membuat iuran');
    } finally {
      setIsLoading(false);
      setShowConfirm(false);
    }
  };

  const handleRegenerate = async () => {
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      // Convert bulan to YYYY-MM format
      const bulanFormatted = `${currentYear}-${formData.bulan.padStart(
        2,
        '0'
      )}`;
      const requestData = {
        ...formData,
        bulan: bulanFormatted,
      };

      await adminService.regenerateFees(requestData);
      setMessage('✅ Iuran berhasil dibuat ulang berdasarkan tipe rumah warga');
      setFormData({
        bulan: '',
        tarif_60m2: 0,
        tarif_72m2: 0,
        tarif_hook: 0,
      });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Gagal membuat ulang iuran');
    } finally {
      setIsLoading(false);
      setShowRegenerateConfirm(false);
    }
  };

  const handleRegenerateClick = () => {
    if (!formData.bulan) {
      setError('Bulan harus dipilih');
      return;
    }
    if (
      formData.tarif_60m2 <= 0 ||
      formData.tarif_72m2 <= 0 ||
      formData.tarif_hook <= 0
    ) {
      setError('Semua tarif harus diisi dengan nilai yang valid');
      return;
    }
    setShowRegenerateConfirm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bulan) {
      setError('Bulan harus dipilih');
      return;
    }
    if (
      formData.tarif_60m2 <= 0 ||
      formData.tarif_72m2 <= 0 ||
      formData.tarif_hook <= 0
    ) {
      setError('Semua tarif harus diisi dengan nilai yang valid');
      return;
    }
    setShowConfirm(true);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'generate':
        return (
          <>
            {/* Form Card */}
            <Card className='hover:shadow-lg transition-all duration-300 border rounded-xl mb-4'>
              <CardHeader>
                <CardTitle className='text-xl text-gray-800'>
                  Buat Iuran Baru
                </CardTitle>
                <CardDescription>
                  Pilih bulan untuk membuat iuran semua warga
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className='space-y-6'>
                    {/* Form Skeleton */}
                    <div className='space-y-2'>
                      <Skeleton className='h-4 w-20' />
                      <Skeleton className='h-10 w-full' />
                      <Skeleton className='h-3 w-64' />
                    </div>

                    {/* Tarif Section Skeleton */}
                    <div className='space-y-4'>
                      <div>
                        <Skeleton className='h-6 w-48 mb-3' />
                        <Skeleton className='h-4 w-64' />
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        {[1, 2, 3].map(i => (
                          <div key={i} className='space-y-2'>
                            <Skeleton className='h-4 w-32' />
                            <Skeleton className='h-10 w-full' />
                            <Skeleton className='h-3 w-40' />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Alert Skeleton */}
                    <div className='bg-gray-50 border border-gray-200 rounded-lg p-4'>
                      <div className='flex items-start space-x-3'>
                        <Skeleton className='h-4 w-4 mt-1' />
                        <div className='space-y-2 flex-1'>
                          <Skeleton className='h-4 w-20' />
                          <Skeleton className='h-3 w-full' />
                          <Skeleton className='h-3 w-3/4' />
                        </div>
                      </div>
                    </div>

                    {/* Buttons Skeleton */}
                    <div className='flex justify-end gap-3'>
                      <Skeleton className='h-10 w-32' />
                      <Skeleton className='h-10 w-32' />
                    </div>
                  </div>
                ) : (
                  <>
                    {message && (
                      <Alert className='mb-4 bg-green-50 border-green-200'>
                        <Info className='h-4 w-4 text-green-600' />
                        <AlertTitle className='text-green-700'>
                          Berhasil
                        </AlertTitle>
                        <AlertDescription className='text-green-700'>
                          {message}
                        </AlertDescription>
                      </Alert>
                    )}

                    {error && (
                      <Alert className='mb-4 bg-red-50 border-red-200'>
                        <AlertTriangle className='h-4 w-4 text-red-600' />
                        <AlertTitle className='text-red-700'>Error</AlertTitle>
                        <AlertDescription className='text-red-700'>
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}

                    <form onSubmit={handleSubmit} className='space-y-6'>
                      <div className='space-y-2'>
                        <Label htmlFor='bulan'>Pilih Bulan</Label>
                        <Select
                          value={formData.bulan}
                          onValueChange={(val: string) =>
                            setFormData(prev => ({ ...prev, bulan: val }))
                          }
                        >
                          <SelectTrigger id='bulan' className='cursor-pointer'>
                            <SelectValue placeholder='-- Pilih Bulan --' />
                          </SelectTrigger>
                          <SelectContent>
                            {months.map(m => (
                              <SelectItem
                                key={m.value}
                                value={m.value}
                                className='cursor-pointer'
                              >
                                {m.label} {currentYear}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className='text-xs text-gray-500'>
                          Iuran akan dibuat untuk semua warga yang terdaftar
                        </p>
                      </div>

                      {/* Tarif per Tipe Rumah */}
                      <div className='space-y-4'>
                        <div>
                          <h3 className='text-lg font-semibold text-gray-800 mb-3'>
                            Tarif IPL per Tipe Rumah
                          </h3>
                          <p className='text-sm text-gray-600 mb-4'>
                            Masukkan tarif IPL untuk setiap tipe rumah
                          </p>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                          <div className='space-y-2'>
                            <Label htmlFor='tarif_60m2'>Tarif Rumah 60M²</Label>
                            <div className='relative'>
                              <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm'>
                                Rp
                              </span>
                              <Input
                                id='tarif_60m2'
                                type='number'
                                value={formData.tarif_60m2 || ''}
                                onChange={e =>
                                  setFormData(prev => ({
                                    ...prev,
                                    tarif_60m2: parseInt(e.target.value) || 0,
                                  }))
                                }
                                className='pl-10'
                                placeholder='0'
                                min='0'
                              />
                            </div>
                            <p className='text-xs text-gray-500'>
                              Tarif untuk rumah tipe 60M²
                            </p>
                          </div>

                          <div className='space-y-2'>
                            <Label htmlFor='tarif_72m2'>Tarif Rumah 72M²</Label>
                            <div className='relative'>
                              <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm'>
                                Rp
                              </span>
                              <Input
                                id='tarif_72m2'
                                type='number'
                                value={formData.tarif_72m2 || ''}
                                onChange={e =>
                                  setFormData(prev => ({
                                    ...prev,
                                    tarif_72m2: parseInt(e.target.value) || 0,
                                  }))
                                }
                                className='pl-10'
                                placeholder='0'
                                min='0'
                              />
                            </div>
                            <p className='text-xs text-gray-500'>
                              Tarif untuk rumah tipe 72M²
                            </p>
                          </div>

                          <div className='space-y-2'>
                            <Label htmlFor='tarif_hook'>Tarif Rumah Hook</Label>
                            <div className='relative'>
                              <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm'>
                                Rp
                              </span>
                              <Input
                                id='tarif_hook'
                                type='number'
                                value={formData.tarif_hook || ''}
                                onChange={e =>
                                  setFormData(prev => ({
                                    ...prev,
                                    tarif_hook: parseInt(e.target.value) || 0,
                                  }))
                                }
                                className='pl-10'
                                placeholder='0'
                                min='0'
                              />
                            </div>
                            <p className='text-xs text-gray-500'>
                              Tarif untuk rumah tipe Hook
                            </p>
                          </div>
                        </div>
                      </div>

                      <Alert className='bg-yellow-50 border-yellow-200'>
                        <AlertTriangle className='h-4 w-4 text-yellow-600' />
                        <AlertTitle className='text-yellow-800'>
                          Perhatian
                        </AlertTitle>
                        <AlertDescription className='text-yellow-700'>
                          Pastikan Anda memilih bulan yang benar dan mengisi
                          tarif yang sesuai. Proses ini akan membuat iuran untuk
                          semua warga yang terdaftar berdasarkan tipe rumah
                          mereka.
                        </AlertDescription>
                      </Alert>

                      <div className='flex justify-end gap-3'>
                        <Button
                          type='button'
                          variant='outline'
                          onClick={handleRegenerateClick}
                          className='px-6 py-2 cursor-pointer'
                          disabled={isLoading || !formData.bulan}
                        >
                          {isLoading ? 'Memproses...' : 'Regenerate Iuran'}
                        </Button>
                        <Button
                          type='submit'
                          className='bg-green-600 hover:bg-green-700 text-white px-6 py-2 cursor-pointer'
                          disabled={isLoading}
                        >
                          {isLoading ? 'Memproses...' : 'Generate Iuran'}
                        </Button>
                      </div>
                    </form>
                  </>
                )}
              </CardContent>
            </Card>

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
        {/* Tab Navigation */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
          {/* Mobile Tab Navigation */}
          <div className='block sm:hidden'>
            <div className='border-b border-gray-200'>
              <nav
                className='flex overflow-x-auto scrollbar-hide'
                aria-label='Tabs'
              >
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600 bg-green-50'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } flex-shrink-0 py-3 px-4 border-b-2 font-medium text-sm flex items-center gap-2 min-w-fit`}
                  >
                    {tab.icon}
                    <span className='hidden xs:inline'>{tab.label}</span>
                    <span className='xs:hidden'>{tab.label.split(' ')[0]}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Desktop Tab Navigation */}
          <div className='hidden sm:block'>
            <div className='border-b border-gray-200'>
              <nav className='flex space-x-8 px-6' aria-label='Tabs'>
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600 cursor-pointer'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Description */}
          <div className='px-4 sm:px-6 py-3 bg-gray-50 border-b border-gray-200'>
            <p className='text-sm text-gray-600'>
              {tabs.find(tab => tab.id === activeTab)?.description}
            </p>
          </div>

          {/* Tab Content */}
          <div className='p-4 sm:p-6'>{renderTabContent()}</div>
        </div>
      </div>

      {/* Modal Konfirmasi */}
      {showConfirm && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/40 z-50'>
          <div className='bg-white p-6 rounded-xl shadow-lg max-w-md w-full'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>
              Konfirmasi Generate Iuran
            </h3>

            <div className='space-y-4 mb-6'>
              <div className='bg-gray-50 p-3 rounded-lg'>
                <p className='text-sm font-medium text-gray-700 mb-2'>
                  Bulan:{' '}
                  <span className='font-semibold'>
                    {months.find(m => m.value === formData.bulan)?.label}{' '}
                    {currentYear}
                  </span>
                </p>
              </div>

              <div className='space-y-2'>
                <p className='text-sm font-medium text-gray-700'>
                  Tarif per Tipe Rumah:
                </p>
                <div className='space-y-1 text-sm text-gray-600'>
                  <div className='flex justify-between'>
                    <span>Rumah 60M²:</span>
                    <span className='font-medium'>
                      Rp {formData.tarif_60m2.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Rumah 72M²:</span>
                    <span className='font-medium'>
                      Rp {formData.tarif_72m2.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Rumah Hook:</span>
                    <span className='font-medium'>
                      Rp {formData.tarif_hook.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <Alert className='bg-blue-50 border-blue-200'>
                <Info className='h-4 w-4 text-blue-600' />
                <AlertDescription className='text-blue-700 text-sm'>
                  Iuran akan dibuat untuk semua warga berdasarkan tipe rumah
                  mereka.
                </AlertDescription>
              </Alert>
            </div>

            <div className='flex justify-end gap-3'>
              <Button
                variant='outline'
                onClick={() => setShowConfirm(false)}
                className='px-4 hover:bg-red-600 cursor-pointer'
              >
                Batal
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={isLoading}
                className='hover:bg-green-900 cursor-pointer'
              >
                {isLoading ? 'Memproses...' : 'Ya, Generate'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Regenerate */}
      {showRegenerateConfirm && (
        <div className='fixed inset-0 flex items-center justify-center bg-black/40 z-50'>
          <div className='bg-white p-6 rounded-xl shadow-lg max-w-md w-full'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>
              Konfirmasi Regenerate Iuran
            </h3>

            <div className='space-y-4 mb-6'>
              <div className='bg-gray-50 p-3 rounded-lg'>
                <p className='text-sm font-medium text-gray-700 mb-2'>
                  Bulan:{' '}
                  <span className='font-semibold'>
                    {months.find(m => m.value === formData.bulan)?.label}{' '}
                    {currentYear}
                  </span>
                </p>
              </div>

              <div className='space-y-2'>
                <p className='text-sm font-medium text-gray-700'>
                  Tarif per Tipe Rumah:
                </p>
                <div className='space-y-1 text-sm text-gray-600'>
                  <div className='flex justify-between'>
                    <span>Rumah 60M²:</span>
                    <span className='font-medium'>
                      Rp {formData.tarif_60m2.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Rumah 72M²:</span>
                    <span className='font-medium'>
                      Rp {formData.tarif_72m2.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Rumah Hook:</span>
                    <span className='font-medium'>
                      Rp {formData.tarif_hook.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <Alert className='bg-orange-50 border-orange-200'>
                <AlertTriangle className='h-4 w-4 text-orange-600' />
                <AlertDescription className='text-orange-700 text-sm'>
                  <strong>Peringatan:</strong> Regenerate akan menghapus semua
                  iuran yang sudah ada untuk bulan ini dan membuat ulang
                  berdasarkan tipe rumah warga yang terbaru.
                </AlertDescription>
              </Alert>
            </div>

            <div className='flex justify-end gap-3'>
              <Button
                onClick={() => setShowRegenerateConfirm(false)}
                className='px-4 hover:bg-red-600 cursor-pointer'
              >
                Batal
              </Button>
              <Button
                onClick={handleRegenerate}
                disabled={isLoading}
                className='bg-orange-600 hover:bg-orange-700 text-white cursor-pointer'
              >
                {isLoading ? 'Memproses...' : 'Ya, Regenerate'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateFees;
