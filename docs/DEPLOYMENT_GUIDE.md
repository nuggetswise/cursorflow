# Magic Nuggetwise Deployment Guide

## 🚀 NPM Package Deployment

### Prerequisites

1. **NPM Account**: Ensure you have access to the `@cursorflow` organization
2. **Authentication**: Log in to NPM with `npm login`
3. **Build**: Ensure the package builds successfully

### Deployment Steps

#### 1. Prepare the Package

```bash
# Navigate to the MCP package directory
cd packages/nw-mcp

# Clean and build
npm run clean
npm run build

# Verify the build
ls -la dist/
```

#### 2. Test the Build

```bash
# Test the MCP server locally
node dist/mcp-server.js

# Test with a simple JSON-RPC request
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}' | node dist/mcp-server.js
```

#### 3. Publish to NPM

```bash
# Check current version
npm version

# Publish to NPM
npm publish --access public

# Verify publication
npm view @cursorflow/nuggetwise-v0
```

#### 4. Test Installation

```bash
# Test global installation
npm install -g @cursorflow/nuggetwise-v0

# Test the binary
nuggetwise-v0 --help
```

### Version Management

#### Semantic Versioning

- **Patch (1.0.x)**: Bug fixes and minor improvements
- **Minor (1.x.0)**: New features, backward compatible
- **Major (x.0.0)**: Breaking changes

#### Release Process

```bash
# For patch release
npm version patch

# For minor release
npm version minor

# For major release
npm version major

# Publish
npm publish
```

## 🌐 One-Click Installation Setup

### Cursor Deeplink Configuration

The one-click installation uses Cursor's deeplink system to automatically configure the MCP server.

#### Deeplink Format

```typescript
cursor://mcp/add?name=nuggetwise-v0&config=${encodeURIComponent(JSON.stringify({
  "mcpServers": {
    "nuggetwise-v0": {
      "command": "npx",
      "args": ["-y", "@cursorflow/nuggetwise-v0@latest"]
    }
  }
}))}
```

#### Website Integration

```html
<!-- Add to Cursor button -->
<a href="cursor://mcp/add?name=nuggetwise-v0&config=%7B%22mcpServers%22%3A%7B%22nuggetwise-v0%22%3A%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40cursorflow%2Fnuggetwise-v0%40latest%22%5D%7D%7D%7D" 
   class="install-button">
  Add to Cursor
</a>
```

#### JavaScript Implementation

```javascript
function installMagicNuggetwise() {
  const config = {
    mcpServers: {
      "nuggetwise-v0": {
        command: "npx",
        args: ["-y", "@cursorflow/nuggetwise-v0@latest"]
      }
    }
  };
  
  const deeplink = `cursor://mcp/add?name=nuggetwise-v0&config=${encodeURIComponent(JSON.stringify(config))}`;
  
  // Try to open the deeplink
  window.location.href = deeplink;
  
  // Fallback for non-Cursor users
  setTimeout(() => {
    alert("Please install Cursor IDE to use Magic Nuggetwise");
  }, 2000);
}
```

### Manual Installation Instructions

For users who prefer manual installation, provide these instructions:

#### Option 1: NPM Global Installation

```bash
# Install globally
npm install -g @cursorflow/nuggetwise-v0

# Configure in Cursor
# Open Cursor Settings → MCP
# Add server configuration:
{
  "mcpServers": {
    "nuggetwise-v0": {
      "command": "nuggetwise-v0",
      "env": {
        "V0_API_KEY": "v1:your-actual-v0-api-key-here"
      }
    }
  }
}
```

#### Option 2: Local Installation

```bash
# Clone the repository
git clone https://github.com/nuggetswise/cursorflow.git
cd cursorflow/packages/nw-mcp

# Install dependencies
npm install

# Build the package
npm run build

