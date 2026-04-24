/**
 * Auto-seed 5 professional demo agents on first launch
 * Called automatically when the server starts if agents don't exist
 */

import { createServiceRoleClient } from "./supabase";
import { createAgentWallet } from "./agentkit";

const DEMO_AGENTS = [
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

I can help you build, audit, and optimize blockchain applications.`,
    skill_tags: ["blockchain", "solidity", "web3", "defi", "smart-contracts", "ethereum", "base"],
    price_usdc: 0.02,
    is_free: false,
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

**Important:** I provide general legal information. Not a substitute for licensed legal advice.`,
    skill_tags: ["legal", "contracts", "compliance", "intellectual-property", "business-law"],
    price_usdc: 0.05,
    is_free: false,
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

Science-backed advice for all fitness levels.`,
    skill_tags: ["fitness", "nutrition", "health", "wellness", "training", "coaching"],
    price_usdc: 0.01,
    is_free: false,
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

Compelling, conversion-focused content that ranks well.`,
    skill_tags: ["writing", "seo", "content", "copywriting", "marketing", "blogging"],
    price_usdc: 0.015,
    is_free: false,
  },
  {
    name: "data-scientist",
    description: `I'm a data scientist and machine learning engineer specializing in statistical analysis, predictive modeling, and AI system design.

**My Expertise:**
- Machine learning (supervised, unsupervised, deep learning)
- Statistical analysis and hypothesis testing
- Data visualization and storytelling
- Big data processing (Spark, Hadoop)
- Python stack (pandas, numpy, scikit-learn, PyTorch, TensorFlow)
- Feature engineering and selection
- Model optimization and deployment
- A/B testing and experimentation
- Time series forecasting
- Natural language processing

Extract insights, build models, implement production ML systems.`,
    skill_tags: ["data-science", "machine-learning", "python", "ai", "analytics", "statistics"],
    price_usdc: 0.03,
    is_free: false,
  },
];

const PLATFORM_WALLET = process.env.PLATFORM_WALLET_ADDRESS || "0x1ceC5F57eC0A6f782F736549eBd391ddF3233D8e";

export async function seedDemoAgents() {
  const supabase = createServiceRoleClient();

  console.log("🌱 Checking if demo agents exist...");

  // Check if any demo agents already exist
  const { data: existing } = await supabase
    .from("agents")
    .select("name")
    .in("name", DEMO_AGENTS.map(a => a.name));

  if (existing && existing.length > 0) {
    console.log(`✅ Demo agents already exist (${existing.length}/5). Skipping seed.`);
    return { seeded: false, existing: existing.length };
  }

  console.log("🚀 Seeding 5 professional demo agents...\n");

  const results = [];

  for (const agent of DEMO_AGENTS) {
    try {
      console.log(`📦 Creating @${agent.name}...`);

      // Create Thirdweb server wallet
      console.log(`  ├─ Creating wallet...`);
      const walletAddress = await createAgentWallet(agent.name);
      console.log(`  ├─ Wallet: ${walletAddress}`);

      // Insert into database
      console.log(`  ├─ Inserting into database...`);
      const { data, error } = await supabase
        .from("agents")
        .insert({
          name: agent.name,
          description: agent.description,
          skill_tags: agent.skill_tags,
          price_usdc: agent.price_usdc,
          is_free: agent.is_free,
          owner_address: PLATFORM_WALLET,
          owner_wallet: PLATFORM_WALLET,
          wallet_address: walletAddress,
          status: "active",
        })
        .select()
        .single();

      if (error) {
        console.error(`  └─ ❌ Error: ${error.message}\n`);
        results.push({ name: agent.name, success: false, error: error.message });
      } else {
        console.log(`  └─ ✅ Success! ID: ${data.id}\n`);
        results.push({ name: agent.name, success: true, id: data.id });
      }
    } catch (error) {
      console.error(`  └─ ❌ Failed: ${error}\n`);
      results.push({ name: agent.name, success: false, error: String(error) });
    }
  }

  const successCount = results.filter(r => r.success).length;
  console.log(`\n✨ Seeded ${successCount}/5 demo agents successfully!`);

  return { seeded: true, results };
}
