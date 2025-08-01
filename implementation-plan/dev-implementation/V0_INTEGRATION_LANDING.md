# 🎨 V0 AI Integration for Cursor IDE

Transform your Cursor IDE experience with AI-powered component generation using Vercel's V0 Platform.

## 🚀 **Get Started in 30 Seconds**

### **Step 1: Install V0 MCP Server**

**Generate the latest install link:**

```bash
node scripts/generate-mcp-link.js
```

This will generate a fresh install link with the current configuration.

**Or use the manual installation:**

1. **Generate the install link** using the script above
2. **Copy the generated link** and paste it in your browser
3. **Follow the prompts** to install the MCP server

### **Step 2: Start the Backend Server**
```bash
cd packages/nw-mcp
npm run dev
```

### **Step 3: Generate Components in Cursor Chat**
```
@nuggetwise-v0 v0_generate "Create a modern login form"
```

## ✨ **What You Can Do**

### **Generate React Components**
```
@nuggetwise-v0 v0_generate "a blue button with white text"
@nuggetwise-v0 v0_generate "a dashboard card with user stats"
@nuggetwise-v0 v0_generate "a responsive navigation bar"
```

### **Continue Conversations**
```
@nuggetwise-v0 v0_continue "Make the button larger and add a shadow"
```

### **Get Live Previews**
Every generated component includes:
- 🌐 **Live Preview URL** - See your component in action
- 💬 **V0 Chat URL** - Continue editing in V0's interface
- 📁 **Workspace Files** - Automatically saved to your project

## 🎯 **Example Output**

When you run `@nuggetwise-v0 v0_generate "a red button"`, you'll get:

```
✅ Component generated successfully!

📝 Generated Code:
```tsx
import { Button } from "@/components/ui/button"

export default function RedButton() {
  return <Button className="bg-red-500 hover:bg-red-600 text-white">Red Button</Button>
}
```

🌐 Live Preview: https://preview-xyz.vusercontent.net
💬 V0 Chat: https://v0.dev/chat/abc123

🎨 V0 AI has created your component!
```

## 🔧 **Features**

- **⚡ Real-time Generation** - Instant component creation
- **🎨 Multiple Models** - Choose from v0-1.5-sm, v0-1.5-md, v0-1.5-lg
- **📁 Auto-save** - Files automatically saved to workspace
- **🌐 Live Previews** - See components in action immediately
- **🔄 Conversation Continuation** - Iterate on your designs
- **🎯 MCP Protocol** - Native Cursor IDE integration

## 📚 **Documentation**

- **[Complete Setup Guide](NUGGETWISE_BUILDER.md)** - Detailed installation and usage
- **[API Reference](API_SPECS.md)** - Technical specifications
- **[Architecture Overview](HYBRID_ARCHITECTURE.md)** - System design

## 🛠️ **Prerequisites**

- **Cursor IDE** - Latest version
- **Node.js** - Version 18+
- **V0 API Key** - Get from [v0.dev](https://v0.dev)

## 🚀 **Quick Links**

- **[Generate Install Link](scripts/generate-mcp-link.js)** - Dynamic link generation
- **[Full Documentation](NUGGETWISE_BUILDER.md)**
- **[GitHub Repository](https://github.com/your-org/cursorflow)**
- **[V0 Platform](https://v0.dev)**

## 🤝 **Support**

- **Issues**: [GitHub Issues](https://github.com/your-org/cursorflow/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/cursorflow/discussions) 