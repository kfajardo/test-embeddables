## Overview

This application provides a complete payment integration solution featuring:

- **Moov Integration**: Payment processing, account management, wallet functionality
- **Plaid Integration**: Bank account linking and verification
- **React Router Frontend**: Modern React application with server-side rendering
- **Express Backend**: RESTful API server handling payment operations

## Project Structure

```
bison-payment-embeddable-flow/
├── client/                # Frontend React Router application
│   ├── app/               # Application code
│   │   ├── routes/        # Route components
│   │   ├── welcome/       # Welcome page assets
│   │   ├── app.css        # Global styles
│   │   ├── root.tsx       # Root component
│   │   └── routes.ts      # Route definitions
│   ├── public/            # Static assets
│   └── package.json       # Client dependencies
│
├── server/                # Backend Express server
│   ├── server.js          # Main server file
│   └── package.json       # Server dependencies
│
├── .env                   # Environment variables (create from .env.example)
├── .env.example           # Environment template
├── package.json           # Root workspace configuration
└── README.md              # This file
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0

You'll also need:

- **Moov Account**: Sign up at [moov.io](https://moov.io)
- **Plaid Account**: Sign up at [plaid.com](https://plaid.com)

## Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd bison-payment-embeddable-flow
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

   This will install dependencies for both client and server workspaces.

## Configuration

1. **Create environment file:**

   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables:**

   Edit the `.env` file with your credentials:

   ```env
   # Moov Configuration
   MOOV_ACCOUNT_ID=your_moov_account_id
   MOOV_SECRET=your_moov_secret_key
   MOOV_PUBLIC_KEY=your_moov_public_key
   MOOV_API_BASE_URL=https://api.moov.io

   # Plaid Configuration
   PLAID_CLIENT_ID=your_plaid_client_id
   PLAID_API_KEY=your_plaid_api_key

   # Server Configuration
   PORT=3000
   ```

3. **Optional: Enable HTTPS (Recommended for Production)**

   For local HTTPS development, install and configure SSL certificates:

   ```bash
   # Install mkcert (if not already installed)
   # macOS
   brew install mkcert

   # Windows (with Chocolatey)
   choco install mkcert

   # Linux
   # Follow instructions at: https://github.com/FiloSottile/mkcert

   # Generate certificates
   mkcert -install
   mkcert localhost
   ```

   This will create `localhost-key.pem` and `localhost.pem` files that the server will automatically detect and use.

## Running the Application

### Development Mode

**Run both client and server concurrently:**

```bash
npm run dev
```

This command starts:

- Client dev server on `http://localhost:5173`
- Backend server on `http://localhost:3000` (or HTTPS if certificates exist)

**Run individually:**

```bash
# Run only the client
npm run dev:client

# Run only the server
npm run dev:server
```

### Production Build

1. **Build the application:**

   ```bash
   npm run build
   ```

2. **Start production servers:**

   ```bash
   # Start both
   npm run start:client & npm run start:server

   # Or individually
   npm run start:client
   npm run start:server
   ```

### Type Checking

```bash
npm run typecheck
```

## API Endpoints

The backend server provides the following endpoints:

### Health Check

- `GET /health` - Server health status

### Authentication & Tokens

- `GET /accessToken` - Get Moov access token
- `POST /refreshAccessToken` - Refresh Moov access token with account scope
- `POST /plaid/create-token` - Create Plaid Link token
- `POST /plaid/moov-processor-token` - Exchange Plaid public token for processor token

### Account Management

- `GET /accounts` - Get all Moov accounts
- `POST /create-account` - Create new Moov business account with full onboarding
- `GET /accounts/:accountID/payment-methods` - Get payment methods for account
- `GET /accounts/:accountID/wallet` - Get wallet information for account
- `POST /accounts/:accountID/add-plaid-link` - Link Plaid bank account to Moov account

### Server Ports

- **Backend**: `http://localhost:3000` (or port specified in `.env`)
- **Frontend Dev**: `http://localhost:5173`
- **HTTPS** (if configured): `https://localhost:3000`

## Technologies Used

### Frontend

- **React 19** - UI library
- **React Router 7** - Routing and SSR framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Plaid Link** - Bank account linking UI

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework
- **Moov API** - Payment processing
- **Plaid API** - Bank account verification
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

### Development Tools

- **concurrently** - Run multiple npm scripts
- **nodemon** - Auto-restart server on changes
- **npm workspaces** - Monorepo management

## Security Notes

1. **Never commit** the `.env` file to version control
2. Keep your API keys and secrets secure
3. Use HTTPS in production environments
4. Regularly rotate API credentials
5. Follow Moov and Plaid security best practices

## Development Notes

- The server supports both HTTP and HTTPS (automatically detects SSL certificates)
- CORS is configured for `http://localhost:5173` and `https://localhost:5173`
- The client runs on port 5173, server on port 3000 by default
- All Moov API calls use the v2025.07.00 API version
- Plaid is configured for sandbox environment

## Troubleshooting

**Port already in use:**

```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port in .env
PORT=3001
```

**Module not found errors:**

```bash
# Clean install
rm -rf node_modules package-lock.json
rm -rf client/node_modules client/package-lock.json
rm -rf server/node_modules server/package-lock.json
npm install
```

**SSL Certificate issues:**

```bash
# Regenerate certificates
mkcert -install
mkcert localhost
```
