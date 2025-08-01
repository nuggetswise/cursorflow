# @cursorflow/nuggetwise-v0-mcp

A production-ready MCP (Model Context Protocol) server for V0 AI component generation in Cursor IDE.

## Features

- 🚀 **One-click setup** - No manual configuration required
- 🎨 **V0 AI Integration** - Generate React components with natural language
- 📁 **Auto-save** - Components automatically saved to your project
- 🔄 **Conversation support** - Continue and iterate on generated components
- 🛠️ **Multiple models** - Support for v0-1.5-sm, v0-1.5-md, v0-1.5-lg

## Quick Start

### 1. Add to Cursor

Add this configuration to your Cursor MCP settings (`Cmd+,` → Cursor → Full Settings → MCP):

```json
{
  "mcpServers": {
    "@cursorflow/nuggetwise-v0": {
      "command": "npx",
      "args": [
        "-y",
        "@cursorflow/nuggetwise-v0-mcp@latest",
        "V0_API_KEY=your-v0-api-key-here"
      ]
    }
  }
}
```

### 2. Restart Cursor

Restart Cursor to load the MCP server.

### 3. Start Generating

Use the `/generate` command in Cursor chat:

```
/generate "a red button with hover effects"
```

## Commands

### `/generate`
Generate React components from natural language descriptions.

**Examples:**
- `/generate "a modern login form"`
- `/generate "a responsive navigation bar"`
- `/generate "a dark mode toggle button"`

### `/v0_continue`
Continue a conversation with V0 to iterate on generated components.

## Configuration

### Environment Variables

- `V0_API_KEY` - Your V0 API key (required)
- `CURSOR_WORKSPACE_PATH` - Path to your workspace (optional, defaults to current directory)

### Model Options

You can specify different V0 models:

- `v0-1.5-sm` - Small model (fast, good for simple components)
- `v0-1.5-md` - Medium model (balanced speed and quality)
- `v0-1.5-lg` - Large model (best quality, slower)

## Auto-save

Generated components are automatically saved to your project structure:

- Components are saved to `frontend/src/components/`
- Each generation creates timestamped directories
- Files are properly named and formatted

## Troubleshooting

### "No tools found" error
1. Update npm: `npm install -g npm@latest`
2. Restart Cursor
3. Check your V0 API key

### "Client closed" error
1. Use explicit version numbers in your config
2. Check your internet connection
3. Verify firewall settings

### Components not generating
1. Verify your V0 API key is valid
2. Check V0 service status
3. Try a simpler prompt

## Development

### Local Development

```bash
# Clone the repository
git clone https://github.com/cursorflow/nuggetwise-v0-mcp.git
cd nuggetwise-v0-mcp

# Install dependencies
npm install

# Build the package
npm run build

# Test locally
npm start
```

### Publishing

```bash
# Build and publish
npm run build
npm publish
```

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- GitHub Issues: https://github.com/cursorflow/nuggetwise-v0-mcp/issues
- Documentation: https://docs.cursorflow.com/mcp 