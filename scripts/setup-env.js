#!/usr/bin/env node
/**
 * Script untuk setup environment variables
 * Memastikan konfigurasi yang benar untuk development dan production
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENV_TEMPLATE = `# PKM Frontend Environment Variables
# Copy this file to .env and update the values

# ===========================================
# API Configuration
# ===========================================
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000

# ===========================================
# Application Configuration
# ===========================================
VITE_APP_NAME=PKM Community
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Community Financial Management System
VITE_APP_AUTHOR=PKM Development Team

# ===========================================
# Development Configuration
# ===========================================
VITE_DEBUG_MODE=true
VITE_SHOW_ERROR_STATS=true
VITE_ENABLE_DEVTOOLS=true

# ===========================================
# Production Configuration (Uncomment for production)
# ===========================================
# VITE_API_URL=https://api.pkm-community.com
# VITE_WS_URL=wss://api.pkm-community.com
# VITE_DEBUG_MODE=false
# VITE_SHOW_ERROR_STATS=false
# VITE_ENABLE_DEVTOOLS=false

# ===========================================
# Feature Flags
# ===========================================
VITE_ENABLE_WEBSOCKET=true
VITE_ENABLE_ERROR_LOGGING=true
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_PWA=false
VITE_ENABLE_OFFLINE_MODE=false

# ===========================================
# Security Configuration
# ===========================================
VITE_ENABLE_CSRF_PROTECTION=true
VITE_ENABLE_XSS_PROTECTION=true
VITE_SESSION_TIMEOUT=3600000

# ===========================================
# Performance Configuration
# ===========================================
VITE_ENABLE_LAZY_LOADING=true
VITE_ENABLE_CODE_SPLITTING=true
VITE_BUNDLE_ANALYZER=false

# ===========================================
# Testing Configuration
# ===========================================
VITE_ENABLE_MOCK_API=false
VITE_MOCK_API_DELAY=1000

# ===========================================
# Localization
# ===========================================
VITE_DEFAULT_LANGUAGE=id
VITE_SUPPORTED_LANGUAGES=id,en

# ===========================================
# Theme Configuration
# ===========================================
VITE_DEFAULT_THEME=light
VITE_ENABLE_THEME_SWITCHING=true

# ===========================================
# Cache Configuration
# ===========================================
VITE_CACHE_DURATION=300000
VITE_ENABLE_SERVICE_WORKER=false

# ===========================================
# Development Tools
# ===========================================
VITE_ENABLE_REACT_DEVTOOLS=true
VITE_ENABLE_REDUX_DEVTOOLS=false
VITE_ENABLE_APOLLO_DEVTOOLS=false
`;

const PRODUCTION_ENV_TEMPLATE = `# PKM Frontend Environment Variables - PRODUCTION
# Update these values for production deployment

# ===========================================
# API Configuration - PRODUCTION
# ===========================================
VITE_API_URL=https://api.pkm-community.com
VITE_WS_URL=wss://api.pkm-community.com

# ===========================================
# Application Configuration
# ===========================================
VITE_APP_NAME=PKM Community
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Community Financial Management System
VITE_APP_AUTHOR=PKM Development Team

# ===========================================
# Production Configuration
# ===========================================
VITE_DEBUG_MODE=false
VITE_SHOW_ERROR_STATS=false
VITE_ENABLE_DEVTOOLS=false

# ===========================================
# Feature Flags
# ===========================================
VITE_ENABLE_WEBSOCKET=true
VITE_ENABLE_ERROR_LOGGING=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PWA=true
VITE_ENABLE_OFFLINE_MODE=true

# ===========================================
# Security Configuration
# ===========================================
VITE_ENABLE_CSRF_PROTECTION=true
VITE_ENABLE_XSS_PROTECTION=true
VITE_SESSION_TIMEOUT=3600000

# ===========================================
# Performance Configuration
# ===========================================
VITE_ENABLE_LAZY_LOADING=true
VITE_ENABLE_CODE_SPLITTING=true
VITE_BUNDLE_ANALYZER=false

# ===========================================
# External Services - PRODUCTION
# ===========================================
# Google Analytics
# VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID

# Sentry Error Tracking
# VITE_SENTRY_DSN=YOUR_SENTRY_DSN

# ===========================================
# Payment Gateway Configuration - PRODUCTION
# ===========================================
# VITE_MIDTRANS_CLIENT_KEY=YOUR_PRODUCTION_CLIENT_KEY
# VITE_MIDTRANS_SERVER_KEY=YOUR_PRODUCTION_SERVER_KEY
# VITE_MIDTRANS_IS_PRODUCTION=true

# ===========================================
# Notification Services - PRODUCTION
# ===========================================
# VITE_TELEGRAM_BOT_TOKEN=YOUR_PRODUCTION_BOT_TOKEN
# VITE_TELEGRAM_CHAT_ID=YOUR_PRODUCTION_CHAT_ID
`;

function setupEnvironment() {
  const rootDir = path.join(__dirname, '..');
  const envPath = path.join(rootDir, '.env');
  const envProductionPath = path.join(rootDir, '.env.production');

  console.log('🔧 Setting up environment variables...');

  // Create .env file if it doesn't exist
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, ENV_TEMPLATE);
    console.log('✅ Created .env file for development');
  } else {
    console.log('ℹ️  .env file already exists');
  }

  // Create .env.production file
  fs.writeFileSync(envProductionPath, PRODUCTION_ENV_TEMPLATE);
  console.log('✅ Created .env.production file for production');

  // Validate current configuration
  console.log('\n📋 Current Configuration:');
  console.log(
    'Development .env:',
    fs.existsSync(envPath) ? '✅ Exists' : '❌ Missing'
  );
  console.log(
    'Production .env:',
    fs.existsSync(envProductionPath) ? '✅ Exists' : '❌ Missing'
  );

  console.log('\n🚀 Next Steps:');
  console.log('1. Update .env with your development API URL');
  console.log('2. Update .env.production with your production API URL');
  console.log('3. Run: npm run build for production build');
  console.log('4. Deploy with production environment variables');

  console.log('\n⚠️  IMPORTANT for Production:');
  console.log('- Never use localhost URLs in production');
  console.log('- Use HTTPS for all production URLs');
  console.log('- Set VITE_DEBUG_MODE=false in production');
  console.log('- Set VITE_SHOW_ERROR_STATS=false in production');
}

function validateEnvironment() {
  const rootDir = path.join(__dirname, '..');
  const envPath = path.join(rootDir, '.env');

  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found. Run: node scripts/setup-env.js');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');

  // Check for localhost in production
  if (
    envContent.includes('localhost') &&
    process.env.NODE_ENV === 'production'
  ) {
    console.log('❌ ERROR: localhost URLs found in production environment!');
    console.log('Please update VITE_API_URL to your production domain');
    process.exit(1);
  }

  // Check for debug mode in production
  if (
    envContent.includes('VITE_DEBUG_MODE=true') &&
    process.env.NODE_ENV === 'production'
  ) {
    console.log('⚠️  WARNING: Debug mode enabled in production!');
    console.log('Set VITE_DEBUG_MODE=false for production');
  }

  console.log('✅ Environment validation passed');
}

// Main execution
const command = process.argv[2];

switch (command) {
  case 'setup':
    setupEnvironment();
    break;
  case 'validate':
    validateEnvironment();
    break;
  default:
    console.log('🔧 Environment Setup Script');
    console.log('');
    console.log('Usage:');
    console.log(
      '  node scripts/setup-env.js setup    - Create environment files'
    );
    console.log(
      '  node scripts/setup-env.js validate - Validate environment configuration'
    );
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/setup-env.js setup');
    console.log('  node scripts/setup-env.js validate');
}
