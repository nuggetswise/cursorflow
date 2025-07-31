# Nuggetwise MCP Server

The Nuggetwise MCP (Model Context Protocol) Server is the core component of the CursorFlow hybrid platform, providing rapid AI-powered code generation through a 7-agent orchestration system.

## 🚀 Features

- **7-Agent Orchestration**: Intent Analysis → UX Pattern Selection → Validation → UI Requirements → V0 Prompt Building
- **Budget Management**: Real-time cost tracking and limits
- **Timeout Protection**: Request timeout management
- **V0.dev Integration**: Seamless component generation
- **Rate Limiting**: API protection and abuse prevention
- **Health Monitoring**: Comprehensive health checks and status endpoints

## 📋 Prerequisites

- Node.js 18+ 
- OpenAI API key
- V0.dev API key (optional for testing)
- Cursor IDE (for full integration)

## 🛠️ Installation

1. **Clone and navigate to the MCP server directory:**
   ```bash
   cd packages/nw-mcp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp env.example .env
   # Edit .env with your API keys and configuration
   ```

4. **Build the project:**
   ```bash
   npm run build
   ```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `NODE_ENV` | Environment mode | `development` |
| `OPENAI_API_KEY` | OpenAI API key | Required |
| `V0_API_KEY` | V0.dev API key | Optional |
| `SLACK_WEBHOOK_URL` | Slack webhook URL | Optional |
| `CURSOR_WORKSPACE_PATH` | Cursor workspace path | `/workspace` |
| `MAX_COST` | Daily budget limit | `10.0` |
| `MAX_TIME` | Request timeout (ms) | `300000` |
| `MAX_RETRIES` | Max retry attempts | `3` |
| `COST_PER_TOKEN` | Cost per token | `0.00003` |

## 🚀 Usage

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

### Testing

```bash
# Run the test script
node test-build.js
```

## 📡 API Endpoints

### Health Check
```http
GET /health
```

### Build Request
```http
POST /api/build
Content-Type: application/json
x-user-id: your-user-id

{
  "prompt": "Create a todo app with form and list",
  "mode": "quick-build",
  "userId": "user-123",
  "projectId": "optional-project-id",
  "budget": 5.0,
  "timeout": 120000
}
```

### Export Project
```http
POST /api/export/:chatId
```

### Project Status
```http
GET /api/status/:chatId
```

### Budget Status
```http
GET /api/budget/:userId
```

## 🏗️ Architecture

### Agent Orchestration Flow

```
User Prompt
    ↓
Intent Analysis Agent
    ↓
UX Pattern Selector Agent
    ↓
Validation Agent
    ↓
UI Requirement Synthesizer Agent
    ↓
V0 Prompt Builder Agent
    ↓
V0.dev Generation
    ↓
Response with Components
```

### Components

- **BaseAgent**: Abstract base class for all agents
- **IntentAnalysisAgent**: Analyzes user intent and requirements
- **UXPatternSelectorAgent**: Selects appropriate UX patterns
- **ValidationAgent**: Validates feasibility and complexity
- **UIRequirementSynthesizerAgent**: Synthesizes UI requirements
- **V0PromptBuilderAgent**: Creates optimized V0.dev prompts
- **AgentOrchestrator**: Coordinates all agents
- **V0Client**: Handles V0.dev API integration
- **BudgetGuard**: Manages cost limits
- **TimeoutGuard**: Manages request timeouts

## 🔧 Development

### Project Structure

```
src/
├── agents/           # AI agents
├── services/         # Core services
├── middleware/       # Express middleware
├── types/           # TypeScript types
├── utils/           # Utility functions
└── index.ts         # Main server file
```

### Adding New Agents

1. Extend `BaseAgent` class
2. Implement `execute()` method
3. Add to `AgentOrchestrator`
4. Update types and interfaces

### Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run with coverage
npm run test:coverage
```

## 📊 Monitoring

### Health Metrics

- Server uptime
- Request count
- Error rates
- Response times
- Budget usage

### Logging

The server uses structured logging with different levels:
- `info`: General information
- `warn`: Warnings and non-critical issues
- `error`: Errors and failures
- `debug`: Detailed debugging information

## 🔒 Security

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API abuse prevention
- **Input Validation**: Request validation with Zod
- **Budget Limits**: Cost protection
- **Timeout Protection**: Request timeout management

## 🚀 Deployment

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

### Environment Variables

Ensure all required environment variables are set in production:

```bash
NODE_ENV=production
OPENAI_API_KEY=your_production_key
V0_API_KEY=your_v0_key
MAX_COST=50.0
MAX_TIME=600000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the implementation plan

---

**Built with ❤️ by the CursorFlow Team** 