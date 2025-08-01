# V0 API Key Management & User Onboarding

## Overview

This document outlines our approach to V0 API key management and user onboarding for Magic Nuggetwise. Our goal is to make the setup process as simple and user-friendly as possible, especially for non-technical users.

**Note**: Unlike some competitors (like 21st.dev) who provide their own AI service, Magic Nuggetwise integrates directly with V0 AI, requiring users to provide their own V0 API key. This approach gives users full control over their V0 usage and costs.

## Core Principles

### User-Centric Design
- **One-Click Installation**: Users should be able to install Magic Nuggetwise with minimal technical knowledge
- **Guided Experience**: Step-by-step setup wizard to walk users through the process
- **Clear Communication**: User-friendly language and visual indicators
- **Helpful Error Messages**: Actionable guidance when things go wrong

### Direct V0 Integration
- **No Middleman**: Direct integration with V0 AI, no proprietary AI service
- **User Control**: Users provide their own V0 API keys and manage their own costs
- **Transparency**: Clear separation between our costs (LLM agents) and user costs (V0 API)
- **Trust**: Users maintain full control over their V0 account and usage

### Security First
- **Secure Storage**: API keys are stored securely in Cursor's environment
- **No Data Collection**: We never see or store user API keys
- **User Control**: Users can revoke their keys anytime at v0.dev
- **Transparent Usage**: Users can track their usage in their V0 dashboard

## User Onboarding Flow

### Primary Flow: One-Click Installation

**Step 1: Website Landing**
- User visits nuggetwise.com
- Sees clear value proposition and "Add to Cursor" button
- Understands what Magic Nuggetwise does and its benefits

**Step 2: One-Click Install**
- User clicks "Add to Cursor" button
- Cursor automatically opens with installation prompt
- User approves the installation
- Magic Nuggetwise MCP server is installed

**Step 3: First Command & Setup**
- User tries their first command: `/nuggetwise-v0/generate create a button`
- MCP server detects missing V0 API key
- Setup wizard responds with friendly instructions
- User configures API key in MCP settings (persistent across sessions)

**Step 4: Validation & Testing**
- System validates the API key with V0
- Auto-test with a simple component generation
- Success confirmation and next steps

**Step 5: Ready to Build**
- User can immediately start using Magic Nuggetwise
- Clear examples and commands provided
- Help system available for guidance

### Alternative Flow: Manual Setup

For advanced users who prefer manual setup:

**Step 1: Get V0 API Key**
- Visit v0.dev and sign up/login
- Navigate to Settings → API Keys
- Create new API key and copy it

**Step 2: Configure MCP Server**
- In Cursor, go to Settings → MCP
- Find the existing "nuggetwise-v0" server
- Add V0 API key to the "env" section:

\`\`\`json
{
  "mcpServers": {
    "nuggetwise-v0": {
      "command": "node",
      "args": [
        "/Users/singhm/cursorflow/packages/nw-mcp/dist/mcp-server.js"
      ],
      "env": {
        "V0_API_KEY": "v1:YOUR_V0_API_KEY_HERE"
      }
    }
  }
}
\`\`\`

💡 **Quick Setup:**
1. Open Cursor Settings → MCP
2. Find the "nuggetwise-v0" server
3. Add this to the "env" section: `"V0_API_KEY": "v1:YOUR_ACTUAL_KEY_HERE"`
4. Replace `v1:YOUR_ACTUAL_KEY_HERE` with your V0 API key
5. Save and restart Cursor if needed

**Even Simpler:**
Just add this line to your existing nuggetwise-v0 server's "env" section:
```json
"V0_API_KEY": "v1:your-actual-v0-api-key-here"
```

**Step 3: Test Installation**
- Try generating a simple component
- Verify everything works correctly

## User Experience Elements

### Status Information (MCP Responses)

**API Key Status**
- Connected: "🔑 API Key: Connected ✅" in command responses
- Disconnected: "🔑 API Key: Not Connected ❌" with setup instructions
- Clear guidance on how to connect

**Credits & Usage**
- V0 Credits remaining shown in command responses
- Daily and total component generation count
- Warning messages when credits are low

**System Status**
- Overall system health reported in command responses
- Connection status to V0
- Any pending updates or issues

### Guided Setup Wizard (MCP-Based)

**Implementation Approach:**
The setup wizard is implemented through the MCP server itself, not as a separate UI. When users first run a command without an API key, the MCP server provides an interactive setup experience through Cursor's chat interface.

**Welcome & Detection:**
- MCP server detects missing V0 API key on first command
- Returns friendly welcome message with setup instructions
- Provides clear next steps and estimated time

**Interactive Setup Flow:**
- User runs `/nuggetwise-v0/generate create a button`
- MCP server responds with setup guidance
- User configures API key in MCP settings (persistent across sessions)
- MCP server validates and uses the key
- Automatic test with simple component generation

**Setup Messages:**
```
🎉 Welcome to Magic Nuggetwise!

To get started, you need a V0 API key. This only takes 2 minutes!

1. Visit https://v0.dev and sign up (free!)
2. Go to Settings → API Keys → Create New Key
3. Copy your key (starts with "v1:")
4. Configure in Cursor MCP settings (see instructions below)
5. Try the command again!

📋 MCP Configuration:
Open Cursor Settings → MCP → Edit nuggetwise-v0 server:

