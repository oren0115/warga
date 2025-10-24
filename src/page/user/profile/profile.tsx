import {
  Calendar,
  CheckCircle,
  Home,
  LogOut,
  MapPin,
  Phone,
  Shield,
  User as UserIcon,
} from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, PageLayout } from '../../../components/common';
import { Badge } from '../../../components/ui/badge';
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
import { Textarea } from '../../../components/ui/textarea';
import { useAuth } from '../../../context/auth.context';

const Profile: React.FC = () => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

  return (
    <PageLayout>
      <PageHeader
        title='Halo'
        subtitle='Kelola IPL Anda dengan mudah'
        icon={<UserIcon className='w-5 h-5 md:w-6 md:h-6 text-white' />}
        userName={authState.user?.nama}
        rightAction={<MobileLogoutButton />}
      />

      <div className='p-4 pb-8 space-y-5 -mt-2 w-full mx-auto'>
        {/* Profile Header Card - Enhanced */}
        <Card className='shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden'>
          <div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full' />
          <CardContent className='p-5 md:p-7 relative'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-5'>
              <div className='relative flex-shrink-0 group'>
                <div className='w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-blue-100'>
                  <UserIcon className='w-11 h-11 md:w-13 md:h-13 text-white' />
                </div>
              </div>

              <div className='flex-1 min-w-0 w-full'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
                  <div>
                    <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mb-1'>
                      {authState.user?.nama}
                    </h2>
                    <p className='text-sm text-gray-500 mb-3'>
                      @{authState.user?.username}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={authState.user?.is_admin ? 'secondary' : 'outline'}
                  className={`px-3 py-1.5 text-xs font-medium ${
                    authState.user?.is_admin
                      ? 'bg-purple-100 text-purple-800 border-purple-200'
                      : 'bg-blue-100 text-blue-800 border-blue-200'
                  }`}
                >
                  {authState.user?.is_admin ? (
                    <>
                      <Shield className='w-3 h-3 mr-1 inline' />
                      Administrator
                    </>
                  ) : (
                    <>
                      <UserIcon className='w-3 h-3 mr-1 inline' />
                      Warga
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informasi Pribadi - Enhanced */}
        <Card className='shadow-xl border-0 bg-gradient-to-br from-white to-gray-50'>
          <CardHeader className='pb-4'>
            <CardTitle className='flex items-center gap-2 text-xl'>
              <div className='w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center'>
                <UserIcon className='w-5 h-5 text-blue-600' />
              </div>
              Informasi Pribadi
            </CardTitle>
            <CardDescription className='text-sm'>
              Detail profil Anda
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-5'>
            <div className='space-y-4'>
              {/* Username - Read Only */}
              <div className='space-y-2'>
                <Label
                  htmlFor='username'
                  className='text-sm font-medium text-gray-700 flex items-center gap-2'
                >
                  <UserIcon className='w-4 h-4 text-gray-400' />
                  Username
                </Label>
                <Input
                  id='username'
                  type='text'
                  value={authState.user?.username || ''}
                  disabled
                  className='bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                />
              </div>

              {/* Nama */}
              <div className='space-y-2'>
                <Label
                  htmlFor='nama'
                  className='text-sm font-medium text-gray-700 flex items-center gap-2'
                >
                  <UserIcon className='w-4 h-4 text-gray-400' />
                  Nama Lengkap
                </Label>
                <Input
                  id='nama'
                  type='text'
                  value={authState.user?.nama || ''}
                  disabled
                  className='bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                />
              </div>

              {/* Alamat */}
              <div className='space-y-2'>
                <Label
                  htmlFor='alamat'
                  className='text-sm font-medium text-gray-700 flex items-center gap-2'
                >
                  <MapPin className='w-4 h-4 text-gray-400' />
                  Alamat
                </Label>
                <Textarea
                  id='alamat'
                  value={authState.user?.alamat || ''}
                  disabled
                  rows={3}
                  className='bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed resize-none'
                />
              </div>

              {/* Two Column Layout for Phone and House Number */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {/* Nomor Rumah */}
                <div className='space-y-2'>
                  <Label
                    htmlFor='nomor_rumah'
                    className='text-sm font-medium text-gray-700 flex items-center gap-2'
                  >
                    <Home className='w-4 h-4 text-gray-400' />
                    Nomor Rumah
                  </Label>
                  <Input
                    id='nomor_rumah'
                    type='text'
                    value={authState.user?.nomor_rumah || ''}
                    disabled
                    className='bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                  />
                </div>

                {/* Nomor HP */}
                <div className='space-y-2'>
                  <Label
                    htmlFor='nomor_hp'
                    className='text-sm font-medium text-gray-700 flex items-center gap-2'
                  >
                    <Phone className='w-4 h-4 text-gray-400' />
                    Nomor HP
                  </Label>
                  <Input
                    id='nomor_hp'
                    type='tel'
                    value={authState.user?.nomor_hp || ''}
                    disabled
                    className='bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informasi Akun - Enhanced */}
        <Card className='shadow-xl border-0 bg-gradient-to-br from-white to-gray-50'>
          <CardHeader className='pb-4'>
            <CardTitle className='flex items-center gap-2 text-xl'>
              <div className='w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center'>
                <CheckCircle className='w-5 h-5 text-green-600' />
              </div>
              Informasi Akun
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                <Shield className='w-5 h-5 text-gray-400' />
                <div>
                  <p className='text-xs text-gray-500 font-medium'>
                    Status Akun
                  </p>
                  <p className='text-sm font-semibold text-gray-900'>
                    {authState.user?.is_admin ? 'Administrator' : 'Warga'}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-3 p-3 bg-gray-50 rounded-lg'>
                <Calendar className='w-5 h-5 text-gray-400' />
                <div>
                  <p className='text-xs text-gray-500 font-medium'>
                    Bergabung Sejak
                  </p>
                  <p className='text-sm font-semibold text-gray-900'>
                    {new Date(
                      authState.user?.created_at || ''
                    ).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      timeZone: 'Asia/Jakarta',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Profile;
