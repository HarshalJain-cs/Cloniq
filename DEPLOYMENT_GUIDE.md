# 🚀 Cloniq Deployment Guide

## ✅ Completed Rebrand Checklist

All systems rebranded from "AgentNet" to "Cloniq":

- [x] Package names: `cloniq-monorepo`, `@cloniq/web`, `cloniq-mcp`, `@cloniq/contracts`
- [x] API keys: `sk-cloniq-*` format
- [x] HTTP headers: `X-Cloniq-Key`
- [x] MCP server: `cloniq` (was `agentnet`)
- [x] Environment variables: `CLONIQ_API_URL`, `CLONIQ_API_KEY`
- [x] UI components: All "AgentNet" → "Cloniq"
- [x] System prompts: "Cloniq decentralized economy"
- [x] README and documentation
- [x] Production build completed (40s)
- [x] MCP package built

---

## 📋 Pre-Deployment: Seed AI Agents

### Step 1: Create Thirdweb Server Wallets

1. Go to: https://thirdweb.com/dashboard/wallets/server
2. Click "Create Server Wallet"
3. Create 5 wallets with these **exact names**:
   - `blockchain-dev`
   - `legal-advisor`
   - `fitness-coach`
   - `content-writer`
   - `data-scientist`
4. Copy each wallet address

### Step 2: Update and Run SQL

1. Open `seed-agents.sql`
2. Replace these placeholders with actual addresses:
   ```
   WALLET_ADDRESS_HERE_1 → blockchain-dev wallet
   WALLET_ADDRESS_HERE_2 → legal-advisor wallet
   WALLET_ADDRESS_HERE_3 → fitness-coach wallet
   WALLET_ADDRESS_HERE_4 → content-writer wallet
   WALLET_ADDRESS_HERE_5 → data-scientist wallet
   ```
3. Go to Supabase SQL Editor: https://supabase.com/dashboard/project/ajlvfozfysxppuitlqrr/sql
4. Create new query → Paste SQL → Run
5. Verify: Should show 5 agents with status "active"

---

## 🌐 Vercel Deployment

### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to web app
cd C:\harry\Agentx\vyqno-agentic-marketplace\apps\web

# Deploy to production
vercel --prod
```

### Option B: GitHub + Vercel Dashboard

1. **Create GitHub repository** (optional - you can deploy from local)
2. **Push code**:
   ```bash
   git init
   git add .
   git commit -m "Initial Cloniq deployment"
   git remote add origin YOUR_GITHUB_URL
   git push -u origin main
   ```
3. **Import to Vercel**:
   - Go to: https://vercel.com/new
   - Import your GitHub repo
   - Framework: Next.js
   - Root directory: `apps/web`
   - Click "Deploy"

### Environment Variables for Vercel

Add all these in **Vercel Dashboard → Settings → Environment Variables**:

```env
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://YOUR_VERCEL_URL.vercel.app

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ajlvfozfysxppuitlqrr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_UUItD0bGiCGMawifNxRJBQ_XMg2sXQl
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqbHZmb3pmeXN4cHB1aXRscXJyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzAzMTk0NywiZXhwIjoyMDkyNjA3OTQ3fQ.z0QuWC_sede6FqRChf3-YLmnBkmO4fsm_UdesSoByzc
SUPABASE_PUBLISHABLE_KEY=sb_publishable_UUItD0bGiCGMawifNxRJBQ_XMg2sXQl

# Thirdweb
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=91a50f729e3bb02a0654b5ef66f42f34
NEXT_PUBLIC_THIRWEB_SECERT_KEY=aqEHBPJFTI_Q5jByrveAyIkhQtqdicUKX3ItHZbuq8X6sb1zWOV0aVkcxm-pTHChy_LCYuyCX811Z9AToT04aw

# Smart Contract (Base Sepolia)
NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS=0x3e277fb14ce6e1f4da5391cce381869282fd46b5
DEPLOYER_PRIVATE_KEY=0x604d98d46a5545c6771142f85da92a216c5b8be97b9bc967c512555a88679843
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASESCAN_API_KEY=2W4Y7YI3XT7W7CKPTIKUSYRXH2FXUIPP7J

# x402 Payment
NEXT_PUBLIC_X402_FACILITATOR_URL=https://x402.org/facilitator
PLATFORM_WALLET_ADDRESS=0x1ceC5F57eC0A6f782F736549eBd391ddF3233D8e

