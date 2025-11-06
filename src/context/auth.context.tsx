import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from 'react';
import { authService } from '../services/auth.service';
import type {
  AuthContextType,
  AuthState,
  RegisterRequest,
  User,
} from '../types';

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

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('userToken');
      const userInfo = localStorage.getItem('userInfo');

      if (token && userInfo) {
        try {
          // Validate JWT expiry (without network call)
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            const exp =
              typeof payload.exp === 'number' ? payload.exp * 1000 : 0;
            if (exp && Date.now() >= exp) {
              // Token expired
              localStorage.removeItem('userToken');
              localStorage.removeItem('userInfo');
              dispatch({ type: 'SET_LOADING', payload: false });
              return;
            }
          }

          const user = JSON.parse(userInfo);
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { token, user },
          });
        } catch (error) {
          // Invalid stored data, clear it
          localStorage.removeItem('userToken');
          localStorage.removeItem('userInfo');
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authService.login(username, password);
      localStorage.setItem('userToken', response.access_token);
      localStorage.setItem('userInfo', JSON.stringify(response.user));
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

  const logout = (): void => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (userData: Partial<User>): Promise<void> => {
    try {
      const updatedUser = await authService.updateProfile(userData);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
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
