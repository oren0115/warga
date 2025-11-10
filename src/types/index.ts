// Types for the web application - matching backend schemas

export type PaymentMethodRequest =
  | 'bank_transfer'
  | 'credit_card'
  | 'gopay'
  | 'qris'
  | 'shopeepay';

export type PaymentMethod =
  | PaymentMethodRequest
  | 'bca_va'
  | 'bni_va'
  | 'permata_va'
  | 'other_va'
  | 'echannel';

export interface User {
  id: string;
  username: string;
  nama: string;
  alamat: string | null;
  nomor_rumah: string | null;
  nomor_hp: string | null;
  is_admin: boolean;
  tipe_rumah?: string | null;
  created_at: string;
}

export interface Fee {
  payment_method: PaymentMethod;
  id: string;
  user_id: string;
  kategori: string;
  nominal: number;
  bulan: string;
  status: 'Belum Bayar' | 'Pending' | 'Lunas' | 'Failed' | 'Kadaluarsa';
  due_date: string;
  created_at: string;
}

export interface Payment {
  id: string;
  fee_id: string;
  user_id: string;
  amount: number;
  payment_method: PaymentMethod;
  status:
    | 'Pending'
    | 'Settlement'
    | 'Success'
    | 'Deny'
    | 'Cancel'
    | 'Expire'
    | 'Failed'
    | 'Kadaluarsa';
  created_at: string;
  transaction_id?: string;
  payment_token?: string;
  payment_url?: string;
  midtrans_status?: string;
  payment_type?: PaymentMethod;
  bank?: string;
  va_number?: string;
  expiry_time?: string;
  settled_at?: string;
   expired_at?: string;
  retry_of?: string | null;
  retry_replaced_by?: string | null;
  user?: User;
  fee?: Fee;
  qr_string?: string;
  qr_url?: string;
  deeplink_url?: string;
  mobile_deeplink_url?: string;
}

export interface Notification {
  url: string;
  read: any;
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  nama: string;
  alamat: string;
  nomor_rumah: string;
  nomor_hp: string;
  password: string;
}

export interface PaymentCreateRequest {
  fee_id: string;
  amount: number;
  payment_method: PaymentMethodRequest;
}

export interface PaymentCreateResponse {
  payment_id: string;
  transaction_id: string;
  payment_token?: string;
  payment_url?: string;
  expiry_time?: string;
  payment_type: string;
  bank?: string;
  va_number?: string;
  order_id: string;
  qr_url?: string;
  qr_string?: string;
  deeplink_url?: string;
  mobile_deeplink_url?: string;
}

export interface PaymentStatusResponse {
  payment_id: string;
  status: string;
  midtrans_status: string;
  settled_at?: string;
}

export interface GenerateFeesRequest {
  bulan: string;
  tarif_60m2: number;
  tarif_72m2: number;
  tarif_hook: number;
}

export interface BroadcastNotificationRequest {
  title: string;
  message: string;
  notification_type?: string;
}

export interface UserWithPhone {
  id: string;
  nama: string;
  nomor_hp: string;
  nomor_rumah: string;
}

export interface UsersWithPhoneResponse {
  users: UserWithPhone[];
  total: number;
}

export interface TelegramTestResponse {
  success: boolean;
  message: string;
}

export interface BroadcastResponse {
  message: string;
  telegram_result?: {
    success: boolean;
    message: string;
    total_users?: number;
    success_count?: number;
    failed_users?: string[];
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalFees: number;
  pendingPayments: number;
  approvedPayments: number;
  failedPayments: number;
  currentMonthCollection: number;
  collectionRate: number;
  monthlyFees: { month: string; total: number }[];
  unpaidFees: number;
}

export interface UnpaidUser {
  user_id: string;
  username: string;
  nama: string;
  nomor_rumah: string;
  nomor_hp: string;
  tipe_rumah: string;
  fee_id: string;
  kategori: string;
  nominal: number;
  due_date: string;
  created_at: string;
  is_orphaned?: boolean;
  payment_status?: string;
  payment_failed?: boolean;
}

export interface PaidUser {
  user_id: string;
  username: string;
  nama: string;
  nomor_rumah: string;
  nomor_hp: string;
  tipe_rumah: string;
  fee_id: string;
  kategori: string;
  nominal: number;
  due_date: string;
  created_at: string;
  payment_date: string;
  payment_method: string;
  payment_type?: PaymentMethod;
  bank?: string;
  va_number?: string;
  is_orphaned?: boolean;
}

// Regeneration History Types
export interface RegenerationHistory {
  id: string;
  action: string;
  month: string;
  admin_user: string;
  timestamp: string;
  details: {
    paid_fees_preserved: number;
    unpaid_fees_regenerated: number;
    new_fees_created: number;
    reason?: string;
  };
  affected_fees_count: number;
  paid_fees_preserved: number;
  unpaid_fees_regenerated: number;
  reason?: string;
}

export interface FeeVersion {
  id: string;
  user_id: string;
  kategori: string;
  nominal: number;
  bulan: string;
  status: string;
  due_date: string;
  created_at: string;
  version: number;
  regenerated_at?: string;
  regenerated_reason?: string;
  parent_fee_id?: string;
  is_regenerated: boolean;
}

export interface RollbackResponse {
  message: string;
  fees_restored: number;
  fees_removed: number;
}

// Telegram Management Types
export interface TelegramUser {
  id: string;
  username: string;
  nama: string;
  nomor_hp: string;
  telegram_chat_id?: string;
  telegram_active: boolean;
  created_at: string;
}

export interface TelegramStatusResponse {
  users: TelegramUser[];
  total_users: number;
  active_telegram_users: number;
  inactive_telegram_users: number;
}

// Auth context types
export interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType {
  authState: AuthState;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}
