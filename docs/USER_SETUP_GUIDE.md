# Magic Nuggetwise User Setup Guide

## 🎉 Welcome to Magic Nuggetwise!

Magic Nuggetwise is an AI-powered code generation tool that helps you create React components quickly and efficiently. This guide will walk you through the setup process step by step.

## 📋 Prerequisites

Before you begin, make sure you have:

- **Cursor IDE** installed on your computer
- A **V0.dev account** (free to create)
- Basic knowledge of React (helpful but not required)

## 🚀 Quick Start (2 Minutes)

### Step 1: Install Magic Nuggetwise

1. **Visit the Magic Nuggetwise website:**
   - Go to [nuggetwise.com](https://nuggetwise.com)
   - Click the "Add to Cursor" button
   - Cursor will automatically install the MCP server

2. **Alternative: Manual Installation**
   - Open Cursor Settings → MCP
   - Add a new server with this configuration:
   ```json
   {
     "mcpServers": {
       "nuggetwise-v0": {
         "command": "node",
         "args": ["/path/to/nuggetwise-v0/dist/mcp-server.js"],
         "env": {
           "V0_API_KEY": "v1:your-actual-v0-api-key-here"
         }
       }
     }
   }
   ```

### Step 2: Get Your V0 API Key

1. **Visit V0.dev:**
   - Go to [v0.dev](https://v0.dev)
   - Sign up for a free account (if you don't have one)

2. **Create an API Key:**
   - Click on your profile picture → Settings
   - Go to "API Keys" section
   - Click "Create New Key"
   - Copy the key (it starts with "v1:")

### Step 3: Configure Your API Key

1. **Open Cursor Settings:**
   - Press `Cmd/Ctrl + ,` to open settings
   - Go to "MCP" section

2. **Find the Nuggetwise Server:**
   - Look for "nuggetwise-v0" in the server list
   - Click on it to edit

3. **Add Your API Key:**
   - In the "env" section, add:
   ```json
   "V0_API_KEY": "v1:your-actual-v0-api-key-here"
   ```
   - Replace `v1:your-actual-v0-api-key-here` with your actual key
   - Save the configuration

### Step 4: Test Your Setup

1. **Check Connection:**
   - In Cursor, type: `/nuggetwise-v0/status`
   - You should see: "🔑 API Key: Connected ✅"

2. **Generate Your First Component:**
   - Type: `/nuggetwise-v0/generate create a button`
   - Magic Nuggetwise will create a React button component for you!

## 🎯 Your First Project

### Generate a Simple Component

```bash
/nuggetwise-v0/generate create a modern login form with email and password fields
```

### Update Your Component

```bash
/nuggetwise-v0/update add validation and error messages to the form
```

### Check Project Status

```bash
/nuggetwise-v0/status
```

## 📚 Available Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/nuggetwise-v0/generate <prompt>` | Create new components | `/nuggetwise-v0/generate create a dashboard` |
| `/nuggetwise-v0/update <message>` | Update existing components | `/nuggetwise-v0/update make it responsive` |
| `/nuggetwise-v0/status` | Check connection status | `/nuggetwise-v0/status` |
| `/nuggetwise-v0/sync` | Pull changes from V0 web | `/nuggetwise-v0/sync` |
| `/nuggetwise-v0/connect <url>` | Connect to V0 project | `/nuggetwise-v0/connect https://v0.dev/chat/abc123` |

## 💡 Pro Tips

### Writing Better Prompts

**Good Prompts:**
- "Create a modern navigation bar with logo and menu items"
- "Build a contact form with name, email, and message fields"
- "Design a product card with image, title, price, and buy button"

**Better Prompts:**
- "Create a responsive navigation bar with hamburger menu for mobile, company logo on the left, and navigation links on the right"
- "Build a contact form with real-time validation, loading states, and success/error messages"
- "Design a product card with hover effects, image gallery, rating stars, and add-to-cart functionality"

### Component Organization

- **Single Components**: Use `/generate` for individual components
- **Complex Features**: Use `/update` to build upon existing components
- **Project Structure**: Let Magic Nuggetwise handle file organization

### Best Practices

1. **Start Simple**: Begin with basic components and add complexity
2. **Be Specific**: Include details about styling, behavior, and functionality
3. **Iterate**: Use `/update` to refine and improve your components
4. **Test**: Always test your generated components in your project

## 🔧 Troubleshooting

### Common Issues

#### Setup Issues

**Problem**: "V0 API Key Required" message
- **Solution**: Follow Step 3 above to configure your API key

**Problem**: "Invalid API Key" error
- **Solution**: 
  1. Check your key at [v0.dev/settings/api-keys](https://v0.dev/settings/api-keys)
  2. Ensure it starts with "v1:"
  3. Try copying it again

**Problem**: "Insufficient Credits" error
- **Solution**: 
  1. Visit [v0.dev](https://v0.dev) to add funds
  2. Check your current credit balance

#### Usage Issues

**Problem**: Components not generating
- **Solution**: 
  1. Check your internet connection
  2. Verify your API key is working
  3. Try a simpler prompt

**Problem**: Generated code has errors
- **Solution**: 
  1. Use `/update` to fix specific issues
  2. Be more specific in your prompts
  3. Check the generated code for syntax errors

### Getting Help

- **Documentation**: [docs.nuggetwise.com](https://docs.nuggetwise.com)
- **Support**: Create an issue in our repository
- **Community**: Join our Discord for help from other users

## 🎨 Example Projects

### Project 1: E-commerce Product Page

```bash
# Generate the main product component
/nuggetwise-v0/generate create a product page with image gallery, product details, price, and add to cart button

# Add a review section
/nuggetwise-v0/update add a customer reviews section with star ratings and comments

# Make it responsive
/nuggetwise-v0/update make the layout responsive for mobile devices
```

### Project 2: Dashboard

```bash
# Generate the main dashboard
/nuggetwise-v0/generate create a dashboard with sidebar navigation, header, and main content area

# Add charts and metrics
/nuggetwise-v0/update add metric cards and charts to the dashboard

# Add user profile section
/nuggetwise-v0/update add a user profile dropdown in the header
```

### Project 3: Blog

```bash
# Generate the blog layout
/nuggetwise-v0/generate create a blog layout with header, navigation, and article grid

# Add search functionality
/nuggetwise-v0/update add a search bar and filter functionality

# Add pagination
/nuggetwise-v0/update add pagination controls at the bottom
```

## 🚀 Advanced Features

### Working with V0 Web Interface

1. **Sync Changes**: Use `/nuggetwise-v0/sync` to pull changes from V0 web
2. **Connect Projects**: Use `/nuggetwise-v0/connect <url>` to connect to existing V0 projects
3. **Collaborate**: Share V0 project URLs with team members

### Customization

- **Styling**: Ask for specific design systems (Tailwind, Material-UI, etc.)
- **Functionality**: Request specific features (animations, state management, etc.)
- **Integration**: Ask for integration with specific APIs or services

## 📊 Cost Management

### Understanding Costs

- **V0 API**: You pay for V0 API usage directly to V0.dev
- **Magic Nuggetwise**: Free to use, no additional costs
- **Transparency**: You control your own V0 usage and costs

### Optimizing Usage

1. **Plan Ahead**: Think about your component requirements before generating
2. **Iterate Efficiently**: Use `/update` instead of regenerating from scratch
3. **Monitor Usage**: Check your V0 dashboard for usage statistics

## 🎉 Congratulations!

You're now ready to build amazing React components with Magic Nuggetwise! 

**Next Steps:**
1. Try generating your first component
2. Experiment with different prompts
3. Build a complete project
4. Share your creations with the community

**Happy coding! 🚀**

---

*Need help? Visit [docs.nuggetwise.com](https://docs.nuggetwise.com) or join our Discord community.* 