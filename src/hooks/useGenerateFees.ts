import { useCallback, useMemo, useState } from 'react';
import { adminService } from '../services/admin.service';
import { getServiceDownMessage } from '../utils/network-error.utils';

export type ActiveTab = 'generate' | 'history regenerate iuran';

export interface FeeFormData {
  bulan: string;
  tarif_60m2: number;
  tarif_72m2: number;
  tarif_hook: number;
}

export function useGenerateFees() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('generate');
  const [formData, setFormData] = useState<FeeFormData>({
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

  const currentYear = useMemo(() => {
    return new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
    ).getFullYear();
  }, []);

  const months = useMemo(
    () => [
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
    ],
    []
  );

  const clearStatus = useCallback(() => {
    setError('');
    setMessage('');
  }, []);

  const validateForm = useCallback((): string => {
    if (!formData.bulan) return 'Bulan harus dipilih';
    if (
      formData.tarif_60m2 <= 0 ||
      formData.tarif_72m2 <= 0 ||
      formData.tarif_hook <= 0
    ) {
      return 'Semua tarif harus diisi dengan nilai yang valid';
    }
    return '';
  }, [formData]);

  const formatBulan = useCallback(
    () => `${currentYear}-${formData.bulan.padStart(2, '0')}`,
    [currentYear, formData.bulan]
  );

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    clearStatus();
    try {
      const bulanFormatted = formatBulan();
      const requestData = { ...formData, bulan: bulanFormatted };
      await adminService.generateFees(requestData);
      setMessage('✅ Iuran berhasil dibuat untuk semua warga');
      setFormData({ bulan: '', tarif_60m2: 0, tarif_72m2: 0, tarif_hook: 0 });
    } catch (err: any) {
      setError(getServiceDownMessage(err, 'Gagal membuat iuran'));
    } finally {
      setIsLoading(false);
      setShowConfirm(false);
    }
  }, [clearStatus, formatBulan, formData]);

  const handleRegenerate = useCallback(async () => {
    setIsLoading(true);
    clearStatus();
    try {
      const bulanFormatted = formatBulan();
      const requestData = { ...formData, bulan: bulanFormatted };
      await adminService.regenerateFees(requestData);
      setMessage('✅ Iuran berhasil dibuat ulang berdasarkan tipe rumah warga');
      setFormData({ bulan: '', tarif_60m2: 0, tarif_72m2: 0, tarif_hook: 0 });
    } catch (err: any) {
      setError(getServiceDownMessage(err, 'Gagal membuat ulang iuran'));
    } finally {
      setIsLoading(false);
      setShowRegenerateConfirm(false);
    }
  }, [clearStatus, formatBulan, formData]);

  const openRegenerateConfirm = useCallback(() => {
    const err = validateForm();
    if (err) {
      setError(err);
      return;
    }
    setShowRegenerateConfirm(true);
  }, [validateForm]);

  const openGenerateConfirm = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const err = validateForm();
      if (err) {
        setError(err);
        return;
      }
      setShowConfirm(true);
    },
    [validateForm]
  );

  return {
    // data
    activeTab,
    setActiveTab,
    formData,
    setFormData,
    months,
    currentYear,
    // ui state
    isLoading,
    message,
    error,
    showConfirm,
    showRegenerateConfirm,
    // actions
    handleGenerate,
    handleRegenerate,
    openRegenerateConfirm,
    openGenerateConfirm,
    setShowConfirm,
    setShowRegenerateConfirm,
  };
}
