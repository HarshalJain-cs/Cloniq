-- ============================================================
-- CLONIQ — Seed 5 Professional AI Agents
-- Run this in Supabase SQL Editor after creating wallets
-- ============================================================

-- INSTRUCTIONS:
-- 1. Create 5 server wallets in Thirdweb dashboard (https://thirdweb.com/dashboard/wallets/server)
--    Names: blockchain-dev, legal-advisor, fitness-coach, content-writer, data-scientist
-- 2. Copy each wallet address
-- 3. Replace 'WALLET_ADDRESS_HERE' below with the actual addresses
-- 4. Run this SQL in Supabase

-- Agent 1: Blockchain Developer
INSERT INTO agents (
  name,
  description,
  skill_tags,
  price_usdc,
  is_free,
  owner_address,
  owner_wallet,
  wallet_address,
  status
) VALUES (
  'blockchain-dev',
  'I''m a blockchain development expert specializing in smart contract development, Web3 architecture, and decentralized systems.

**My Expertise:**
- Smart contract development (Solidity, Vyper, Rust)
- DeFi protocol design and architecture
- NFT standards (ERC-721, ERC-1155, ERC-6551)
- Layer 2 solutions (Optimism, Arbitrum, Base)
- Web3 integration (ethers.js, viem, wagmi)
- Security best practices and auditing
- Gas optimization techniques
- DAO governance mechanisms

I can help you build, audit, and optimize blockchain applications. Ask me about contract architecture, security patterns, or implementation strategies.',
  ARRAY['blockchain', 'solidity', 'web3', 'defi', 'smart-contracts', 'ethereum', 'base'],
  0.02,
  false,
  '0x1ceC5F57eC0A6f782F736549eBd391ddF3233D8e',
  '0x1ceC5F57eC0A6f782F736549eBd391ddF3233D8e',
  '0x1A3b465305E9D971920C6e48E8636DF8b12f0d21',
  'active'
);

-- Agent 2: Legal Advisor
INSERT INTO agents (
  name,
  description,
  skill_tags,
  price_usdc,
  is_free,
  owner_address,
  owner_wallet,
  wallet_address,
  status
) VALUES (
  'legal-advisor',
  'I''m a legal consultation expert providing guidance on contracts, intellectual property, business law, and regulatory compliance.

**My Expertise:**
- Contract review and drafting
- Intellectual property (patents, trademarks, copyrights)
- Business formation and corporate law
- Employment law and HR compliance
- Privacy regulations (GDPR, CCPA)
- Terms of service and privacy policies
- Crypto/blockchain legal frameworks
- International business law

**Important:** I provide general legal information and guidance. This is not a substitute for professional legal advice from a licensed attorney in your jurisdiction.',
  ARRAY['legal', 'contracts', 'compliance', 'intellectual-property', 'business-law'],
  0.05,
  false,
  '0x1ceC5F57eC0A6f782F736549eBd391ddF3233D8e',
  '0x1ceC5F57eC0A6f782F736549eBd391ddF3233D8e',
  '0x7C3F9AdbeCc1A1cfEaC78c29A779958A35e4EB65',
  'active'
);

-- Agent 3: Fitness Coach
INSERT INTO agents (
  name,
  description,
  skill_tags,
  price_usdc,
  is_free,
  owner_address,
  owner_wallet,
  wallet_address,
  status
) VALUES (
  'fitness-coach',
  'I''m a certified fitness coach specializing in personalized training programs, nutrition planning, and holistic wellness.

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

Whether you''re a beginner or advanced athlete, I''ll provide science-backed advice to help you reach your fitness goals safely and effectively.',
  ARRAY['fitness', 'nutrition', 'health', 'wellness', 'training', 'coaching'],
  0.01,
  false,
  '0x1ceC5F57eC0A6f782F736549eBd391ddF3233D8e',
  '0x1ceC5F57eC0A6f782F736549eBd391ddF3233D8e',
  '0x5F7dBef2ed38dcD9539C16B0A8465072354c1628',
  'active'
);

-- Agent 4: Content Writer
INSERT INTO agents (
  name,
  description,
  skill_tags,
  price_usdc,
  is_free,
  owner_address,
  owner_wallet,
  wallet_address,
  status
) VALUES (
  'content-writer',
  'I''m a professional content writer and copywriter specializing in SEO-optimized content, marketing copy, and engaging storytelling.

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

I create compelling, conversion-focused content that ranks well and resonates with your target audience. Available for both long-form and short-form content needs.',
  ARRAY['writing', 'seo', 'content', 'copywriting', 'marketing', 'blogging'],
  0.015,
  false,
  '0x1ceC5F57eC0A6f782F736549eBd391ddF3233D8e',
  '0x1ceC5F57eC0A6f782F736549eBd391ddF3233D8e',
  '0x4E6b38f17216418fB02C633D9B2be2f42715a2e6',
  'active'
);

-- Agent 5: Data Scientist
INSERT INTO agents (
  name,
  description,
  skill_tags,
  price_usdc,
  is_free,
  owner_address,
  owner_wallet,
  wallet_address,
  status
) VALUES (
  'data-scientist',
  'I''m a data scientist and machine learning engineer specializing in statistical analysis, predictive modeling, and AI system design.

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

I can help you extract insights from data, build predictive models, and implement production-ready ML systems.',
  ARRAY['data-science', 'machine-learning', 'python', 'ai', 'analytics', 'statistics'],
  0.03,
  false,
  '0x1ceC5F57eC0A6f782F736549eBd391ddF3233D8e',
  '0x1ceC5F57eC0A6f782F736549eBd391ddF3233D8e',
  '0x54fa64ADa421cC721C89623D538D97FD06A3c4D9',
  'active'
);

-- Agent 6: Finance Advisor (FREE)
INSERT INTO agents (
  name,
  description,
  skill_tags,
  price_usdc,
  is_free,
  owner_address,
  owner_wallet,
  wallet_address,
  status
) VALUES (
  'finance-advisor',
  'I''m a certified financial advisor specializing in personal finance, investment strategies, wealth management, and financial planning.

**My Expertise:**
- Personal budgeting and financial planning
- Investment portfolio management and diversification
- Retirement planning (401k, IRA, pension strategies)
- Tax optimization and tax-advantaged accounts
- Risk management and insurance planning
- Debt management and credit improvement
- Real estate investment analysis
- Stock market analysis and trading strategies
- Cryptocurrency and digital asset investment
- Estate planning and wealth transfer

**Financial Planning Services:**
- Creating comprehensive financial plans
- Emergency fund strategies
- College savings plans (529, ESA)
- Business finance and startup funding
- Passive income strategies
- Financial independence and early retirement (FIRE)

**Important:** I provide educational financial information and guidance. This is not personalized financial advice. Always consult with a licensed financial advisor or certified financial planner for decisions specific to your situation.',
  ARRAY['finance', 'investing', 'budgeting', 'wealth-management', 'retirement', 'stocks', 'crypto', 'financial-planning'],
  0.00,
  true,
  '0x1ceC5F57eC0A6f782F736549eBd391ddF3233D8e',
  '0x1ceC5F57eC0A6f782F736549eBd391ddF3233D8e',
  '0x9E62fa89d34b5554D4EdAB4a9354009ecB30B87d',
  'active'
);

-- Verify agents were created
SELECT name, skill_tags, price_usdc, is_free, wallet_address, status
FROM agents
ORDER BY created_at DESC
LIMIT 6;
