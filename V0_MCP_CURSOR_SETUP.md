# V0 Integration through MCP in Cursor IDE

## 🚀 **One-Click Installation**

### **Install V0 MCP Server in Cursor**

Click the button below to automatically install the V0 MCP server in Cursor IDE:

[Add V0 MCP Server to Cursor](cursor://anysphere.cursor-deeplink/mcp/install?name=nuggetwise-v0&config=eyJudWdnZXR3aXNlLXYwIjp7ImNvbW1hbmQiOiJub2RlIiwiYXJncyI6WyIke3dvcmtzcGFjZUZvbGRlcn0vcGFja2FnZXMvbnctbWNwL3NyYy9zaW1wbGUtbWNwLXNlcnZlci5qcyJdLCJlbnYiOnsiTk9ERV9FTlYiOiJkZXZlbG9wbWVudCIsIlYwX0FQSV9LRVkiOiIke2VudjpWMF9BUElfS0VZfSIsIk9QRU5BSV9BUElfS0VZIjoiJHtlbnY6T1BFTkFJX0FQSV9LRVl9In19fQ==)

### **Manual Installation**

If the button doesn't work, you can manually install by:

1. **Copy this link** and paste it in your browser:
   ```
   cursor://anysphere.cursor-deeplink/mcp/install?name=nuggetwise-v0&config=eyJudWdnZXR3aXNlLXYwIjp7ImNvbW1hbmQiOiJub2RlIiwiYXJncyI6WyIke3dvcmtzcGFjZUZvbGRlcn0vcGFja2FnZXMvbnctbWNwL3NyYy9zaW1wbGUtbWNwLXNlcnZlci5qcyJdLCJlbnYiOnsiTk9ERV9FTlYiOiJkZXZlbG9wbWVudCIsIlYwX0FQSV9LRVkiOiIke2VudjpWMF9BUElfS0VZfSIsIk9QRU5BSV9BUElfS0VZIjoiJHtlbnY6T1BFTkFJX0FQSV9LRVl9In19fQ==
   ```

2. **Follow the prompts** to install the MCP server

## 🛠️ **Prerequisites**

Before using the V0 MCP server, ensure you have:

1. **V0 API Key**: Set the `V0_API_KEY` environment variable
2. **REST API Server**: The local MCP server must be running on port 3001
3. **Node.js**: Version 18+ installed

## 🎯 **How to Use**

### **In Cursor Chat**

Once installed, you can use V0 generation directly in Cursor Chat:

```
@nuggetwise-v0 v0_generate "Create a login form with email and password fields"
```

### **Available Tools**

#### **v0_generate**
Generate React components using V0 AI

**Parameters:**
- `prompt` (required): Description of the component to generate
- `modelId` (optional): V0 model to use (`v0-1.5-sm`, `v0-1.5-md`, `v0-1.5-lg`)
- `saveToWorkspace` (optional): Whether to save generated files (default: true)

**Example:**
```
@nuggetwise-v0 v0_generate "a blue button with white text"
```

#### **v0_continue**
Continue a V0 conversation

**Parameters:**
- `chatId` (required): V0 chat ID to continue
- `message` (required): Message to send

**Example:**
```
@nuggetwise-v0 v0_continue "Make the button larger"
```

## 🔧 **Technical Details**

### **Architecture**

The V0 MCP integration uses a two-tier architecture:

1. **MCP Server** (`packages/nw-mcp/src/simple-mcp-server.js`)
   - Implements the MCP protocol
   - Handles JSON-RPC communication with Cursor
   - Provides tool definitions and execution

2. **REST API Server** (`packages/nw-mcp/src/index.ts`)
   - Handles V0 API integration
   - Manages component generation and file saving
   - Provides the actual V0 functionality

### **MCP Protocol Implementation**

The MCP server implements the standard MCP protocol:

- **Initialization**: Responds to `initialize` requests
- **Tool Listing**: Provides `tools/list` with available V0 tools
- **Tool Execution**: Handles `tools/call` for V0 generation

### **Enhanced Error Handling**

The MCP server includes comprehensive error handling:

```javascript
// Error handling in tool execution
try {
  const result = await this.v0Client.generateComponents(prompt, options);
  return {
    content: [{ type: 'text', text: formattedResponse }]
  };
} catch (error) {
  console.error('❌ MCP Tool error:', error);
  return {
    content: [{
      type: 'text',
      text: `❌ **V0 Generation Failed**\n\n` +
            `**Error**: ${error.message}\n` +
            `**Type**: ${error.constructor.name}\n` +
            `**Timestamp**: ${new Date().toISOString()}\n\n` +
            `**Troubleshooting**:\n` +
            `- Check your V0 API key is valid\n` +
            `- Verify the REST API server is running\n` +
            `- Check network connectivity`
    }],
    isError: true
  };
}
```

### **Environment Validation**

The MCP server validates environment variables on startup:

```javascript
function validateEnvironment() {
  const required = ['V0_API_KEY', 'OPENAI_API_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    console.error('Please set these variables in your .env file');
    process.exit(1);
  }
  
  console.log('✅ Environment validation passed');
}
```

### **Response Format**

The MCP server returns responses in the standard MCP format with enhanced formatting:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "✅ **V0 Component Generated Successfully!**\n\n📝 **Generated Code:**\n```tsx\n${code}\n```\n\n🌐 **Live Preview**: ${previewUrl}\n💬 **V0 Chat**: ${chatUrl}\n\n🎨 **Files Saved**: ${files.length} files created in workspace"
      }
    ]
  }
}
```

## 🚀 **Getting Started**

### **Step 1: Environment Setup**

1. **Set Environment Variables**:
   ```bash
   # Create .env file in packages/nw-mcp/
   V0_API_KEY=your_v0_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   NODE_ENV=development
   ```

2. **Validate Environment**:
   ```bash
   cd packages/nw-mcp
   node -e "require('./src/simple-mcp-server.js').validateEnvironment()"
   ```

### **Step 2: Start the REST API Server**

```bash
cd packages/nw-mcp
npm run dev
```

### **Step 3: Test the Integration**

```bash
# Test MCP server initialization
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{"tools":{}},"clientInfo":{"name":"test","version":"1.0.0"}}}' | node src/simple-mcp-server.js

