# MCP Server Implementation
*Team: MCP Server Team*

## 🎯 **Section 1: MCP Server Implementation**

### **Key Differentiators:**
- **One-click installation** via Cursor's deeplink system
- **Single project focus** - No complex project management
- **Workspace-based file structure** - Files saved to workspace root
- **Invisible AI enhancement** - AI agents run automatically in background
- **Simple 5-command workflow** - No complex configuration

### **Technical Architecture**

#### **Current Status: Complex Multi-Project Implementation ❌**
- Multiple project management commands
- Complex file organization (`projects/Project Name/`)
- Project switching logic
- Advanced user features

#### **Target Status: Simplified Single-Project Implementation ✅**
- Single project context
- Workspace root file organization
- Simple state management
- Basic user workflow

### **Core MCP Server Features**

#### **Commands (5 Total)**
1. **`/nuggetwise-v0/generate <prompt>`** - Create new components
2. **`/nuggetwise-v0/update <message>`** - Update existing components
3. **`/nuggetwise-v0/sync`** - Pull changes from V0 web interface
4. **`/nuggetwise-v0/status`** - Check current project status
5. **`/nuggetwise-v0/connect <v0-url>`** - Connect to existing V0 project

#### **State Management**
```typescript
// .mcp-state.json
{
  "chatId": "vYkpyR49lJd",
  "projectName": "Dashboard Project",
  "projectId": "zdE32R8OLmS",
  "timestamp": "2025-08-01T17:56:55.880Z",
  "lastSyncTimestamp": "2025-08-01T17:56:55.880Z",
  "v0WebUrl": "https://v0.dev/chat/vYkpyR49lJd"
}
```

#### **File Organization**
- **Workspace root** - Files saved directly to workspace
- **V0 structure** - Maintain original V0 file paths
- **Dynamic directories** - Create subdirectories as needed
- **Backup system** - Automatic backup before updates

### **V0 Integration**

#### **API Client (V0Client.ts)**
```typescript
class V0Client {
  async generateComponents(prompt: string, options: V0Options): Promise<V0Response>
  async continueConversation(chatId: string, message: string): Promise<V0Response>
  async assignChatToProject(chatId: string, projectId: string): Promise<void>
  async getProjectById(projectId: string): Promise<V0Project>
  async saveFilesToProject(files: V0File[], projectName: string): Promise<void>
}
```

#### **Request Format**
```typescript
// Correct V0 API format
{
  messages: [
    { role: 'user', content: prompt }
  ]
}
```

### **AI Agent Integration (Invisible Enhancement)**

#### **Agent Orchestrator**
```typescript
class AgentOrchestrator {
  async executeMCPIntegrationOrchestration(userPrompt: string): Promise<string> {
    // 1. Intent Analysis
    const intent = await this.intentAnalysisAgent.analyze(userPrompt);
    
    // 2. UX Pattern Selection
    const uxPattern = await this.uxPatternSelectorAgent.select(intent);
    
    // 3. Validation
    const validation = await this.validationAgent.validate(userPrompt, uxPattern);
    
    // 4. UI Requirement Synthesis
    const requirements = await this.uiRequirementSynthesizer.synthesize(validation);
    
    // 5. V0 Prompt Building
    const enhancedPrompt = await this.v0PromptBuilder.build(requirements);
    
    return enhancedPrompt;
  }
}
```

#### **Available Agents**
- **IntentAnalysisAgent** - Understands user intent
- **UXPatternSelectorAgent** - Selects appropriate UX patterns
- **ValidationAgent** - Validates prompt quality
- **UIRequirementSynthesizerAgent** - Synthesizes UI requirements
- **V0PromptBuilderAgent** - Builds optimized V0 prompts

### **Implementation Tasks**

#### **Phase 1: Simplify Current Implementation**
- [ ] **Remove complex project management** - Remove `list_projects`, `switch_project`, `create_project` commands
- [ ] **Simplify to single project** - Keep only current project context
- [ ] **Update file organization** - Move from `projects/Project Name/` to workspace root
- [ ] **Simplify state management** - Remove project switching logic
- [ ] **Test simplified workflow** - Ensure basic generate/update works
- [ ] **Remove unused code** - Clean up complex project management code

#### **Phase 2: Add V0 Integration**
- [ ] **Implement `/nuggetwise-v0/connect`** - Connect to existing V0 projects
- [ ] **Add V0 sync functionality** - Pull changes from V0 web interface
- [ ] **Enhance file handling** - Better backup and conflict resolution
- [ ] **Improve error handling** - Better V0 API error messages
- [ ] **Add V0 project validation** - Verify project exists and is accessible

#### **Phase 3: AI Enhancement (Invisible)**
- [ ] **Integrate Agent Orchestrator** - Add to generate/update commands
- [ ] **Load system prompts** - From `prompts/nuggetwise/` directory
- [ ] **Test AI enhancement** - Ensure better V0 prompts
- [ ] **Monitor performance** - Track AI enhancement effectiveness
- [ ] **Optimize prompts** - Based on user feedback

### **Testing Strategy**

#### **Unit Tests**
- [ ] **V0Client tests** - API integration testing
- [ ] **MCP server tests** - Command handling testing
- [ ] **File handling tests** - Save/update/backup testing
- [ ] **State management tests** - Persistence testing

#### **Integration Tests**
- [ ] **End-to-end workflow** - Complete generate/update cycle
- [ ] **V0 API integration** - Real V0 API testing
- [ ] **File system integration** - Workspace file operations
- [ ] **Error handling** - Network failures, API errors

#### **User Acceptance Tests**
- [ ] **Simple workflow** - New user experience
- [ ] **V0 integration** - Existing V0 user experience
- [ ] **Error scenarios** - Installation failures, API issues
- [ ] **Performance testing** - Large projects, many files

### **Deployment**

#### **NPM Package**
```json
{
  "name": "@cursorflow/nuggetwise-v0",
  "version": "1.0.0",
  "main": "dist/mcp-server.js",
  "bin": {
    "nuggetwise-v0": "dist/mcp-server.js"
  }
}
```

#### **Cursor Deeplink**
```json
{
  "nuggetwise-v0": {
    "command": "npx",
    "args": [
      "-y",
      "@cursorflow/nuggetwise-v0@latest"
    ]
  }
}
```

### **Dependencies**

#### **Core Dependencies**
- `v0-sdk` - V0 API integration
- `@modelcontextprotocol/sdk` - MCP protocol
- `zod` - Schema validation
- `fs-extra` - File system operations

#### **Development Dependencies**
- `typescript` - Type safety
- `jest` - Testing framework
- `@types/node` - Node.js types
- `eslint` - Code quality

### **Performance Considerations**

#### **Optimization Targets**
- **Installation time** < 30 seconds
- **Component generation** < 15 seconds
- **File operations** < 5 seconds
- **Memory usage** < 100MB

#### **Caching Strategy**
- **V0 API responses** - Cache for 5 minutes
- **Project metadata** - Cache for 1 hour
- **File backups** - Keep last 5 versions
- **State persistence** - Real-time updates

### **Security Considerations**

#### **API Key Management**
- **Environment variables** - Secure API key storage
- **No hardcoding** - Never commit API keys
- **Key rotation** - Support for key updates
- **Access logging** - Track API usage

#### **File System Security**
- **Path validation** - Prevent directory traversal
- **File size limits** - Prevent large file attacks
- **Backup encryption** - Secure backup storage
- **Access controls** - Workspace-only access

---

*This document is part of the Magic Nuggetwise implementation plan. See `magicnuggetwiseaug1.md` for the complete overview.* 