# Configure in Cursor
# Open Cursor Settings → MCP
# Add server configuration:
{
  "mcpServers": {
    "nuggetwise-v0": {
      "command": "node",
      "args": ["/path/to/cursorflow/packages/nw-mcp/dist/mcp-server.js"],
      "env": {
        "V0_API_KEY": "v1:your-actual-v0-api-key-here"
      }
    }
  }
}
```

## 🔧 Environment Configuration

### Required Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `V0_API_KEY` | V0.dev API key | Yes | - |
| `OPENAI_API_KEY` | OpenAI API key | Yes | - |
| `CURSOR_WORKSPACE_PATH` | Cursor workspace path | No | Current directory |
| `NODE_ENV` | Environment mode | No | `development` |

### Configuration Examples

#### Development

```json
{
  "mcpServers": {
    "nuggetwise-v0": {
      "command": "node",
      "args": ["/path/to/nuggetwise-v0/dist/mcp-server.js"],
      "env": {
        "V0_API_KEY": "v1:your-dev-v0-key",
        "OPENAI_API_KEY": "your-dev-openai-key",
        "NODE_ENV": "development"
      }
    }
  }
}
```

#### Production

```json
{
  "mcpServers": {
    "nuggetwise-v0": {
      "command": "npx",
      "args": ["-y", "@cursorflow/nuggetwise-v0@latest"],
      "env": {
        "V0_API_KEY": "v1:your-prod-v0-key",
        "OPENAI_API_KEY": "your-prod-openai-key",
        "NODE_ENV": "production"
      }
    }
  }
}
```

## 📊 Monitoring & Analytics

### Health Checks

Implement health check endpoints for monitoring:

```typescript
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### Error Tracking

Set up error tracking for production:

```typescript
// Error tracking setup
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Send to error tracking service
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  // Send to error tracking service
});
```

## 🔒 Security Considerations

### API Key Security

1. **Environment Variables**: Never hardcode API keys
2. **Key Rotation**: Support for easy key updates
3. **Access Logging**: Track API usage for security
4. **Rate Limiting**: Prevent abuse and excessive usage

### Package Security

1. **Dependency Scanning**: Regular security audits
2. **Code Signing**: Sign packages for authenticity
3. **Vulnerability Monitoring**: Monitor for known vulnerabilities
4. **Update Notifications**: Notify users of security updates

## 🚀 Deployment Checklist

### Pre-Deployment

- [ ] **Build Success**: `npm run build` completes without errors
- [ ] **Tests Pass**: All tests pass successfully
- [ ] **Dependencies**: All dependencies are up to date
- [ ] **Documentation**: README and guides are updated
- [ ] **Version**: Version number is incremented appropriately

### Deployment

- [ ] **NPM Publish**: Package is published to NPM
- [ ] **Installation Test**: Package can be installed globally
- [ ] **Functionality Test**: MCP server works correctly
- [ ] **Deeplink Test**: One-click installation works
- [ ] **Documentation**: Deployment documentation is updated

### Post-Deployment

- [ ] **Monitoring**: Health checks are working
- [ ] **Analytics**: Usage tracking is active
- [ ] **Support**: Support channels are ready
- [ ] **Announcement**: Release is announced to users

## 🔄 Continuous Deployment

### GitHub Actions Workflow

```yaml
name: Deploy to NPM

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - run: npm ci
      - run: npm run build
      - run: npm run test
      
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Automated Testing

```yaml
name: Test

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - run: npm run lint
```

## 📈 Performance Monitoring

### Key Metrics

1. **Installation Success Rate**: Percentage of successful installations
2. **API Response Time**: Average response time for V0 API calls
3. **Error Rate**: Percentage of failed requests
4. **User Engagement**: Active users and usage patterns

### Monitoring Tools

- **Application Performance Monitoring**: New Relic, DataDog
- **Error Tracking**: Sentry, Rollbar
- **Analytics**: Google Analytics, Mixpanel
- **Health Checks**: Uptime monitoring services

---

**Ready to deploy?** Follow the checklist above and ensure all tests pass before publishing to NPM. 