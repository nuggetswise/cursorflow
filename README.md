# CursorFlow - PRD-to-Code Platform

A comprehensive platform that combines Cursor IDE with Vercel's v0 Platform API to transform Product Requirements Documents (PRDs) into production-ready code.

## 🚀 **Quick Start - V0 Integration**

### **Install V0 MCP Server in Cursor (One-Click)**

[Add V0 MCP Server to Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=nuggetwise-v0&config=eyJudWdnZXR3aXNlLXYwIjp7ImNvbW1hbmQiOiJub2RlIiwiYXJncyI6WyIke3dvcmtzcGFjZUZvbGRlcn0vcGFja2FnZXMvbnctbWNwL3NyYy9zaW1wbGUtbWNwLXNlcnZlci5qcyJdLCJlbnYiOnsiTk9ERV9FTlYiOiJkZXZlbG9wbWVudCIsIlYwX0FQSV9LRVkiOiIke2VudjpWMF9BUElfS0VZfSIsIk9QRU5BSV9BUElfS0VZIjoiJHtlbnY6T1BFTkFJX0FQSV9LRVl9In19fQ==)

**After installation, use in Cursor Chat:**
```
@nuggetwise-v0 v0_generate "Create a login form with email and password"
```

📖 **[Full V0 MCP Setup Guide](V0_MCP_CURSOR_SETUP.md)**

## 🏗️ Project Structure

```
cursorflow/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js App Router
│   │   ├── components/      # React components
│   │   ├── services/        # Frontend services
│   │   ├── utils/           # Frontend utilities
│   │   └── types/           # Frontend types
│   ├── public/              # Static assets
│   ├── tests/               # Frontend tests
│   └── package.json         # Frontend dependencies
├── backend/                  # Express.js backend services
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   ├── config/          # Configuration
│   │   └── utils/           # Backend utilities
│   └── package.json         # Backend dependencies
├── shared/                   # Shared types and utilities
│   ├── src/
│   │   ├── types/           # Shared TypeScript types
│   │   ├── utils/           # Shared utility functions
│   │   └── constants/       # Shared constants
│   └── package.json         # Shared dependencies
├── prompts/                  # AI prompt files
│   ├── prd-generation/      # PRD generation prompts
│   ├── design-critique/     # Design analysis prompts
│   ├── code-analysis/       # Code analysis prompts
│   └── ...                  # Other prompt categories
├── implementation-plan/      # 📋 Complete implementation documentation
│   ├── README.md            # Main project overview
│   ├── ARCHITECTURE.md      # Technical architecture
│   ├── DEVELOPMENT_PLAN.md  # 5-week development timeline
│   ├── API_SPECS.md         # API specifications
│   ├── FRONTEND_SPECS.md    # Frontend requirements
│   ├── BACKEND_SPECS.md     # Backend specifications
│   ├── CURSOR_EXTENSION.md  # Cursor IDE extension
│   ├── DEPLOYMENT.md        # Deployment guide
│   ├── TESTING.md           # Testing strategy
│   ├── BUSINESS_MODEL.md    # Business model & pricing
│   └── ...                  # Additional documentation
├── package.json              # Root package.json (monorepo)
└── README.md                 # This file
```

## 📁 Package Structure

### Frontend (`frontend/`)
Next.js application with App Router, featuring:
- **Dashboard** - Project management interface
- **AI Analysis** - Design critique and code analysis
- **PRD Generation** - AI-powered PRD creation
- **Project Management** - Full CRUD operations
- **Transparent AI** - Explainable AI reasoning

### Backend (`backend/`)
Express.js API server with:
- **RESTful APIs** - Project, PRD, and analysis endpoints
- **AI Services** - OpenAI integration for PRD generation
- **v0 Integration** - Vercel v0 Platform API integration
- **Authentication** - JWT-based auth with Firebase
- **Database** - Firestore integration

### Shared (`shared/`)
Common types and utilities:
- **TypeScript Types** - Shared interfaces and types
- **Utility Functions** - Common helper functions
- **Constants** - Application constants and enums

## 🎯 Key Features

