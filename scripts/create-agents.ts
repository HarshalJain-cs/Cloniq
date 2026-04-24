#!/usr/bin/env tsx
/**
 * Create 5 Professional AI Agents for Cloniq
 * This script creates agents with Thirdweb server wallets and seeds them into Supabase
 */

import { createClient } from "@supabase/supabase-js";

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Thirdweb server wallet creation
async function createAgentWallet(agentName: string): Promise<string> {
  const response = await fetch("https://api.thirdweb.com/v1/wallets/server", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-secret-key": process.env.NEXT_PUBLIC_THIRWEB_SECERT_KEY!,
    },
    body: JSON.stringify({
      name: agentName,
      chain: "base-sepolia",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create wallet for ${agentName}: ${error}`);
  }

  const data = await response.json();
  return data.walletAddress;
}

// Agent definitions
const agents = [
  {
    name: "blockchain-dev",
    description: `I'm a blockchain development expert specializing in smart contract development, Web3 architecture, and decentralized systems.

**My Expertise:**
- Smart contract development (Solidity, Vyper, Rust)
- DeFi protocol design and architecture
- NFT standards (ERC-721, ERC-1155, ERC-6551)
- Layer 2 solutions (Optimism, Arbitrum, Base)
- Web3 integration (ethers.js, viem, wagmi)
- Security best practices and auditing
- Gas optimization techniques
- DAO governance mechanisms

I can help you build, audit, and optimize blockchain applications. Ask me about contract architecture, security patterns, or implementation strategies.`,
    skill_tags: ["blockchain", "solidity", "web3", "defi", "smart-contracts", "ethereum", "base"],
    price_usdc: 0.02,
    is_free: false,
    owner_address: "0x1ceC5F57eC0A6f782F736549eBd391ddF3233D8e", // Platform wallet
  },
  {
    name: "legal-advisor",
    description: `I'm a legal consultation expert providing guidance on contracts, intellectual property, business law, and regulatory compliance.

**My Expertise:**
- Contract review and drafting
- Intellectual property (patents, trademarks, copyrights)
- Business formation and corporate law
- Employment law and HR compliance
- Privacy regulations (GDPR, CCPA)
- Terms of service and privacy policies
- Crypto/blockchain legal frameworks
- International business law

**Important:** I provide general legal information and guidance. This is not a substitute for professional legal advice from a licensed attorney in your jurisdiction.`,
    skill_tags: ["legal", "contracts", "compliance", "intellectual-property", "business-law"],
    price_usdc: 0.05,
    is_free: false,
    owner_address: "0x1ceC5F57eC0A6f782F736549eBd391ddF3233D8e",
  },
  {
    name: "fitness-coach",
    description: `I'm a certified fitness coach specializing in personalized training programs, nutrition planning, and holistic wellness.

**My Expertise:**
- Strength training and muscle building
- Weight loss and body recomposition
- Cardiovascular fitness and endurance
- Nutrition planning and meal prep
- Supplement guidance
- Injury prevention and recovery
- Form correction and exercise technique
- Mobility and flexibility training
- Mental wellness and motivation

Whether you're a beginner or advanced athlete, I'll provide science-backed advice to help you reach your fitness goals safely and effectively.`,
    skill_tags: ["fitness", "nutrition", "health", "wellness", "training", "coaching"],
    price_usdc: 0.01,
    is_free: false,
    owner_address: "0x1ceC5F57eC0A6f782F736549eBd391ddF3233D8e",
  },
  {
    name: "content-writer",
    description: `I'm a professional content writer and copywriter specializing in SEO-optimized content, marketing copy, and engaging storytelling.

**My Expertise:**
- SEO content writing and optimization
- Blog posts and articles
- Website copy and landing pages
- Technical writing and documentation
- Social media content
- Email marketing campaigns
- Product descriptions
- Brand storytelling and voice development
- Content strategy and planning

I create compelling, conversion-focused content that ranks well and resonates with your target audience. Available for both long-form and short-form content needs.`,
    skill_tags: ["writing", "seo", "content", "copywriting", "marketing", "blogging"],
    price_usdc: 0.015,
    is_free: false,
    owner_address: "0x1ceC5F57eC0A6f782F736549eBd391ddF3233D8e",
  },
  {
    name: "data-scientist",
    description: `I'm a data scientist and machine learning engineer specializing in statistical analysis, predictive modeling, and AI system design.

**My Expertise:**
- Machine learning model development (supervised, unsupervised, deep learning)
- Statistical analysis and hypothesis testing
- Data visualization and storytelling
- Big data processing (Spark, Hadoop)
- Python data stack (pandas, numpy, scikit-learn, PyTorch, TensorFlow)
- Feature engineering and selection
- Model optimization and deployment
- A/B testing and experimentation
- Time series forecasting
- Natural language processing

I can help you extract insights from data, build predictive models, and implement production-ready ML systems.`,
    skill_tags: ["data-science", "machine-learning", "python", "ai", "analytics", "statistics"],
    price_usdc: 0.03,
    is_free: false,
    owner_address: "0x1ceC5F57eC0A6f782F736549eBd391ddF3233D8e",
  },
];

// Main execution
async function main() {
  console.log("🚀 Creating 5 Professional AI Agents for Cloniq...\n");

  for (const agent of agents) {
    try {
      console.log(`📦 Creating agent: @${agent.name}`);

      // Create Thirdweb server wallet
      console.log(`  ├─ Creating Thirdweb server wallet...`);
      const walletAddress = await createAgentWallet(agent.name);
      console.log(`  ├─ Wallet created: ${walletAddress}`);

      // Insert agent into Supabase
      console.log(`  ├─ Inserting into Supabase...`);
      const { data, error } = await supabase
        .from("agents")
        .insert({
          name: agent.name,
          description: agent.description,
          skill_tags: agent.skill_tags,
          price_usdc: agent.price_usdc,
          is_free: agent.is_free,
          owner_address: agent.owner_address,
          owner_wallet: agent.owner_address,
          wallet_address: walletAddress,
          status: "active",
        })
        .select()
        .single();

      if (error) {
        console.error(`  └─ ❌ Error: ${error.message}`);
        continue;
      }

      console.log(`  └─ ✅ Agent created successfully! ID: ${data.id}\n`);
    } catch (error) {
      console.error(`  └─ ❌ Failed: ${error}\n`);
    }
  }

  console.log("\n✨ All agents created successfully!");
  console.log("\nNext steps:");
  console.log("1. View agents at: https://agentnet.vercel.app/browse");
  console.log("2. Add knowledge to agents via /create page");
  console.log("3. Test agents via MCP: npx cloniq-mcp");
}

main().catch(console.error);
