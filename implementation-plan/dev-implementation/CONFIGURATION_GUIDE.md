# CursorFlow Configuration Guide (MCP-First Platform)

## ⚙️ **Configuration Overview**

This guide provides comprehensive documentation for all configuration options in the **MCP-first CursorFlow platform**, including environment variables, feature flags, system settings, and step-by-step setup instructions. The platform prioritizes **MCP (Model Context Protocol) integration as the primary approach** with **CLI option as secondary**.

---

## 🚀 **Quick Setup Guide**

### **Step 1: Copy Environment Files**
```bash
# Copy all environment files
cp env.example .env
cp frontend/env.example frontend/.env.local
cp backend/env.example backend/.env
```

### **Step 2: Configure Essential Variables**

#### **Root Configuration (.env)**
```bash
# Edit .env file
nano .env

# Essential variables to configure:
PRIMARY_LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-actual-openai-key
V0_API_KEY=v0_your_actual_v0_key
V0_MODEL=v0-1.5-md
V0_RATE_LIMIT=30
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# MCP Integration (Primary)
MCP_SERVER_PORT=8788
MCP_ENABLE_CACHING=true
MCP_AGENT_TIMEOUT=30000

# CLI Option (Secondary)
ENABLE_CLI_OPTION=true
CLI_PACKAGE_NAME=nuggetwise-cli
```

#### **Frontend Configuration (.env.local)**
```bash
# Edit frontend/.env.local
nano frontend/.env.local

# Essential variables:
NEXT_PUBLIC_API_URL=http://localhost:3001
OPENAI_API_KEY=sk-your-actual-openai-key
V0_API_KEY=v0_your_actual_v0_key
V0_MODEL=v0-1.5-md
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key

# MCP Integration (Primary)
NEXT_PUBLIC_MCP_SERVER_URL=http://localhost:8788
NEXT_PUBLIC_ENABLE_MCP_INTEGRATION=true

# CLI Option (Secondary)
NEXT_PUBLIC_ENABLE_CLI_OPTION=true
```

#### **Backend Configuration (.env)**
```bash
# Edit backend/.env
nano backend/.env

# Essential variables:
PORT=3001
OPENAI_API_KEY=sk-your-actual-openai-key
V0_API_KEY=v0_your_actual_v0_key
V0_MODEL=v0-1.5-md
V0_RATE_LIMIT=30
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# MCP Integration (Primary)
MCP_SERVER_PORT=8788
MCP_ENABLE_CACHING=true
MCP_AGENT_TIMEOUT=30000
MCP_MAX_TOKENS=10000

# CLI Option (Secondary)
ENABLE_CLI_OPTION=true
CLI_PACKAGE_NAME=nuggetwise-cli
```

---

## 🔑 **Required API Keys**