### 1. AI-Powered PRD Generation
- Generate comprehensive PRDs from simple descriptions
- Transparent AI reasoning with confidence scores
- Industry-specific prompt templates
- Stakeholder-focused analysis

### 2. Design Critique System
- Automated UX/UI analysis
- Accessibility compliance checking
- Performance optimization suggestions
- Conversion optimization insights

### 3. Code Analysis
- Automated code quality assessment
- Security vulnerability detection
- Performance bottleneck identification
- Maintainability recommendations

### 4. Project Management
- Full project lifecycle management
- Team collaboration features
- Real-time progress tracking
- Version control integration

### 5. v0 Integration
- Seamless PRD-to-code generation
- Automatic deployment to Vercel
- Live preview capabilities
- Production-ready code output

## 🛠️ Development

### Available Scripts

#### Root Level
```bash
npm run dev              # Start both frontend and backend
npm run build            # Build all packages
npm run test             # Run all tests
npm run lint             # Lint all packages
npm run format           # Format all code
npm run install:all      # Install dependencies for all packages
```

#### Frontend
```bash
cd frontend
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run test             # Run tests
npm run lint             # Lint code
```

#### Backend
```bash
cd backend
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run test             # Run tests
npm run lint             # Lint code
```

### Testing
```bash
# Run all tests
npm run test

# Run specific test suites
npm run test:frontend
npm run test:backend

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### Code Quality
```bash
# Lint all packages
npm run lint

# Format code
npm run format

# Type checking
npm run type-check
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Backend (Vercel Functions)
```bash
cd backend
npm run build
# Deploy to Vercel Functions
```

### Environment Setup
1. Set up Firebase project
2. Configure OpenAI API
3. Set up Vercel v0 API access
4. Configure environment variables

## 📚 Documentation

📋 **Complete Implementation Plan**: See [`implementation-plan/`](./implementation-plan/) folder for detailed documentation:

- [**Main Overview**](./implementation-plan/README.md) - Complete project overview
- [**Architecture Guide**](./implementation-plan/ARCHITECTURE.md) - Technical system design
- [**Development Plan**](./implementation-plan/DEVELOPMENT_PLAN.md) - 5-week development timeline
- [**API Specifications**](./implementation-plan/API_SPECS.md) - API endpoints and integration
- [**Frontend Specifications**](./implementation-plan/FRONTEND_SPECS.md) - React/Next.js requirements
- [**Backend Specifications**](./implementation-plan/BACKEND_SPECS.md) - Express.js services
- [**Cursor Extension**](./implementation-plan/CURSOR_EXTENSION.md) - IDE integration
- [**Deployment Guide**](./implementation-plan/DEPLOYMENT.md) - Cloud infrastructure
- [**Testing Strategy**](./implementation-plan/TESTING.md) - Quality assurance
- [**Business Model**](./implementation-plan/BUSINESS_MODEL.md) - Pricing and go-to-market
- [**AI Design Critique**](./implementation-plan/AI_DESIGN_CRITIQUE_README.md) - AI analysis system
- [**Transparent AI Strategy**](./implementation-plan/TRANSPARENT_AI_PROMPTS_STRATEGY.md) - Explainable AI
- [**Prompt Organization**](./implementation-plan/PROMPT_ORGANIZATION_GUIDE.md) - AI prompt management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [`implementation-plan/`](./implementation-plan/) folder
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

## 🎯 Roadmap

- [ ] **Phase 1**: Core MVP (Current)
  - [x] Project structure and setup
  - [x] Basic UI components
  - [x] API routes
  - [ ] Database integration
  - [ ] Authentication system

- [ ] **Phase 2**: AI Integration
  - [ ] OpenAI integration
  - [ ] v0 Platform integration
  - [ ] Transparent AI reasoning
  - [ ] Prompt optimization

- [ ] **Phase 3**: Advanced Features
  - [ ] Real-time collaboration
  - [ ] Advanced analytics
  - [ ] Enterprise features
  - [ ] Performance optimization

---

**Built with ❤️ by the CursorFlow Team** 