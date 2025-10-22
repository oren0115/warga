# 🏠 PKM Frontend - Community Financial Management

A modern React-based frontend application for managing community financial operations. Built with TypeScript, Vite, and Tailwind CSS.

## ✨ Features

### 👤 User Features

- **Dashboard** - Personal financial overview
- **Fee Management** - View and pay monthly fees (iuran)
- **Payment Processing** - Integrated payment system
- **Payment History** - Track all transactions
- **Notifications** - Real-time updates
- **Profile Management** - Update personal info

### 👨‍💼 Admin Features

- **Admin Dashboard** - System statistics overview
- **User Management** - Manage community members
- **Fee Generation** - Create monthly fees for all users
- **Payment Review** - Review and approve payments
- **Broadcast Notifications** - Send notifications to users
- **Analytics** - Collection rates and reports

## 🛠️ Tech Stack

- **React 19.1.1** with TypeScript
- **Vite 7.1.6** - Build tool
- **Tailwind CSS 4.1.13** - Styling
- **Radix UI** - UI components
- **React Router** - Routing
- **Axios** - HTTP client
- **Recharts** - Charts
- **Lucide React** - Icons

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd warga

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

Create `.env` file in root directory:

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=PKM Community
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components
│   ├── admin/          # Admin-specific components
│   └── ui/             # Base UI components (shadcn/ui)
├── routes/             # Route protection components
├── pages/              # Page components
│   ├── admin/          # Admin pages
│   ├── auth/           # Authentication pages
│   └── user/           # User pages
├── layouts/            # Layout components
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── services/           # API services
├── types/              # TypeScript definitions
├── utils/              # Utility functions
├── lib/                # Library configurations
└── css/                # Global styles
```

## 🎯 Key Components

### Error Handling

- **Error Boundary** - Catches React errors
- **Centralized Error Service** - Logs and tracks errors
- **Error Context** - Global error management
- **User-friendly Error UI** - Graceful error display

### Authentication

- **Protected Routes** - Route-based access control
- **User Context** - Global user state management
- **Token Management** - Secure token handling

### Payment System

- **Payment Processing** - Multiple payment methods
- **Status Tracking** - Real-time payment status
- **History Management** - Transaction records

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🌐 API Integration

The frontend communicates with the backend API:

- **Base URL**: `http://localhost:8000`
- **Authentication**: JWT tokens
- **Endpoints**: RESTful API
- **Error Handling**: Centralized error management

### Main API Endpoints

```typescript
// Authentication
POST / api / login;

// User Operations
GET / api / fees;
GET / api / payments;
POST / api / payments;
GET / api / notifications;

// Admin Operations
GET / api / admin / users;
POST / api / admin / users;
GET / api / admin / dashboard;
POST / api / admin / broadcast;
```

## 🎨 UI/UX Features

### Design System

- **Responsive Design** - Mobile-first approach
- **Dark/Light Theme** - Theme switching
- **Component Library** - Consistent UI components
- **Accessibility** - WCAG compliant

### User Experience

- **Loading States** - Smooth loading indicators
- **Error States** - User-friendly error messages
- **Empty States** - Helpful empty state designs
- **Real-time Updates** - WebSocket integration

## 🔒 Security Features

- **Route Protection** - Authenticated routes
- **Input Validation** - Form validation
- **XSS Protection** - Sanitized inputs
- **CSRF Protection** - Token-based protection
- **Error Logging** - Secure error tracking

## 📱 Responsive Design

- **Mobile First** - Optimized for mobile devices
- **Tablet Support** - Responsive tablet layout
- **Desktop Enhanced** - Full desktop experience
- **Touch Friendly** - Touch-optimized interactions

## 🧪 Testing

```bash
# Run tests (if configured)
npm run test
npm run test:coverage
```

## 🚀 Deployment

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 Performance

- **Code Splitting** - Lazy loading components
- **Bundle Optimization** - Optimized bundle size
- **Image Optimization** - Compressed images
- **Caching** - Browser caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 🐛 Troubleshooting

### Common Issues

**Build Errors**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**API Connection Issues**

- Check backend server is running
- Verify API URL in `.env`
- Check network connectivity

**TypeScript Errors**

```bash
# Type check
npm run type-check
```

## 📚 Documentation

- [Error Handling Guide](docs/ERROR_HANDLING.md)
- [Component Documentation](docs/COMPONENTS.md)
- [API Integration Guide](docs/API.md)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Developer** - React/TypeScript development
- **UI/UX Designer** - Design system and user experience
- **Backend Developer** - API integration

## 📞 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for the community**
