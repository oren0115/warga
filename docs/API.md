# 🔌 API Integration Guide

## Overview

This document provides comprehensive information about API integration in the PKM Frontend application.

## 🌐 API Configuration

### Base Configuration

**API Base URL**
```typescript
// src/api/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
```

**Environment Variables**
```env
# .env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=PKM Community
```

### HTTP Client Setup

**Axios Configuration**
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Request Interceptor**
```typescript
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

**Response Interceptor**
```typescript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 🔐 Authentication API

### Login
```typescript
POST /api/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}

// Response
{
  "access_token": "string",
  "token_type": "bearer",
  "user": {
    "id": "string",
    "username": "string",
    "nama": "string",
    "email": "string",
    "is_admin": boolean
  }
}
```

### Register
```typescript
POST /api/register
Content-Type: application/json

{
  "username": "string",
  "password": "string",
  "nama": "string",
  "email": "string",
  "alamat": "string",
  "nomor_rumah": "string",
  "nomor_hp": "string",
  "tipe_rumah": "string"
}

// Response
{
  "id": "string",
  "username": "string",
  "nama": "string",
  "email": "string",
  "is_admin": boolean
}
```

### Profile Management
```typescript
GET /api/profile
Authorization: Bearer <token>

PUT /api/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "nama": "string",
  "email": "string",
  "alamat": "string",
  "nomor_hp": "string"
}
```

## 👤 User API

### Fees Management
```typescript
GET /api/fees
Authorization: Bearer <token>

// Response
{
  "fees": [
    {
      "id": "string",
      "bulan": "string",
      "tahun": "string",
      "amount": number,
      "status": "string",
      "due_date": "string",
      "created_at": "string",
      "updated_at": "string"
    }
  ]
}
```

### Payments
```typescript
GET /api/payments
Authorization: Bearer <token>

POST /api/payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "fee_id": "string",
  "amount": number,
  "payment_method": "string"
}

// Response
{
  "payment_id": "string",
  "payment_url": "string",
  "status": "string"
}
```

### Payment Status
```typescript
GET /api/payments/check/{payment_id}
Authorization: Bearer <token>

POST /api/payments/force-check/{payment_id}
Authorization: Bearer <token>

// Response
{
  "payment_id": "string",
  "status": "string",
  "amount": number,
  "created_at": "string",
  "updated": boolean,
  "message": "string"
}
```

### Notifications
```typescript
GET /api/notifications
Authorization: Bearer <token>

PUT /api/notifications/{notification_id}/read
Authorization: Bearer <token>
```

## 👨‍💼 Admin API

### Dashboard
```typescript
GET /api/admin/dashboard
Authorization: Bearer <token>

// Response
{
  "totalUsers": number,
  "totalFees": number,
  "totalPayments": number,
  "collectionRate": number,
  "recentPayments": [...],
  "userStats": [...],
  "paymentStatus": [...]
}
```

### User Management
```typescript
GET /api/admin/users
Authorization: Bearer <token>

POST /api/admin/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "string",
  "password": "string",
  "nama": "string",
  "email": "string",
  "alamat": "string",
  "nomor_rumah": "string",
  "nomor_hp": "string",
  "tipe_rumah": "string"
}

PUT /api/admin/users/{user_id}
Authorization: Bearer <token>

DELETE /api/admin/users/{user_id}
Authorization: Bearer <token>
```

### Fee Management
```typescript
POST /api/admin/fees/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "month": "string",
  "year": "string"
}

GET /api/admin/fees/regeneration-history
Authorization: Bearer <token>

POST /api/admin/fees/rollback
Authorization: Bearer <token>
Content-Type: application/json

{
  "month": "string",
  "year": "string"
}
```

### Payment Review
```typescript
GET /api/admin/payments
Authorization: Bearer <token>

PUT /api/admin/payments/{payment_id}/approve
Authorization: Bearer <token>

PUT /api/admin/payments/{payment_id}/reject
Authorization: Bearer <token>
```

### Broadcast Notifications
```typescript
POST /api/admin/broadcast
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string",
  "message": "string",
  "send_telegram": boolean,
  "target_users": "all" | "unpaid" | "paid"
}
```

## 🔄 WebSocket Integration