# Test V0 generation
echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"v0_generate","arguments":{"prompt":"a simple red button"}}}' | node src/simple-mcp-server.js
```

## ⚙️ **Advanced Configuration**

### **Auto-Run Configuration**

To enable automatic V0 generation without approval:

```json
// .cursor/mcp.json
{
  "mcpServers": {
    "nuggetwise-v0": {
      "command": "node",
      "args": ["${workspaceFolder}/packages/nw-mcp/src/simple-mcp-server.js"],
      "env": {
        "NODE_ENV": "development",
        "V0_API_KEY": "${env:V0_API_KEY}",
        "OPENAI_API_KEY": "${env:OPENAI_API_KEY}"
      },
      "autoRun": true,
      "description": "V0 AI-powered component generation"
    }
  }
}
```

### **Performance Optimization**

```javascript
// Add to MCP server for better performance
const performanceConfig = {
  maxConcurrentRequests: 5,
  requestTimeout: 30000,
  retryAttempts: 3,
  cacheEnabled: true,
  cacheTTL: 300000 // 5 minutes
};
```

## 📋 **Implementation Checklist**

### **Phase 1: Core Setup** ✅
- [x] **MCP Server Implementation**: Basic MCP protocol support
- [x] **V0 Integration**: REST API server with V0 SDK
- [x] **Tool Definitions**: v0_generate and v0_continue tools
- [x] **Basic Error Handling**: Try-catch blocks in tool execution
- [x] **Response Formatting**: Standard MCP response format

### **Phase 2: Enhanced Error Handling** 🔄
- [ ] **Environment Validation**: Startup checks for required variables
- [ ] **API Error Handling**: Specific error messages for V0 API failures
- [ ] **Network Error Handling**: Timeout and connectivity error handling
- [ ] **User-Friendly Error Messages**: Clear troubleshooting guidance
- [ ] **Error Logging**: Detailed error logging for debugging

### **Phase 3: User Experience** 📋
- [ ] **Auto-Run Configuration**: Enable automatic tool execution
- [ ] **Enhanced Response Formatting**: Better markdown formatting
- [ ] **Progress Indicators**: Show generation progress
- [ ] **Tool Descriptions**: Detailed tool documentation
- [ ] **Usage Examples**: Comprehensive examples for each tool

### **Phase 4: Advanced Features** 🚀
- [ ] **Performance Optimization**: Request caching and optimization
- [ ] **Rate Limiting**: Prevent API abuse
- [ ] **Configuration Validation**: Validate all settings
- [ ] **Health Checks**: Server health monitoring
- [ ] **Metrics Collection**: Usage analytics

### **Phase 5: Testing & Validation** 🧪
- [ ] **Unit Tests**: Test individual MCP server functions
- [ ] **Integration Tests**: Test V0 API integration
- [ ] **End-to-End Tests**: Test complete workflow
- [ ] **Performance Tests**: Load testing and optimization
- [ ] **User Acceptance Tests**: Real-world usage testing

### **Phase 6: Documentation & Support** 📚
- [ ] **Troubleshooting Guide**: Common issues and solutions
- [ ] **API Documentation**: Complete API reference
- [ ] **Video Tutorials**: Step-by-step setup guides
- [ ] **Community Support**: Discord/forum integration
- [ ] **FAQ Section**: Frequently asked questions

## 🔍 **Troubleshooting Guide**

### **Common Issues**

#### **1. "MCP server not found"**
**Symptoms**: Cursor can't find the MCP server
**Solutions**:
- Verify the MCP server is running: `ps aux | grep simple-mcp-server`
- Check the path in `.cursor/mcp.json` is correct
- Restart Cursor IDE after configuration changes

#### **2. "V0 API key not found"**
**Symptoms**: Environment validation fails
**Solutions**:
- Set `V0_API_KEY` in your environment variables
- Check the `.env` file in `packages/nw-mcp/`
- Verify the API key is valid at [v0.dev](https://v0.dev)

#### **3. "Tool execution failed"**
**Symptoms**: V0 generation returns errors
**Solutions**:
- Check REST API server is running on port 3001
- Verify network connectivity to V0 API
- Check V0 API rate limits and quotas

#### **4. "Environment validation failed"**
**Symptoms**: Missing required environment variables
**Solutions**:
- Run environment validation: `node -e "require('./src/simple-mcp-server.js').validateEnvironment()"`
- Set all required variables in `.env` file
- Restart the MCP server after environment changes

### **Debug Mode**

Enable debug logging for troubleshooting:

```bash
# Set debug environment variable
export DEBUG_MCP=true

