import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { clearUnauthorizedCallback, setUnauthorizedCallback } from '../api/api';
import { authService } from '../services/auth.service';
import type {
  AuthContextType,
  AuthState,
  RegisterRequest,
  User,
} from '../types';
import { useToast } from './toast.context';

// Initial state
const initialState: AuthState = {
  token: null,
  user: null,
  isLoading: true,
  error: null,
};

// Action types
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { token: string; user: User } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        token: null,
        user: null,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        token: null,
        user: null,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();
  const { showWarning } = useToast();

  // Logout function with navigation and optional message
  const logout = useCallback(
    (showMessage = false): void => {
      // Hapus semua jejak token/user dari storage browser.
      // Prioritas utama: sessionStorage untuk menghindari persistensi lintas tab/close.
      try {
        sessionStorage.removeItem('userToken');
        sessionStorage.removeItem('userInfo');
      } catch {
        // Abaikan error (misalnya jika sessionStorage tidak tersedia)
      }

      // Backward-compat: bersihkan juga localStorage jika masih ada sisa lama
      try {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userInfo');
      } catch {
        // Abaikan error
      }
      dispatch({ type: 'LOGOUT' });

      // Show toast message if requested (for auto-logout due to token expiration)
      if (showMessage) {
        showWarning('Sesi Anda telah berakhir. Silakan login kembali.', 5000);
      }

      navigate('/login', { replace: true });
    },
    [navigate, showWarning]
  );

  // Setup auto-logout on token expiration
  useEffect(() => {
    // Register callback for API 401 responses
    setUnauthorizedCallback(showMessage => {
      logout(showMessage);
    });

    // Cleanup on unmount
    return () => {
      clearUnauthorizedCallback();
    };
  }, [logout]);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      // Prioritaskan sessionStorage untuk menghindari persistensi jangka panjang.
      let token: string | null = null;
      let userInfo: string | null = null;

      try {
        token = sessionStorage.getItem('userToken');
        userInfo = sessionStorage.getItem('userInfo');
      } catch {
        // Fallback ke localStorage hanya untuk migrasi user lama
      }

      if (!token || !userInfo) {
        try {
          const legacyToken = localStorage.getItem('userToken');
          const legacyUserInfo = localStorage.getItem('userInfo');
          if (legacyToken && legacyUserInfo) {
            token = legacyToken;
            userInfo = legacyUserInfo;

            // Migrasi ke sessionStorage dan bersihkan localStorage
            try {
              sessionStorage.setItem('userToken', legacyToken);
              sessionStorage.setItem('userInfo', legacyUserInfo);
              localStorage.removeItem('userToken');
              localStorage.removeItem('userInfo');
            } catch {
              // Jika sessionStorage gagal, tetap pakai data in-memory saja
            }
          }
        } catch {
          // Abaikan error akses storage
        }
      }

      if (token && userInfo) {
        try {
          // Validate JWT expiry (without network call)
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            const exp =
              typeof payload.exp === 'number' ? payload.exp * 1000 : 0;
            if (exp && Date.now() >= exp) {
              // Token expired - auto logout with message
              logout(true);
              return;
            }
          }

          const user = JSON.parse(userInfo);
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { token, user },
          });
        } catch (error) {
          // Invalid stored data, clear it dari semua storage
          try {
            sessionStorage.removeItem('userToken');
            sessionStorage.removeItem('userInfo');
          } catch {
            // ignore
          }
          try {
            localStorage.removeItem('userToken');
            localStorage.removeItem('userInfo');
          } catch {
            // ignore
          }
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, [logout]);

  const login = async (username: string, password: string): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authService.login(username, password);
      // Simpan ke sessionStorage agar token tidak bertahan setelah tab/close browser.
      try {
        sessionStorage.setItem('userToken', response.access_token);
        sessionStorage.setItem('userInfo', JSON.stringify(response.user));
      } catch {
        // Jika sessionStorage tidak tersedia, tetap lanjut dengan state in-memory saja
      }
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { token: response.access_token, user: response.user },
      });
    } catch (error: any) {
      const errorMessage =
        (error?.errorMapping?.userMessage as string | undefined) ||
        (error?.message as string | undefined) ||
        'Login gagal. Periksa koneksi dan coba lagi.';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    try {
      await authService.register(userData);
      // After successful registration, automatically log in
      await login(userData.username, userData.password);
    } catch (error: any) {
      const errorMessage =
        (error?.errorMapping?.userMessage as string | undefined) ||
        (error?.message as string | undefined) ||
        'Pendaftaran gagal. Periksa koneksi dan coba lagi.';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    try {
      const updatedUser = await authService.updateProfile(userData);
      try {
        sessionStorage.setItem('userInfo', JSON.stringify(updatedUser));
      } catch {
        // Abaikan jika sessionStorage tidak tersedia
      }
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    authState: state,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
