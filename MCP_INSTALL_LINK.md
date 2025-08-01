# Cursor MCP Install Link

Generated on: 2025-08-01T03:09:54.648Z
Version: 1.0.0

## 🚀 Quick Install

Click the button below to install the V0 MCP server in Cursor:

[![Add to Cursor](https://img.shields.io/badge/Add_to_Cursor-Install_V0_MCP_Server-blue?style=for-the-badge&logo=cursor)](cursor://anysphere.cursor-deeplink/mcp/install?name=nuggetwise-v0&config=ewogICJudWdnZXR3aXNlLXYwIjogewogICAgImNvbW1hbmQiOiAibm9kZSIsCiAgICAiYXJncyI6IFsKICAgICAgIiR7d29ya3NwYWNlRm9sZGVyfS9wYWNrYWdlcy9udy1tY3AvZGlzdC9tY3Atc2VydmVyLmpzIgogICAgXSwKICAgICJlbnYiOiB7CiAgICAgICJOT0RFX0VOViI6ICJkZXZlbG9wbWVudCIsCiAgICAgICJWMF9BUElfS0VZIjogIiR7ZW52OlYwX0FQSV9LRVl9IiwKICAgICAgIk9QRU5BSV9BUElfS0VZIjogIiR7ZW52Ok9QRU5BSV9BUElfS0VZfSIKICAgIH0KICB9Cn0=)

## 📋 Manual Installation

If the button doesn't work, copy and paste this link into your browser:

```
cursor://anysphere.cursor-deeplink/mcp/install?name=nuggetwise-v0&config=ewogICJudWdnZXR3aXNlLXYwIjogewogICAgImNvbW1hbmQiOiAibm9kZSIsCiAgICAiYXJncyI6IFsKICAgICAgIiR7d29ya3NwYWNlRm9sZGVyfS9wYWNrYWdlcy9udy1tY3AvZGlzdC9tY3Atc2VydmVyLmpzIgogICAgXSwKICAgICJlbnYiOiB7CiAgICAgICJOT0RFX0VOViI6ICJkZXZlbG9wbWVudCIsCiAgICAgICJWMF9BUElfS0VZIjogIiR7ZW52OlYwX0FQSV9LRVl9IiwKICAgICAgIk9QRU5BSV9BUElfS0VZIjogIiR7ZW52Ok9QRU5BSV9BUElfS0VZfSIKICAgIH0KICB9Cn0=
```

## 🔧 Configuration

```json
{
  "nuggetwise-v0": {
    "command": "node",
    "args": [
      "${workspaceFolder}/packages/nw-mcp/dist/mcp-server.js"
    ],
    "env": {
      "NODE_ENV": "development",
      "V0_API_KEY": "${env:V0_API_KEY}",
      "OPENAI_API_KEY": "${env:OPENAI_API_KEY}"
    }
  }
}
```

## 📝 Usage

After installation, you can use the V0 MCP server in Cursor:

```
@nuggetwise-v0 v0_generate "Create a green dot on white screen"
@nuggetwise-v0 v0_continue "Make the dot bigger"
@nuggetwise-v0 v0_get_project_status
```

## 🛠️ Prerequisites

- Cursor IDE (latest version)
- V0 API Key (get from [v0.dev](https://v0.dev))
- Node.js 18+ (for server functionality)

## 📚 Documentation

- [Complete Setup Guide](../implementation-plan/dev-implementation/NUGGETWISE_BUILDER.md)
- [API Reference](../implementation-plan/dev-implementation/API_SPECS.md)
- [Architecture Overview](../implementation-plan/dev-implementation/HYBRID_ARCHITECTURE.md)