# Start MCP server with debug logging
DEBUG_MCP=true node packages/nw-mcp/src/simple-mcp-server.js
```

### **MCP Logs in Cursor**

View MCP server logs in Cursor:
1. Open Output panel (Ctrl+Shift+U)
2. Select "MCP Logs" from dropdown
3. Check for connection errors and server issues

## 📊 **Performance Monitoring**

### **Key Metrics to Monitor**

- **Response Time**: V0 generation completion time
- **Success Rate**: Percentage of successful generations
- **Error Rate**: Types and frequency of errors
- **API Usage**: V0 API calls and rate limits
- **User Activity**: Tool usage patterns

### **Optimization Tips**

1. **Use appropriate V0 models**: `v0-1.5-sm` for simple components, `v0-1.5-lg` for complex ones
2. **Enable caching**: Cache frequently requested components
3. **Batch requests**: Group multiple generations when possible
4. **Monitor rate limits**: Stay within V0 API limits

## 🔗 **References**

- [Cursor MCP Documentation](https://docs.cursor.com/en/context/mcp)
- [V0 API Documentation](https://v0.dev/docs/api)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [Cursor IDE Documentation](https://docs.cursor.com/)

## 📝 **License**

This MCP server is part of the CursorFlow project and follows the same licensing terms. 