### **1. OpenAI API Key**
- **Purpose**: AI-powered analysis and PRD generation for MCP integration
- **Get it**: [OpenAI Platform](https://platform.openai.com/api-keys)
- **Cost**: Pay-per-use (typically $0.01-0.10 per analysis)
- **Usage**: Primary LLM for MCP integration orchestration

### **2. V0 Platform API Key**
- **Purpose**: AI-powered UI generation and code generation from PRDs
- **Get it**: [V0 Platform](https://v0.dev/)
- **Cost**: Free tier available, pay-per-use for advanced features
- **Model**: v0-1.5-md (latest)
- **Rate Limit**: 30 requests per minute
- **Usage**: Core UI generation for both MCP and CLI approaches

### **3. Supabase Configuration**
- **Purpose**: Authentication, database, and file storage (Postgres)
- **Get it**: [Supabase Dashboard](https://supabase.com/dashboard)
- **Cost**: Generous free tier
- **Usage**: Primary database for all platform data

### **4. Stripe Keys (Optional)**
- **Purpose**: Payment processing for subscription tiers
- **Get it**: [Stripe Dashboard](https://dashboard.stripe.com/)
- **Cost**: Free to set up, fees on transactions
- **Usage**: Billing for MCP integration and CLI option tiers

---

## **🔧 Environment Variables Reference**

### **Project Configuration**
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `PROJECT_NAME` | string | `CursorFlow` | Name of the project |
| `PROJECT_VERSION` | string | `2.0.0` | Current version of the platform |
| `NODE_ENV` | string | `development` | Node.js environment (development/production) |

### **Application URLs**
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `FRONTEND_URL` | string | `http://localhost:3000` | Frontend application URL |
| `BACKEND_URL` | string | `http://localhost:3001` | Backend API server URL |
| `API_BASE_URL` | string | `http://localhost:3001/api` | Base URL for API endpoints |
| `MCP_SERVER_URL` | string | `http://localhost:8788` | MCP server URL for Cursor integration (Primary) |
| `CLI_SERVER_URL` | string | `http://localhost:3001/api/cli` | CLI server URL for command-line access (Secondary) |

### **AI Services Configuration**

#### **Primary LLM Provider**
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `PRIMARY_LLM_PROVIDER` | string | `openai` | Primary AI provider (openai/groq/anthropic) |
| `OPENAI_API_KEY` | string | - | OpenAI API key (required) |
| `OPENAI_MODEL` | string | `gpt-4o` | OpenAI model to use |

#### **Alternative LLM Providers**
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `GROQ_API_KEY` | string | - | Groq API key (optional) |
| `ANTHROPIC_API_KEY` | string | - | Anthropic API key (optional) |

#### **MCP Integration Configuration (Primary)**
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `MCP_AGENT_TIMEOUT` | number | `30000` | Agent timeout in milliseconds |
| `MCP_MAX_TOKENS` | number | `10000` | Maximum tokens per agent request |
| `MCP_ENABLE_CACHING` | boolean | `true` | Enable agent response caching |
| `MCP_SERVER_PORT` | number | `8788` | MCP server port for Cursor integration |
| `MCP_ENABLE_ORCHESTRATION` | boolean | `true` | Enable 7-agent orchestration |

#### **CLI Option Configuration (Secondary)**
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `ENABLE_CLI_OPTION` | boolean | `true` | Enable CLI option for power users |
| `CLI_PACKAGE_NAME` | string | `nuggetwise-cli` | NPX package name for CLI |
| `CLI_SERVER_PORT` | number | `3001` | CLI server port |
| `CLI_ENABLE_AUTOMATION` | boolean | `true` | Enable CLI automation features |

#### **Analysis Configuration**
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `DEFAULT_AUDIT_TYPE` | string | `comprehensive` | Default audit type |
| `MAX_ANALYSIS_TIME` | number | `60000` | Maximum analysis time in milliseconds |
| `ENABLE_CACHING` | boolean | `true` | Enable analysis result caching |

### **External Services**

#### **v0 Platform Integration**
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `V0_API_KEY` | string | - | v0.dev API key (required) |
| `V0_BASE_URL` | string | `https://api.v0.dev` | v0 API base URL |
| `V0_MODEL` | string | `v0-1.5-md` | v0 model to use |
| `V0_RATE_LIMIT` | number | `30` | Rate limit (requests per minute) |
| `V0_MAX_PROMPT_LENGTH` | number | `1000` | Maximum prompt length in characters |

#### **Cursor IDE Integration**
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `CURSOR_MCP_ENABLED` | boolean | `true` | Enable Cursor MCP integration |
| `CURSOR_RULES_PATH` | string | `.cursor/rules/nw.yaml` | Path to Cursor rules file |
| `V0_MCP_ENABLED` | boolean | `true` | Enable V0 MCP server integration |
| `V0_MCP_SERVER_PATH` | string | `packages/v0-mcp-server` | Path to V0 MCP server |

#### **Slack Integration**
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `SLACK_WEBHOOK_URL` | string | - | Slack webhook URL for notifications |
| `SLACK_CHANNEL` | string | `#nuggetwise-builds` | Default Slack channel |
| `SLACK_ALERT_CHANNEL` | string | `#nuggetwise-alerts` | Alert notifications channel |

#### **Database Configuration (Supabase/Postgres)**
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `SUPABASE_URL` | string | - | Supabase project URL |
| `SUPABASE_ANON_KEY` | string | - | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | string | - | Supabase service role key |
| `SUPABASE_ENABLE_RLS` | boolean | `true` | Enable Row Level Security |
| `SUPABASE_AUTO_MIGRATE` | boolean | `true` | Auto-run database migrations |

#### **Payment Processing**
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `STRIPE_SECRET_KEY` | string | - | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | string | - | Stripe webhook secret |

### **Security & Authentication**
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `JWT_SECRET` | string | - | JWT signing secret (required) |
| `JWT_EXPIRES_IN` | string | `7d` | JWT token expiration time |

### **Budget & Limits**
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `MAX_MONTHLY_REQUESTS` | number | `1000` | Maximum requests per month |
| `MAX_DAILY_COST` | number | `50` | Maximum daily cost in USD |
| `BUDGET_ALERT_THRESHOLD` | number | `0.8` | Alert when 80% of budget used |

### **Feature Flags**
| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `ENABLE_MCP_INTEGRATION` | boolean | `true` | Enable MCP integration (primary approach) |
| `ENABLE_CLI_OPTION` | boolean | `true` | Enable CLI option (secondary approach) |
| `ENABLE_MULTI_PLATFORM` | boolean | `true` | Enable multi-platform support |
| `ENABLE_SLACK_NOTIFICATIONS` | boolean | `true` | Enable Slack notifications |
| `ENABLE_ANALYTICS` | boolean | `true` | Enable analytics tracking |
| `ENABLE_V0_INTEGRATION` | boolean | `true` | Enable V0 AI-powered UI generation |

---

## 🏗️ **Detailed Configuration**

### **AI Services Configuration**

#### **OpenAI Setup (Primary LLM for MCP Integration)**
```bash
# In all three .env files:
OPENAI_API_KEY=sk-your-openai-api-key
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=2000
OPENAI_TEMPERATURE=0.3

# MCP Integration specific settings
MCP_ORCHESTRATION_PROVIDER=openai
MCP_AGENT_TIMEOUT=30000
MCP_MAX_TOKENS=10000
```

#### **Alternative LLM Providers (CLI Option)**
```bash
# Optional: Use Groq or Anthropic for CLI option
GROQ_API_KEY=your-groq-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
USE_GROQ=false
USE_ANTHROPIC=false

# CLI-specific LLM settings
CLI_LLM_PROVIDER=openai
CLI_MAX_TOKENS=4000
```

#### **V0 Platform Configuration**
```bash
# V0 API Configuration
V0_API_KEY=v0_your_actual_v0_key
V0_MODEL=v0-1.5-md
V0_RATE_LIMIT=30
V0_MAX_PROMPT_LENGTH=1000
V0_BASE_URL=https://api.v0.dev

# V0 MCP Server Configuration (Primary)
V0_MCP_ENABLED=true
V0_MCP_SERVER_PORT=8788
V0_MCP_SERVER_PATH=packages/v0-mcp-server

# Multi-Platform Configuration
ENABLE_NPX_CLI=true
ENABLE_VSCODE_EXTENSION=true
NPX_CLI_PACKAGE_NAME=nuggetwise-v0-init
VSCODE_EXTENSION_ID=nuggetwise.v0-generator

# MCP Integration Configuration
MCP_ENABLE_ORCHESTRATION=true
MCP_AGENT_TIMEOUT=30000
MCP_MAX_TOKENS=10000
MCP_ENABLE_CACHING=true

# CLI Option Configuration (Secondary)
ENABLE_CLI_OPTION=true
CLI_PACKAGE_NAME=nuggetwise-cli
CLI_ENABLE_AUTOMATION=true
```

### **Supabase Setup (Primary Database)**

#### **1. Create Supabase Project**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Enable Authentication (Email/Password, OAuth providers)
4. Create PostgreSQL database (automatically included)

#### **2. Get API Keys**
1. Go to Project Settings > API
2. Copy the Project URL and API keys
3. Configure the values:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

#### **3. Set up Database Schema**
1. Go to SQL Editor in Supabase Dashboard
2. Run the database schema from `backend/config/database.sql`
3. This creates all necessary tables, policies, and functions for MCP-first platform

#### **4. Configure Row Level Security (RLS)**
```sql
-- Enable RLS for all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE prds ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for MCP integration and CLI option data
CREATE POLICY "Users can access own data" ON users
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can access own PRDs" ON prds
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access own projects" ON projects
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access own analytics" ON analytics
  FOR ALL USING (auth.uid() = user_id);
```

### **MCP Integration Setup (Primary)**

#### **1. MCP Server Configuration**
```bash
# MCP Server settings
MCP_SERVER_PORT=8788
MCP_SERVER_HOST=localhost
MCP_ENABLE_SSL=false

# Agent orchestration settings
MCP_AGENT_TIMEOUT=30000
MCP_MAX_TOKENS=10000
MCP_ENABLE_CACHING=true
MCP_CACHE_TTL=3600

# Cursor IDE integration
CURSOR_MCP_ENABLED=true
CURSOR_RULES_PATH=.cursor/rules/mcp.yaml
```

#### **2. Cursor IDE Integration**
1. Install Cursor IDE
2. Configure MCP server connection
3. Set up `.cursor/rules/mcp.yaml` file
4. Test MCP integration

#### **3. MCP Agent Configuration**
```bash
# 7-Agent Orchestration settings
MCP_INTENT_ANALYSIS_ENABLED=true
MCP_UX_PATTERN_SELECTOR_ENABLED=true
MCP_VALIDATION_AGENT_ENABLED=true
MCP_UI_REQUIREMENT_SYNTHESIZER_ENABLED=true
MCP_V0_PROMPT_BUILDER_ENABLED=true
MCP_DIFF_DETECTOR_ENABLED=true
MCP_NOTIFICATION_AGENT_ENABLED=true
```

### **CLI Option Setup (Secondary)**

#### **1. CLI Package Configuration**
```bash
# CLI settings
CLI_PACKAGE_NAME=nuggetwise-cli
CLI_SERVER_PORT=3001
CLI_ENABLE_AUTOMATION=true
CLI_ENABLE_SCRIPTING=true

# NPX package settings
NPX_CLI_PACKAGE_NAME=nuggetwise-v0-init
NPX_CLI_VERSION=latest
```

#### **2. CLI Installation**
```bash
# Install CLI globally
npm install -g nuggetwise-cli

# Or use NPX
npx nuggetwise-v0-init@latest
```

### **v0 Platform Setup**

#### **1. Get API Key**
1. Go to [v0 Platform](https://v0.dev/)
2. Sign up/Login
3. Go to API settings
4. Generate API key

#### **2. Configure**
```bash
V0_API_KEY=v0_your_api_key
V0_BASE_URL=https://api.v0.dev
```

---

## 🔧 **Development Configuration**

### **Feature Flags**
```bash
# MCP Integration (Primary)
ENABLE_MCP_INTEGRATION=true
ENABLE_MCP_ORCHESTRATION=true
ENABLE_MCP_CACHING=true
ENABLE_MCP_CONTEXT_AWARE=true

# CLI Option (Secondary)
ENABLE_CLI_OPTION=true
ENABLE_CLI_AUTOMATION=true
ENABLE_CLI_SCRIPTING=true

# Analysis Features
ENABLE_ACCESSIBILITY_ANALYSIS=true
ENABLE_PERFORMANCE_ANALYSIS=true
ENABLE_CONTENT_ANALYSIS=true
ENABLE_COMPREHENSIVE_ANALYSIS=true
ENABLE_MULTI_STAGE_ANALYSIS=true

# Multi-Platform Support
ENABLE_MULTI_PLATFORM=true
ENABLE_VSCODE_EXTENSION=true
ENABLE_NPX_CLI=true
```

### **Debug Settings**
```bash
# Development debugging
DEBUG=false
VERBOSE_LOGGING=false
SHOW_PROMPT_DEBUG=false
TEST_MODE=false
```

### **Performance Settings**
```bash
# Rate limiting and caching
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CACHE_TTL=3600
MAX_ANALYSIS_TIME=60000
```

---

## 🚀 **Production Configuration**

### **Environment Variables**
```bash
# Production settings
NODE_ENV=production
LOG_LEVEL=warn
ENABLE_ANALYTICS=true
SENTRY_DSN=your_sentry_dsn
```

### **Security Settings**
```bash
# Production security
JWT_SECRET=your-super-secure-jwt-secret
CORS_ORIGIN=https://yourdomain.com
STRIPE_SECRET_KEY=sk_live_your_stripe_key
```

---

## 🔍 **Validation**

### **Check Configuration**
```bash
# Validate environment setup
npm run validate:env

# Test API connections
npm run test:connections

# Test MCP integration
npm run test:mcp

# Test CLI option
npm run test:cli

# Validate Supabase connection
npm run validate:supabase
```

### **Common Issues**

#### **1. Missing API Keys**
```bash
Error: OPENAI_API_KEY is not set
Solution: Add your OpenAI API key to all three .env files
```

#### **2. Supabase Configuration**
```bash
Error: Supabase project not found
Solution: Verify SUPABASE_URL and service account credentials
```

#### **3. MCP Integration Issues**
```bash
Error: MCP server connection failed
Solution: Check MCP_SERVER_PORT and CURSOR_MCP_ENABLED settings
```

#### **4. CLI Option Issues**
```bash
Error: CLI package not found
Solution: Verify CLI_PACKAGE_NAME and NPX_CLI_PACKAGE_NAME settings
```

#### **3. CORS Issues**
```bash
Error: CORS policy blocked request
Solution: Update CORS_ORIGIN in backend/.env
```

---

## 📊 **Environment File Structure**

```
cursorflow/
├── .env                    # Root configuration
├── frontend/
│   ├── .env.local         # Next.js configuration
│   └── env.example        # Frontend template
├── backend/
│   ├── .env               # API server configuration
│   └── env.example        # Backend template
└── env.example            # Root template
```

---

## 🔒 **Security Best Practices**

### **1. Never Commit .env Files**
```bash
# Ensure .env files are in .gitignore
echo ".env" >> .gitignore
echo "frontend/.env.local" >> .gitignore
echo "backend/.env" >> .gitignore
```

### **2. Use Strong Secrets**
```bash
# Generate secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### **3. Rotate API Keys Regularly**
- OpenAI: Every 90 days
- Supabase: Every 6 months
- Stripe: As needed

### **4. Environment-Specific Configs**
```bash
# Development
NODE_ENV=development
DEBUG=true

# Production
NODE_ENV=production
DEBUG=false
```

---

## 🚀 **Deployment Configuration**

### **Vercel Deployment**
```bash
# Add environment variables in Vercel dashboard
vercel env add OPENAI_API_KEY
vercel env add V0_API_KEY
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# MCP Integration variables
vercel env add MCP_SERVER_PORT
vercel env add MCP_ENABLE_CACHING
vercel env add MCP_AGENT_TIMEOUT

# CLI Option variables
vercel env add ENABLE_CLI_OPTION
vercel env add CLI_PACKAGE_NAME
```

### **Docker Deployment**
```bash
# Use environment file with Docker
docker run --env-file .env cursorflow
```

---

## 📝 **Troubleshooting**

### **Environment Variable Issues**
```bash
# Check if variables are loaded
node -e "console.log(process.env.OPENAI_API_KEY)"

# Debug environment loading
DEBUG=* npm run dev
```

### **API Connection Issues**
```bash
# Test OpenAI connection
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models

# Test v0 connection
curl -H "Authorization: Bearer $V0_API_KEY" \
  https://api.v0.dev/v1/chat
```

---

*This comprehensive configuration guide ensures you have all the necessary environment variables configured correctly for development and production use.* 