# Razorpay
RAZORPAY_KEY_ID=rzp_test_Rsknfzvg1Q7ycn
RAZORPAY_KEY_SECRET=tevplrgPjo0hXptQWh4vsMRH
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_Rsknfzvg1Q7ycn

# HuggingFace
HF_TOKEN=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

# Twilio WhatsApp
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
TWILIO_ACCOUNT_SID=AC0c9990387750e0cff67e5ced4236bfa4
TWILIO_AUTH_TOKEN=YOUR_TWILIO_AUTH_TOKEN_HERE

# Groq LLM
GROQ_API_KEY=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

# Memory Seed Secret
MEMORY_SEED_SECRET=cloniq-memory-secret-2026
```

**Important:** Update `NEXT_PUBLIC_APP_URL` after first deployment with your actual Vercel URL.

---

## 📦 Publish MCP to npm

```bash
# Navigate to MCP package
cd C:\harry\Agentx\vyqno-agentic-marketplace\packages\mcp-server

# Login to npm (if not already logged in)
npm login

# Publish publicly
npm publish --access public
```

**After publishing**, users can install with:
```bash
# Claude Desktop / Cursor config
npx cloniq-mcp
```

**Claude Desktop Config** (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):
```json
{
  "mcpServers": {
    "cloniq": {
      "command": "npx",
      "args": ["-y", "cloniq-mcp"],
      "env": {
        "CLONIQ_API_KEY": "sk-cloniq-YOUR_KEY",
        "CLONIQ_API_URL": "https://your-vercel-url.vercel.app"
      }
    }
  }
}
```

---

## 🧪 Testing Checklist

After deployment, test these features:

### Basic Functionality
- [ ] Homepage loads correctly
- [ ] Browse agents page shows agents
- [ ] Agent profiles load
- [ ] Chat interface streams responses

### Authentication
- [ ] Google sign-in works
- [ ] Wallet connection works
- [ ] API key generation works

### Payments
- [ ] Razorpay topup flow (test mode)
- [ ] x402 payment for paid agents
- [ ] Credit deduction works
- [ ] Balance updates correctly

### Integrations
- [ ] WhatsApp bot responds (send "hi" to Twilio number)
- [ ] MCP tools work in Claude Desktop
- [ ] OpenAPI spec accessible at `/api/openapi`

### Agent Queries
- [ ] Free agents respond without payment
- [ ] Paid agents require payment/credits
- [ ] RAG retrieval works (upload documents first)
- [ ] Streaming responses work

---

## 📊 Post-Deployment

### Update URLs

After deploying to Vercel, update these:

1. **Environment variable**:
   ```
   NEXT_PUBLIC_APP_URL=https://your-actual-url.vercel.app
   ```

2. **README.md badges** (lines 14-16):
   ```markdown
   [![Live](https://img.shields.io/badge/LIVE-your--url-000000?style=for-the-badge)](https://your-actual-url.vercel.app)
   ```

3. **Thirdweb webhook URLs** (if using webhooks):
   - Dashboard → Settings → Webhooks
   - Add: `https://your-url.vercel.app/api/webhooks/thirdweb`

### Monitor

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard/project/ajlvfozfysxppuitlqrr
- **Thirdweb Dashboard**: https://thirdweb.com/dashboard
- **Logs**: Vercel → Project → Logs

---

## 🎉 Launch Checklist

- [ ] Agents seeded in Supabase
- [ ] Deployed to Vercel
- [ ] Environment variables configured
- [ ] MCP package published to npm
- [ ] Tested all major features
- [ ] Updated URLs in code/docs
- [ ] Shared with users!

---

## 🆘 Troubleshooting

### Build Errors
- Check all environment variables are set
- Verify Supabase tables exist
- Check Node.js version (18+)

### Agent Not Responding
- Verify GROQ_API_KEY is valid
- Check Supabase connection
- Ensure HF_TOKEN is set (for embeddings)

### Payment Issues
- Razorpay: Check test mode keys
- x402: Verify PLATFORM_WALLET_ADDRESS
- Ensure agent has wallet_address set

### MCP Not Working
- Check API key format: `sk-cloniq-*`
- Verify CLONIQ_API_URL is correct
- Ensure user has USDC credits

---

## 📞 Support

- **Issues**: Create GitHub issue
- **Docs**: README.md
- **API**: `/api/openapi` endpoint

---

**🎊 Congratulations! Cloniq is ready to launch! 🎊**
