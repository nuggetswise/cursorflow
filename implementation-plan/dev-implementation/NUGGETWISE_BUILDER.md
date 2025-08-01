# V0 Integration through MCP in Cursor IDE

## 🚀 **One-Click Installation**

### **Install V0 MCP Server in Cursor**

**Generate the latest install link:**

```bash
node scripts/generate-mcp-link.js
```

This will generate a fresh install link with the current configuration.

### **Manual Installation**

If the button doesn't work, you can manually install by:

1. **Generate the install link** using the script above
2. **Copy the generated link** and paste it in your browser
3. **Follow the prompts** to install the MCP server

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
   - Implements the MCP protocol using ES modules
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

### **Configuration Management**

The MCP server uses dynamic configuration:

```json
// mcp-config.json
{
  "nuggetwise-v0": {
    "command": "node",
    "args": ["${workspaceFolder}/packages/nw-mcp/src/simple-mcp-server.js"],
    "env": {
      "NODE_ENV": "development",
      "V0_API_KEY": "${env:V0_API_KEY}",
      "OPENAI_API_KEY": "${env:OPENAI_API_KEY}"
    }
  }
}
```

### **Install Link Generation**

The install link is generated dynamically:

```bash
# Generate fresh install link
node scripts/generate-mcp-link.js
```

This script:
1. Reads `mcp-config.json`
2. Converts to base64
3. Generates the Cursor deeplink
4. Displays installation instructions

### **Enhanced Error Handling**

The MCP server includes comprehensive error handling:

```javascript
// Error handling in tool execution
try {
  const response = await fetch('http://localhost:3001/tools/v0.generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, options: { modelId, saveToWorkspace } })
  });
  
  const result = await response.json();
  
  if (result.success) {
    // Handle success
  } else {
    // Handle API errors
  }
} catch (error) {
  // Handle network/connection errors
}
```

## 🚀 **Getting Started**

### **1. Environment Setup**

```bash
# Set required environment variables
export V0_API_KEY="your_v0_api_key_here"
export OPENAI_API_KEY="your_openai_api_key_here"

# Verify environment
echo "V0_API_KEY: $V0_API_KEY"
echo "OPENAI_API_KEY: $OPENAI_API_KEY"
```

### **2. Start the REST API Server**

```bash
# Start the backend server
cd packages/nw-mcp
npm run dev
```

### **3. Test MCP Server**

```bash
# Test MCP server directly
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}' | node src/simple-mcp-server.js
```

### **4. Install in Cursor**

```bash
# Generate and use install link
node scripts/generate-mcp-link.js
```

### **5. Configure Cursor**

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

### **6. Test in Cursor Chat**

```
@nuggetwise-v0 v0_generate "Create a simple red button"
```

## 🔍 **Troubleshooting Guide**

### **Common Issues**

#### **1. "MCP server not found"**
**Symptoms**: Cursor can't find the MCP server
**Solutions**:
- Verify the MCP server is running: `ps aux | grep simple-mcp-server`
- Check the path in `.cursor/mcp.json` is correct
- Restart Cursor IDE after configuration changes

#### **2. "V0 API key not found"**
**Symptoms**: V0 generation fails with API key errors
**Solutions**:
- Verify `V0_API_KEY` is set: `echo $V0_API_KEY`
- Check the environment variable is passed to the MCP server
- Test V0 API directly: `curl -H "Authorization: Bearer $V0_API_KEY" https://api.v0.dev/v1/models`

#### **3. "REST API server not running"**
**Symptoms**: MCP server can't connect to backend
**Solutions**:
- Start the REST API server: `cd packages/nw-mcp && npm run dev`
- Verify it's running on port 3001: `curl http://localhost:3001/health`
- Check firewall settings

#### **4. "Install link not working"**
**Symptoms**: Cursor deeplink doesn't install the MCP server
**Solutions**:
- Generate a fresh install link: `node scripts/generate-mcp-link.js`
- Check the base64 configuration is valid
- Try manual installation via `.cursor/mcp.json`

### **Debug Mode**

Enable debug mode for detailed logging:

```bash
DEBUG_MCP=true node packages/nw-mcp/src/simple-mcp-server.js
```

### **Performance Monitoring**

Key metrics to monitor:

- **Response Time**: MCP server to REST API communication
- **Success Rate**: Percentage of successful V0 generations
- **Error Rate**: API failures and network issues
- **Usage Patterns**: Most common prompts and models

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

### **Phase 7: Registry Standardization** 🏷️
- [ ] **Cursor Directory Submission**: Submit to [cursor.directory/mcp](https://cursor.directory/mcp)
- [ ] **Standard Documentation Format**: Follow registry documentation standards
- [ ] **Registry Entry Creation**: Create proper MCP server registry entry
- [ ] **Installation Instructions**: Standardize installation steps per registry format
- [ ] **Configuration Examples**: Provide stdio/SSE configuration examples
- [ ] **Tool Usage Documentation**: Clear tool descriptions and examples
- [ ] **Screenshots & Examples**: Add visual examples of tool usage
- [ ] **Support Information**: Add support channels and contact information
- [ ] **Version Management**: Implement proper versioning for registry updates
- [ ] **Registry Metadata**: Add proper tags, categories, and descriptions 