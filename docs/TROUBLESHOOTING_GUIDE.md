# Magic Nuggetwise Troubleshooting Guide

## 🔍 Quick Diagnosis

If you're having issues with Magic Nuggetwise, start here:

1. **Check your connection status:**
   ```bash
   /nuggetwise-v0/status
   ```

2. **Verify your API key is configured correctly**
3. **Check your internet connection**
4. **Restart Cursor if needed**

## 🚨 Common Issues & Solutions

### API Key Issues

#### ❌ "V0 API Key Required" Error

**Symptoms:**
- You see setup instructions instead of component generation
- Status shows "🔑 API Key: Not Connected ❌"

**Causes:**
- API key not configured
- API key not saved properly
- Cursor needs to be restarted

**Solutions:**

1. **Configure your API key:**
   - Open Cursor Settings → MCP
   - Find "nuggetwise-v0" server
   - Add to env section: `"V0_API_KEY": "v1:your-actual-key-here"`

2. **Get a new API key:**
   - Visit [v0.dev/settings/api-keys](https://v0.dev/settings/api-keys)
   - Create a new key
   - Copy the key (starts with "v1:")

3. **Restart Cursor:**
   - Close Cursor completely
   - Reopen Cursor
   - Try the command again

#### ❌ "Invalid API Key" Error

**Symptoms:**
- Error message: "Invalid API key format" or "Invalid API key"
- Status shows "🔑 API Key: Invalid ❌"

**Causes:**
- Wrong API key format
- Expired or revoked key
- Copy-paste error

**Solutions:**

1. **Check key format:**
   - V0 API keys must start with "v1:"
   - Example: `v1:abc123def456...`

2. **Verify your key:**
   - Visit [v0.dev/settings/api-keys](https://v0.dev/settings/api-keys)
   - Check if your key is still active
   - Create a new key if needed

3. **Re-copy the key:**
   - Copy the key again from V0 dashboard
   - Paste it carefully into Cursor settings
   - Avoid extra spaces or characters

#### ❌ "Insufficient Credits" Error

**Symptoms:**
- Error message: "Insufficient credits"
- Component generation fails

**Causes:**
- No V0 credits remaining
- Account needs funding

**Solutions:**

1. **Check your balance:**
   - Visit [v0.dev](https://v0.dev)
   - Check your credit balance in settings

2. **Add funds:**
   - Go to V0 billing section
   - Add credits to your account
   - V0 offers free credits for new users

3. **Upgrade plan:**
   - Consider upgrading to a paid plan
   - More credits and features available

### Installation Issues

#### ❌ MCP Server Won't Start

**Symptoms:**
- "Failed to start MCP server" error
- Commands not recognized

**Causes:**
- Incorrect installation path
- Missing dependencies
- Permission issues

**Solutions:**

1. **Check installation:**
   - Verify the MCP server is properly installed
   - Check the path in Cursor settings

2. **Reinstall:**
   - Remove the MCP server from Cursor settings
   - Reinstall following the setup guide

3. **Check permissions:**
   - Ensure Cursor has permission to run the server
   - Check file permissions on the MCP server

#### ❌ "Command Not Found" Error

**Symptoms:**
- `/nuggetwise-v0/` commands not recognized
- No autocomplete for commands

**Causes:**
- MCP server not properly configured
- Cursor not recognizing the server

**Solutions:**

1. **Verify MCP configuration:**
   - Open Cursor Settings → MCP
   - Check if "nuggetwise-v0" is listed
   - Verify the configuration is correct

2. **Restart Cursor:**
   - Close and reopen Cursor
   - Wait for MCP servers to initialize

3. **Check server status:**
   - Look for any error messages in Cursor's developer tools
   - Check if the server is running

### Generation Issues

#### ❌ Components Not Generating

**Symptoms:**
- Commands run but no components created
- Empty responses
- Timeout errors

**Causes:**
- Network connectivity issues
- V0 API problems
- Complex prompts

**Solutions:**

1. **Check internet connection:**
   - Ensure you have a stable internet connection
   - Try accessing [v0.dev](https://v0.dev) directly

2. **Simplify your prompt:**
   - Start with a simple prompt like "create a button"
   - Add complexity gradually

3. **Check V0 status:**
   - Visit [v0.dev](https://v0.dev) to see if there are any service issues
   - Try generating directly on V0 website

#### ❌ Generated Code Has Errors

**Symptoms:**
- Syntax errors in generated code
- Components don't work as expected
- Missing imports or dependencies

**Causes:**
- Unclear prompts
- Complex requirements
- Missing context

**Solutions:**

1. **Be more specific:**
   - Include details about styling, behavior, and functionality
   - Specify the tech stack you're using

2. **Use update command:**
   - Use `/nuggetwise-v0/update` to fix specific issues
   - Example: `/nuggetwise-v0/update fix the import errors and add missing dependencies`

3. **Provide context:**
   - Mention your project structure
   - Specify any specific libraries or frameworks

### Performance Issues

#### ❌ Slow Generation

**Symptoms:**
- Commands take a long time to complete
- Timeout errors
- Slow responses

**Causes:**
- Complex prompts
- Network latency
- V0 API load

**Solutions:**

1. **Simplify prompts:**
   - Break complex components into smaller parts
   - Use `/update` to build incrementally

2. **Check network:**
   - Ensure stable internet connection
   - Try at different times of day

3. **Monitor V0 status:**
   - Check if V0 is experiencing high load
   - Try again later if needed

#### ❌ Memory Issues

**Symptoms:**
- Cursor becomes slow
- High memory usage
- Crashes

**Causes:**
- Large generated files
- Multiple concurrent requests
- Memory leaks

**Solutions:**

1. **Restart Cursor:**
   - Close and reopen Cursor
   - Clear any cached data

2. **Limit concurrent requests:**
   - Don't run multiple generation commands at once
   - Wait for one to complete before starting another

3. **Clean up files:**
   - Remove old generated files if not needed
   - Keep your workspace organized

## 🔧 Advanced Troubleshooting

### Debug Mode

Enable debug logging to get more information:

1. **Check Cursor logs:**
   - Open Cursor's developer tools
   - Look for MCP-related messages
   - Check for error details

2. **Test MCP server directly:**
   ```bash
   node packages/nw-mcp/dist/mcp-server.js
   ```

3. **Verify environment variables:**
   - Check if all required environment variables are set
   - Verify API keys are correct

### Network Issues

#### Firewall/Proxy Problems

**Symptoms:**
- Connection timeouts
- API calls failing
- Network errors

**Solutions:**

1. **Check firewall settings:**
   - Ensure Cursor can access the internet
   - Allow connections to V0 API endpoints

2. **Proxy configuration:**
   - Configure proxy settings if needed
   - Check corporate network restrictions

3. **VPN issues:**
   - Disable VPN temporarily to test
   - Check if VPN is blocking API calls

### Platform-Specific Issues

#### macOS Issues

**Common problems:**
- Permission issues with file access
- Gatekeeper blocking execution

**Solutions:**
- Grant necessary permissions to Cursor
- Check System Preferences → Security & Privacy

#### Windows Issues

**Common problems:**
- Path issues with backslashes
- Antivirus blocking execution

**Solutions:**
- Use forward slashes in paths
- Add Cursor to antivirus exclusions

#### Linux Issues

**Common problems:**
- Missing dependencies
- Permission issues

**Solutions:**
- Install required Node.js dependencies
- Check file permissions and ownership

## 📞 Getting Help

### Before Contacting Support

1. **Check this guide** for your specific issue
2. **Try the solutions** provided above
3. **Restart Cursor** and try again
4. **Check V0 status** at [v0.dev](https://v0.dev)

### Contact Information

- **Documentation**: [docs.nuggetwise.com](https://docs.nuggetwise.com)
- **GitHub Issues**: Create an issue in our repository
- **Discord Community**: Join our Discord for peer help
- **Email Support**: support@nuggetwise.com

### Information to Provide

When contacting support, include:

1. **Error message** (exact text)
2. **Steps to reproduce** the issue
3. **Your setup** (OS, Cursor version, etc.)
4. **What you tried** to fix it
5. **Screenshots** if relevant

## 🎯 Prevention Tips

### Best Practices

1. **Keep Cursor updated** to the latest version
2. **Regularly check** your V0 API key status
3. **Monitor your V0 credits** to avoid running out
4. **Use simple prompts** and build complexity gradually
5. **Test generated code** before using in production

### Regular Maintenance

1. **Restart Cursor** periodically
2. **Clean up** old generated files
3. **Check for updates** to Magic Nuggetwise
4. **Verify API keys** are still valid
5. **Monitor V0 usage** and costs

---

**Need immediate help?** Try our [Quick Start Guide](USER_SETUP_GUIDE.md) or join our [Discord community](https://discord.gg/nuggetwise) for real-time support. 