\`\`\`json
{
  "mcpServers": {
    "nuggetwise-v0": {
      "command": "node",
      "args": [
        "/Users/singhm/cursorflow/packages/nw-mcp/dist/mcp-server.js"
      ],
      "env": {
        "V0_API_KEY": "v1:YOUR_V0_API_KEY_HERE"
      }
    }
  }
}
\`\`\`

💡 **Quick Setup:**
1. Open Cursor Settings → MCP
2. Find the "nuggetwise-v0" server
3. Add this to the "env" section: `"V0_API_KEY": "v1:YOUR_ACTUAL_KEY_HERE"`
4. Replace `v1:YOUR_ACTUAL_KEY_HERE` with your V0 API key
5. Save and restart Cursor if needed

**Even Simpler:**
Just add this line to your existing nuggetwise-v0 server's "env" section:
```json
"V0_API_KEY": "v1:your-actual-v0-api-key-here"
```

Need help? Visit docs.nuggetwise.com/setup
```

**Validation & Testing:**
- MCP server validates API key format and connectivity
- Provides clear error messages if validation fails
- Auto-tests with simple component generation
- Confirms successful setup with next steps

### Help & Support System

**In-App Help**
- Pro tips and best practices
- Common questions and answers
- Quick access to documentation

**Error Handling**
- User-friendly error messages
- Clear action steps to resolve issues
- Direct links to relevant resources

**Support Channels**
- Email support for complex issues
- Documentation website
- Community Discord for peer help

## Error Scenarios & Solutions

### Missing API Key
**User Experience:**
- Clear message: "V0 API Key Required"
- Step-by-step setup instructions
- Direct link to v0.dev API keys page
- Estimated time: "This only takes 2 minutes!"

**Resolution Steps:**
1. Go to v0.dev and sign up (free!)
2. Click Settings → API Keys → Create New Key
3. Copy the key and paste it when prompted

### Invalid API Key
**User Experience:**
- Clear message: "Invalid API Key"
- Quick fix instructions
- Link to verify key at v0.dev

**Resolution Steps:**
1. Check your key at v0.dev/settings/api-keys
2. Ensure it starts with "v1:"
3. Try copying it again
4. Check if you have sufficient credits

### Insufficient Credits
**User Experience:**
- Clear message: "Insufficient Credits"
- Link to add funds to V0 account
- Explanation of credit system

**Resolution Steps:**
1. Visit v0.dev to add funds
2. Check current credit balance
3. Consider upgrading plan if needed

### Installation Issues
**User Experience:**
- Clear troubleshooting steps
- Common solutions provided
- Support contact information

**Resolution Steps:**
1. Try restarting Cursor
2. Check internet connection
3. Verify Cursor version compatibility
4. Contact support if issues persist

## Cost Management

### Our System Costs (LLM for Agents)
- **Intent Analysis**: $0.001-0.005 per request
- **PRD Generation**: $0.01-0.05 per request
- **Validation**: $0.005-0.02 per request
- **V0 Prompt Building**: $0.01-0.03 per request
- **Total per generation**: $0.025-0.105

### User Costs (V0 API)
- **Component Generation**: $0.02-0.05 per component
- **Project Updates**: $0.01-0.03 per update
- **User manages their own V0 billing**

### Why User-Provided V0 Keys?
- **Full Control**: Users control their own V0 usage and costs
- **Transparency**: No hidden costs or markup on V0 API calls
- **Flexibility**: Users can use their existing V0 credits and billing
- **Trust**: Users don't need to share their V0 account with us

### Cost Optimization
- Smart provider selection for best cost/quality ratio
- Caching similar requests to reduce LLM calls
- Batch processing for related operations
- Fallback strategies using cheaper providers

## Security Considerations

### For Users
- API keys are stored securely in Cursor's MCP configuration
- Keys persist across sessions automatically
- We never see or store user keys
- Users can revoke keys anytime at v0.dev
- Usage is tracked in user's V0 dashboard

### For Our System
- Never log or store API keys in plain text
- Use secure environment variable handling
- Implement rate limiting and usage monitoring
- Provide clear error messages without exposing sensitive data
- Validate API keys before storing

## Success Metrics

### User Experience Metrics
- **Setup Completion Rate**: Percentage of users who complete setup
- **Time to First Component**: How long from install to first generation
- **Error Resolution Rate**: How often users resolve issues themselves
- **Support Ticket Volume**: Number of setup-related support requests

### Technical Metrics
- **API Key Validation Success Rate**: Percentage of valid keys
- **Installation Success Rate**: Percentage of successful installations
- **Error Frequency**: Types and frequency of setup errors
- **Performance**: Setup wizard load times and responsiveness

## Future Enhancements

### Planned Improvements
- **Social Login**: Integration with GitHub, Google, etc.
- **Team Management**: Shared API keys for teams
- **Usage Analytics**: Better insights into user patterns
- **Automated Troubleshooting**: AI-powered issue resolution

### User Feedback Integration
- **Setup Flow Optimization**: Based on user behavior data
- **Error Message Improvements**: Based on support ticket analysis
- **Feature Requests**: User-driven enhancement priorities
- **A/B Testing**: Continuous optimization of onboarding flow

## Conclusion

Our approach to V0 API key management and user onboarding prioritizes simplicity, security, and user experience. By providing a one-click installation process with guided setup, we make Magic Nuggetwise accessible to users of all technical levels while maintaining robust security practices.

The key to success is balancing automation with user control, providing clear guidance without overwhelming users with technical details, and ensuring that the setup process is as smooth and error-free as possible. 