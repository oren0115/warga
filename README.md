# PKM Frontend - Community Financial Management System

A modern React-based frontend application for managing community financial operations, built with TypeScript, Vite, and Tailwind CSS. This application provides both user and admin interfaces for managing fees, payments, and notifications.

## 🚀 Features

### User Features

- **Authentication**: Secure login and registration system
- **Dashboard**: Overview of personal financial status
- **Fee Management**: View and manage monthly fees (iuran)
- **Payment Processing**: Integrated payment system with multiple methods
- **Payment History**: Track all payment transactions
- **Notifications**: Real-time notifications for important updates
- **Profile Management**: Update personal information

### Admin Features

- **Admin Dashboard**: Comprehensive overview of system statistics
- **User Management**: Manage community members
- **Fee Generation**: Create and manage monthly fees for all users
- **Payment Review**: Review and approve pending payments
- **Broadcast Notifications**: Send notifications to all users
- **Analytics**: View collection rates and financial reports

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 7.1.6
- **Styling**: Tailwind CSS 4.1.13
- **UI Components**: Radix UI primitives
- **Routing**: React Router DOM 6.30.1
- **HTTP Client**: Axios 1.12.2
- **Charts**: Recharts 3.2.1
- **Icons**: Lucide React & React Icons
- **State Management**: React Context API

## 📁 Project Structure

src/
├── api/ # API configuration and interceptors
├── components/ # Reusable UI components
│ ├── admin/ # Admin-specific components
│ ├── common/ # Shared components
│ └── ui/ # Base UI components (Radix UI)
├── context/ # React Context providers
├── css/ # Global styles
├── layout/ # Layout components
├── lib/ # Utility functions
├── page/ # Page components
│ ├── admin/ # Admin pages
│ ├── auth/ # Authentication pages
│ └── user/ # User pages
├── services/ # API service functions
└── types/ # TypeScript type definitions

## �� Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- Backend API running (see backend documentation)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd PKM/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env` file in the frontend directory:

   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 UI Components

The application uses a custom component library built on top of Radix UI primitives:

- **Button** - Customizable button component
- **Card** - Content container component
- **Input** - Form input component
- **Table** - Data table component
- **Badge** - Status indicator component
- **Alert** - Notification alert component
- **Tabs** - Tab navigation component
- **Sheet** - Modal/sheet component
- **Avatar** - User profile image component
- **Progress** - Progress indicator component

## 🔐 Authentication

The application implements JWT-based authentication with:

- **Login/Register** - User authentication
- **Protected Routes** - Route protection for authenticated users
- **Admin Routes** - Special protection for admin-only pages
- **Token Management** - Automatic token refresh and logout on expiry

## 📱 Responsive Design

The application is fully responsive and optimized for:

- Desktop computers
- Tablets
- Mobile devices

## 🔌 API Integration

The frontend integrates with a FastAPI backend through:

- **RESTful API** - Standard HTTP methods
- **Axios Interceptors** - Automatic token handling
- **Error Handling** - Centralized error management
- **Type Safety** - Full TypeScript integration

## 🎯 Key Pages

### User Pages

- `/` - Home dashboard
- `/iuran` - Fee management
- `/iuran/:id` - Fee details
- `/riwayat` - Payment history
- `/notifications` - Notifications center
- `/profile` - User profile

### Admin Pages

- `/admin/dashboard` - Admin dashboard
- `/admin/users` - User management
- `/admin/fees` - Fee generation
- `/admin/payments` - Payment review
- `/admin/broadcast` - Notification broadcast

## 🚀 Deployment

### Build Configuration

The application is configured for production deployment with:

- **Vite Build** - Optimized production build
- **TypeScript Compilation** - Type checking and compilation
- **Asset Optimization** - Minification and bundling
- **Environment Variables** - Configurable API endpoints

### Environment Variables

| Variable       | Description     | Default                     |
| -------------- | --------------- | --------------------------- |
| `VITE_API_URL` | Backend API URL | `http://localhost:8000/api` |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

1. Check the [Issues](https://github.com/oren0115/warga/issues) page
2. Create a new issue if your problem isn't already reported
3. Contact the development team

## 🔄 Version History

- **v0.0.0** - Initial release with basic functionality
  - User authentication
  - Fee management
  - Payment processing
  - Admin dashboard
  - Notification system

---

Built with ❤️ using React, TypeScript, and Vite
