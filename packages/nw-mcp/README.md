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

### Option 1: One-Click Installation (Recommended)

1. **Visit the Magic Nuggetwise website:**
   - Go to [nuggetwise.com](https://nuggetwise.com)
   - Click "Add to Cursor" button
   - Cursor will automatically install the MCP server

2. **Configure your V0 API key:**
   - Get your V0 API key from [v0.dev/settings/api-keys](https://v0.dev/settings/api-keys)
   - Open Cursor Settings → MCP
   - Find the "nuggetwise-v0" server
   - Add this to the "env" section:
   ```json
   "V0_API_KEY": "v1:your-actual-v0-api-key-here"
   ```

3. **Test the installation:**
   - Try `/nuggetwise-v0/status` to check connection
   - Try `/nuggetwise-v0/generate create a button` to test generation

### Option 2: Manual Installation

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

5. **Configure in Cursor:**
   - Open Cursor Settings → MCP
   - Add new server configuration:
   ```json
   {
     "mcpServers": {
       "nuggetwise-v0": {
         "command": "node",
         "args": ["/path/to/packages/nw-mcp/dist/mcp-server.js"],
         "env": {
           "V0_API_KEY": "v1:your-actual-v0-api-key-here"
         }
       }
     }
   }
   ```

## ⚙️ Configuration

### V0 API Key Setup

Magic Nuggetwise requires a V0 API key to generate components. Here's how to set it up:

1. **Get your V0 API key:**
   - Visit [v0.dev](https://v0.dev) and sign up (free!)
   - Go to Settings → API Keys → Create New Key
   - Copy your key (starts with "v1:")

2. **Configure in Cursor:**
   - Open Cursor Settings → MCP
   - Find the "nuggetwise-v0" server
   - Add this to the "env" section:
   ```json
   "V0_API_KEY": "v1:your-actual-v0-api-key-here"
   ```

3. **Test your setup:**
   - Run `/nuggetwise-v0/status` to check connection
   - Run `/nuggetwise-v0/generate create a button` to test generation

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `3001` | No |
| `NODE_ENV` | Environment mode | `development` | No |
| `OPENAI_API_KEY` | OpenAI API key | - | Yes |
| `V0_API_KEY` | V0.dev API key | - | Yes |
| `SLACK_WEBHOOK_URL` | Slack webhook URL | - | No |
| `CURSOR_WORKSPACE_PATH` | Cursor workspace path | `/workspace` | No |
| `MAX_COST` | Daily budget limit | `10.0` | No |
| `MAX_TIME` | Request timeout (ms) | `300000` | No |
| `MAX_RETRIES` | Max retry attempts | `3` | No |
| `COST_PER_TOKEN` | Cost per token | `0.00003` | No |

## 🚀 Usage

### Available Commands

Once installed, you can use these commands in Cursor:

- **`/nuggetwise-v0/generate <prompt>`** - Generate React components
- **`/nuggetwise-v0/update <message>`** - Update existing components
- **`/nuggetwise-v0/status`** - Check API key status and connection
- **`/nuggetwise-v0/sync`** - Pull changes from V0 web interface
- **`/nuggetwise-v0/connect <v0-url>`** - Connect to existing V0 project

### Examples

```bash
# Generate a button component
/nuggetwise-v0/generate create a modern button with hover effects

# Update existing component
/nuggetwise-v0/update make the button larger and add a loading state

# Check connection status
/nuggetwise-v0/status
```

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

## 🔧 Troubleshooting

### Common Issues

#### "V0 API Key Required" Error
**Problem**: You're getting setup instructions instead of component generation.

**Solution**:
1. Get your V0 API key from [v0.dev/settings/api-keys](https://v0.dev/settings/api-keys)
2. Open Cursor Settings → MCP
3. Add `"V0_API_KEY": "v1:your-key-here"` to the env section
4. Restart Cursor if needed

#### "Invalid API Key" Error
**Problem**: Your API key is not working.

**Solution**:
1. Check your key at [v0.dev/settings/api-keys](https://v0.dev/settings/api-keys)
2. Ensure it starts with "v1:"
3. Try copying it again
4. Check if you have sufficient credits

#### "Insufficient Credits" Error
**Problem**: You don't have enough V0 credits.

**Solution**:
1. Visit [v0.dev](https://v0.dev) to add funds
2. Check your current credit balance
3. Consider upgrading your plan

#### Installation Issues
**Problem**: The MCP server won't start.

**Solution**:
1. Try restarting Cursor
2. Check your internet connection
3. Verify Cursor version compatibility
4. Check the MCP server logs in Cursor's developer tools

### Getting Help

- **Documentation**: Visit [docs.nuggetwise.com](https://docs.nuggetwise.com)
- **Support**: Create an issue in the repository
- **Community**: Join our Discord for peer help

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