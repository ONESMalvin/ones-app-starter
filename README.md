# ONES App NestJS Template

A full-stack template for building ONES applications with NestJS backend and React frontend.

## Features

- 🚀 **NestJS Backend** - TypeScript-based Node.js framework
- ⚛️ **React Frontend** - Modern React application built with Vite
- 🎨 **ONES Design** - Integrated ONES design system components
- 📦 **TypeScript** - Full-stack TypeScript support
- 🗄️ **TypeORM** - Database ORM support
- 🔧 **Development Tools** - ESLint, Prettier, Jest testing
- 📱 **Responsive Design** - Mobile-friendly UI

## Quick Start

### Create New Project with Template

```bash
# Using local CLI (no publish)
npm i
npm link          # link create-ones-app to your system
create-ones-app my-app

# If published, you could also run:
# npx create-ones-app@latest my-app

# Or clone template directly (manual)
# git clone https://github.com/your-username/ones-app-nestjs-template.git my-app
# cd my-app
```

### Configure Project

1. Copy environment configuration file:
```bash
cp env.example .env
```

2. Edit `.env` file and configure the following variables:
```env
APP_ID=your_app_id
APP_NAME=Your App Name
APP_DESCRIPTION=Your app description
ONES_SERVER_URL=https://your-ones-server.com
RELAY_TOKEN=your_relay_token
```

3. Update configuration information in `manifest.json`

### Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd web
npm install
cd ..
```

## Development

### Start Development Server

```bash
# Start backend development server (with proxy)
npm run start:dev

# Or start separately
npm run dev:nest    # Start NestJS server
npm run dev:agent   # Start ONES agent
```

### Frontend Development

```bash
cd web
npm run dev         # Start frontend development server
npm run build       # Build frontend resources
```

### Build Project

```bash
# Build backend
npm run build

# Build frontend
cd web && npm run build
```

### Run Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Project Structure

```
├── src/                    # NestJS backend source code
│   ├── app.controller.ts   # Main controller
│   ├── app.module.ts       # Main module
│   ├── dto/               # Data transfer objects
│   ├── entities/          # Database entities
│   └── services/          # Business services
├── web/                   # React frontend source code
│   ├── src/              # Frontend source code
│   ├── dist/             # Build output
│   └── package.json      # Frontend dependencies
├── test/                 # Test files
├── manifest.json         # ONES app configuration
├── template.json         # Template configuration
└── package.json          # Backend dependencies and scripts
```

## Configuration

### manifest.json

ONES app configuration file, including:
- App ID and basic information
- Authentication configuration
- Lifecycle callbacks
- OAuth permissions
- Extension feature configuration

### Environment Variables

Create `.env` file and configure the following variables:
- `APP_ID`: ONES app ID
- `APP_NAME`: App name
- `ONES_SERVER_URL`: ONES server address
- `RELAY_TOKEN`: Development proxy token
- `PORT`: Server port (default: 3000)

The development agent will automatically load these variables from the `.env` file when running `npm run dev:agent`.

## Deployment

### Build Production Version

```bash
# Build backend
npm run build

# Build frontend
cd web && npm run build
```

### Start Production Server

```bash
npm run start:prod
```

## Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [ONES Development Documentation](https://developer.ones.com/)
- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## License

MIT License
