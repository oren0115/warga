import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Filter,
  Home,
  Phone,
  Users,
  UserX,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/admin.service';
import { websocketService } from '../../services/websocket.service';
import type { PaidUser, UnpaidUser } from '../../types';
import { formatCurrency, formatDate } from '../../utils/format.utils';
import { formatAbsoluteTime } from '../../utils/timezone.utils';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Skeleton } from '../ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface UserPaymentStatusCardProps {
  className?: string;
}

type FilterType = 'all' | 'normal' | 'orphaned';

const UserPaymentStatusCard: React.FC<UserPaymentStatusCardProps> = ({
  className = '',
}) => {
  const [paidUsers, setPaidUsers] = useState<PaidUser[]>([]);
  const [unpaidUsers, setUnpaidUsers] = useState<UnpaidUser[]>([]);
  const [filteredPaidUsers, setFilteredPaidUsers] = useState<PaidUser[]>([]);
  const [filteredUnpaidUsers, setFilteredUnpaidUsers] = useState<UnpaidUser[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [filter, setFilter] = useState<FilterType>('all');

  // Generate available months (last 12 months)
  const generateAvailableMonths = () => {
    const months = [];
    // Use Jakarta timezone to get correct current month
    const now = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
    );

    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

      // Create month string manually to avoid timezone issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Convert to 1-based and pad
      const monthStr = `${year}-${month}`;

      // Create label manually
      const monthNames = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
      ];
      const monthLabel = `${monthNames[date.getMonth()]} ${year}`;

      months.push({ value: monthStr, label: monthLabel });
    }

    return months;
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'bank_transfer':
        return <CreditCard className='w-4 h-4' />;
      case 'gopay':
      case 'shopeepay':
      case 'qris':
        return <CreditCard className='w-4 h-4' />;
      default:
        return <CreditCard className='w-4 h-4' />;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method.toLowerCase()) {
      case 'bank_transfer':
        return 'Transfer Bank';
      case 'gopay':
        return 'GoPay';
      case 'shopeepay':
        return 'ShopeePay';
      case 'qris':
        return 'QRIS';
      default:
        return method || 'N/A';
    }
  };

  const safeFormatDate = (dateString: string): string => {
    if (
      !dateString ||
      dateString.trim() === '' ||
      dateString === '""' ||
      dateString === 'null'
    ) {
      return 'Tanggal tidak tersedia';
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Tanggal tidak valid';
    }

    return formatDate(dateString);
  };

  // Set default month to current month
  useEffect(() => {
    const months = generateAvailableMonths();
    setSelectedMonth(months[0].value); // Set to current month
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      fetchUsers();
    }
  }, [selectedMonth]);

  // Listen for real-time updates
  useEffect(() => {
    const handleDashboardUpdate = () => {
      // Refresh users when dashboard updates
      if (selectedMonth) {
        fetchUsers();
      }
    };

    websocketService.onDashboardUpdate(handleDashboardUpdate);

    return () => {
      // Cleanup handled by service
    };
  }, [selectedMonth]);

  // Filter users based on selected filter
  useEffect(() => {
    let filteredPaid = paidUsers;
    let filteredUnpaid = unpaidUsers;

    switch (filter) {
      case 'normal':
        filteredPaid = paidUsers.filter(user => !user.is_orphaned);
        filteredUnpaid = unpaidUsers.filter(user => !user.is_orphaned);
        break;
      case 'orphaned':
        filteredPaid = paidUsers.filter(user => user.is_orphaned);
        filteredUnpaid = unpaidUsers.filter(user => user.is_orphaned);
        break;
      case 'all':
      default:
        filteredPaid = paidUsers;
        filteredUnpaid = unpaidUsers;
        break;
    }

    setFilteredPaidUsers(filteredPaid);
    setFilteredUnpaidUsers(filteredUnpaid);
  }, [paidUsers, unpaidUsers, filter]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [paidResponse, unpaidResponse] = await Promise.all([
        adminService.getPaidUsers(selectedMonth),
        adminService.getUnpaidUsers(selectedMonth),
      ]);
      setPaidUsers(paidResponse);
      setUnpaidUsers(unpaidResponse);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          'Gagal memuat data pembayaran warga'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderUserCard = (user: PaidUser | UnpaidUser, isPaid: boolean) => {
    const isOrphaned = user.is_orphaned;

    return (
      <Card
        key={user.user_id}
        className={`transition-all duration-200 hover:shadow-md ${
          isOrphaned ? 'border-orange-200 bg-orange-50/50' : 'border-gray-200'
        }`}
      >
        <CardContent className='p-4'>
          <div className='flex items-start justify-between'>
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-2 mb-2'>
                <h3 className='font-semibold text-gray-900 truncate'>
                  {user.nama}
                </h3>
                {isOrphaned && (
                  <Badge
                    variant='outline'
                    className='text-orange-600 border-orange-300'
                  >
                    <UserX className='w-3 h-3 mr-1' />
                    Orphaned
                  </Badge>
                )}
                {isPaid && (
                  <Badge
                    variant='outline'
                    className='text-green-600 border-green-300'
                  >
                    <CheckCircle2 className='w-3 h-3 mr-1' />
                    Paid
                  </Badge>
                )}
              </div>

              <div className='space-y-1 text-sm text-gray-600'>
                <div className='flex items-center gap-2'>
                  <Home className='w-4 h-4' />
                  <span className='truncate'>{user.nomor_rumah}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Phone className='w-4 h-4' />
                  <span>{user.nomor_hp}</span>
                </div>
                {isPaid &&
                  'payment_date' in user &&
                  user.payment_date &&
                  user.payment_date.trim() !== '' &&
                  user.payment_date !== '""' && (
                    <div className='flex items-center gap-2'>
                      <Calendar className='w-4 h-4' />
                      <span>Dibayar: {safeFormatDate(user.payment_date)}</span>
                    </div>
                  )}
                {isPaid &&
                  (!('payment_date' in user) ||
                    !user.payment_date ||
                    user.payment_date.trim() === '' ||
                    user.payment_date === '""') && (
                    <div className='flex items-center gap-2'>
                      <Calendar className='w-4 h-4' />
                      <span className='text-gray-500'>
                        Tanggal pembayaran tidak tersedia
                      </span>
                    </div>
                  )}
                {isPaid && 'nominal' in user && (
                  <div className='flex items-center gap-2'>
                    <DollarSign className='w-4 h-4' />
                    <span className='font-semibold text-green-600'>
                      {formatCurrency(user.nominal)}
                    </span>
                  </div>
                )}
                {isPaid && 'payment_method' in user && user.payment_method && (
                  <div className='flex items-center gap-2'>
                    {getPaymentMethodIcon(user.payment_method)}
                    <span className='text-sm text-gray-600'>
                      {getPaymentMethodLabel(user.payment_method)}
                    </span>
                  </div>
                )}
                {!isPaid && (
                  <div className='flex items-center gap-2'>
                    <Calendar className='w-4 h-4' />
                    <span className='text-orange-600'>
                      Jatuh tempo: {formatAbsoluteTime(user.due_date)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderSkeleton = () => (
    <div className='space-y-4'>
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardContent className='p-4'>
            <div className='flex items-start justify-between'>
              <div className='flex-1 space-y-2'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-3 w-48' />
                <Skeleton className='h-3 w-24' />
              </div>
              <Skeleton className='h-8 w-8' />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <Card
      className={`rounded-2xl shadow-md hover:shadow-xl transition ${className}`}
    >
      <CardHeader>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <Users className='w-5 h-5' />
              Status Pembayaran Warga
            </CardTitle>
            <CardDescription>
              Pantau warga yang sudah dan belum membayar iuran
            </CardDescription>
          </div>

          <div className='flex flex-col sm:flex-row gap-2'>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className='w-full sm:w-[180px] bg-white'>
                <Calendar className='w-4 h-4 mr-2' />
                <SelectValue placeholder='Pilih bulan' />
              </SelectTrigger>
              <SelectContent>
                {generateAvailableMonths().map(month => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filter}
              onValueChange={(value: FilterType) => setFilter(value)}
            >
              <SelectTrigger className='w-full sm:w-[140px] bg-white'>
                <Filter className='w-4 h-4 mr-2' />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Semua</SelectItem>
                <SelectItem value='normal'>Normal</SelectItem>
                <SelectItem value='orphaned'>Orphaned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant='destructive' className='mb-4'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue='paid' className='w-full'>
          <TabsList className='grid w-full grid-cols-2 mb-6'>
            <TabsTrigger
              value='paid'
              className='flex items-center gap-2 cursor-pointer data-[state=active]:bg-green-700 data-[state=active]:text-white'
            >
              <CheckCircle2 className='w-4 h-4' />
              <span>Sudah Bayar ({filteredPaidUsers.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value='unpaid'
              className='flex items-center gap-2 cursor-pointer data-[state=active]:bg-red-700 data-[state=active]:text-white'
            >
              <AlertCircle className='w-4 h-4' />
              <span>Belum Bayar ({filteredUnpaidUsers.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value='paid' className='space-y-4'>
            {isLoading ? (
              renderSkeleton()
            ) : filteredPaidUsers.length === 0 ? (
              <div className='text-center py-8 text-gray-500'>
                <CheckCircle2 className='w-12 h-12 mx-auto mb-4 text-green-500' />
                <p className='text-lg font-medium'>Tidak ada data pembayaran</p>
                <p className='text-sm'>
                  Semua warga belum membayar untuk bulan ini
                </p>
              </div>
            ) : (
              <div className='space-y-4 max-h-96 overflow-y-auto'>
                {filteredPaidUsers.map(user => renderUserCard(user, true))}
              </div>
            )}
          </TabsContent>

          <TabsContent value='unpaid' className='space-y-4'>
            {isLoading ? (
              renderSkeleton()
            ) : filteredUnpaidUsers.length === 0 ? (
              <div className='text-center py-8 text-gray-500'>
                <CheckCircle2 className='w-12 h-12 mx-auto mb-4 text-green-500' />
                <p className='text-lg font-medium'>
                  Semua warga sudah membayar!
                </p>
                <p className='text-sm'>
                  Tidak ada warga yang belum membayar untuk bulan ini
                </p>
              </div>
            ) : (
              <div className='space-y-4 max-h-96 overflow-y-auto'>
                {filteredUnpaidUsers.map(user => renderUserCard(user, false))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserPaymentStatusCard;
