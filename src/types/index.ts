// Types for the web application - matching backend schemas

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
  payment_method: string;
  id: string;
  user_id: string;
  kategori: string;
  nominal: number;
  bulan: string;
  status: "Belum Bayar" | "Pending" | "Lunas";
  due_date: string;
  created_at: string;
}

export interface Payment {
  id: string;
  fee_id: string;
  user_id: string;
  amount: number;
  payment_method: string;
  status: "Pending" | "Settlement" | "Success" | "Deny" | "Cancel" | "Expire";
  created_at: string;
  transaction_id?: string;
  payment_token?: string;
  payment_url?: string;
  midtrans_status?: string;
  payment_type?: string;
  bank?: string;
  va_number?: string;
  expiry_time?: string;
  settled_at?: string;
  user?: User;
  fee?: Fee;
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
  payment_method: string;
}

export interface PaymentCreateResponse {
  payment_id: string;
  transaction_id: string;
  payment_token: string;
  payment_url: string;
  expiry_time: string;
  payment_type: string;
  bank?: string;
  va_number?: string;
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
  currentMonthCollection: number;
  collectionRate: number;
  monthlyFees: { month: string; total: number }[];
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