### Connection Setup
```typescript
// src/services/websocket.service.ts
const wsUrl = `ws://localhost:8000/ws/${userId}`;
const ws = new WebSocket(wsUrl);
```

### Event Types
```typescript
interface WebSocketMessage {
  type: 'notification' | 'dashboard_update' | 'payment_update';
  data: any;
}
```

### Real-time Updates
- **Notifications**: New notifications
- **Dashboard**: Statistics updates
- **Payments**: Payment status changes

## 🛠️ Service Layer

### User Service
```typescript
// src/services/user.service.ts
export const userService = {
  getFees: async (): Promise<Fee[]>,
  getPayments: async (): Promise<Payment[]>,
  createPayment: async (data: PaymentCreateRequest): Promise<PaymentCreateResponse>,
  checkPaymentStatus: async (paymentId: string): Promise<PaymentStatusResponse>,
  getNotifications: async (): Promise<Notification[]>,
  markNotificationAsRead: async (notificationId: string): Promise<void>
};
```

### Admin Service
```typescript
// src/services/admin.service.ts
export const adminService = {
  getDashboardData: async (): Promise<DashboardStats>,
  getUsers: async (): Promise<User[]>,
  createUser: async (userData: CreateUserRequest): Promise<User>,
  updateUser: async (userId: string, userData: UpdateUserRequest): Promise<User>,
  deleteUser: async (userId: string): Promise<void>,
  generateFees: async (month: string, year: string): Promise<void>,
  getRegenerationHistory: async (): Promise<RegenerationHistory[]>,
  rollbackRegeneration: async (month: string, year: string): Promise<void>
};
```

### Auth Service
```typescript
// src/services/auth.service.ts
export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse>,
  register: async (userData: RegisterRequest): Promise<User>,
  getProfile: async (): Promise<User>,
  updateProfile: async (userData: Partial<User>): Promise<User>
};
```

## 🚨 Error Handling

### API Error Types
```typescript
interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}
```

### Error Handling Pattern
```typescript
try {
  const response = await api.get('/endpoint');
  return response.data;
} catch (error) {
  if (error.response?.status === 401) {
    // Handle unauthorized
    redirectToLogin();
  } else if (error.response?.status >= 500) {
    // Handle server errors
    showServerError();
  } else {
    // Handle client errors
    showClientError(error.response?.data?.message);
  }
  throw error;
}
```

### Centralized Error Logging
```typescript
// src/services/error.service.ts
errorService.logApiError(error, endpoint, method, requestData);
```

## 🔒 Security

### Authentication
- **JWT Tokens**: Secure token-based authentication
- **Token Storage**: localStorage with automatic cleanup
- **Token Refresh**: Automatic token refresh on expiry

### Request Security
- **HTTPS**: All API calls over HTTPS in production
- **CORS**: Proper CORS configuration
- **CSRF**: CSRF token protection
- **Input Validation**: Client-side validation

### Error Security
- **Error Sanitization**: Sanitize error messages
- **No Sensitive Data**: Don't expose sensitive information
- **Logging**: Secure error logging

## 📊 Data Types

### Core Types
```typescript
interface User {
  id: string;
  username: string;
  nama: string;
  email: string;
  alamat: string;
  nomor_rumah: string;
  nomor_hp: string;
  tipe_rumah: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

interface Fee {
  id: string;
  bulan: string;
  tahun: string;
  amount: number;
  status: string;
  due_date: string;
  created_at: string;
  updated_at: string;
}

interface Payment {
  id: string;
  fee_id: string;
  amount: number;
  status: string;
  payment_method: string;
  payment_url?: string;
  created_at: string;
  updated_at: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
```

## 🧪 Testing API Integration

### Mock API Responses
```typescript
// __mocks__/api.ts
export const mockApiResponse = {
  users: [
    {
      id: '1',
      username: 'testuser',
      nama: 'Test User',
      email: 'test@example.com'
    }
  ]
};
```

### API Testing
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useUsers } from './useUsers';

test('fetches users successfully', async () => {
  const { result } = renderHook(() => useUsers());
  
  await waitFor(() => {
    expect(result.current.users).toBeDefined();
  });
});
```

## 📈 Performance Optimization

### Request Optimization
- **Request Caching**: Cache API responses
- **Request Deduplication**: Prevent duplicate requests
- **Pagination**: Implement pagination for large datasets
- **Lazy Loading**: Load data on demand

### Response Optimization
- **Data Compression**: Use gzip compression
- **Response Caching**: Cache responses appropriately
- **Minimal Data**: Request only needed data
- **Batch Requests**: Combine multiple requests

## 🔧 Development Tools

### API Testing
- **Postman**: API testing and documentation
- **Insomnia**: Alternative API client
- **curl**: Command-line testing

### Debugging
- **Network Tab**: Browser dev tools
- **Console Logging**: Debug API calls
- **Error Tracking**: Centralized error logging

## 📚 Resources

- [Axios Documentation](https://axios-http.com/)
- [React Query](https://tanstack.com/query/latest)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [JWT.io](https://jwt.io/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
