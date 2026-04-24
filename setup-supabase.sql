-- ============================================================
-- CLONIQ — Run ALL of these in Supabase SQL Editor at once
-- Go to: https://ajlvfozfysxppuitlqrr.supabase.co
-- Navigate to: SQL Editor → New Query → Paste this entire file
-- ============================================================

-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Create agents table
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  owner_address TEXT NOT NULL,
  wallet_address TEXT,
  contract_agent_id TEXT,
  skill_tags TEXT[] DEFAULT '{}',
  price_usdc NUMERIC DEFAULT 0,
  is_free BOOLEAN DEFAULT true,
  endpoint_url TEXT,
  query_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  ens_name TEXT,
  owner_wallet TEXT
);

-- 2. Create agent_memories table with pgvector
CREATE TABLE IF NOT EXISTS agent_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(384),  -- 384-dimensional embeddings from all-MiniLM-L6-v2
  access TEXT DEFAULT 'public' CHECK (access IN ('public', 'private')),
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS agent_memories_embedding_idx
ON agent_memories USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- 3. Create users table
CREATE TABLE IF NOT EXISTS users (
  wallet_address TEXT PRIMARY KEY,
  display_name TEXT,
  avatar_seed TEXT,
  bio TEXT,
  usdc_credits NUMERIC(10,6) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create API keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  wallet_address TEXT NOT NULL,
  label TEXT DEFAULT 'Default',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

-- 5. Create topup_transactions table (Razorpay)
CREATE TABLE IF NOT EXISTS topup_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  amount_inr NUMERIC(10,2) NOT NULL,
  amount_usdc NUMERIC(10,6) NOT NULL,
  razorpay_order_id TEXT UNIQUE NOT NULL,
  razorpay_payment_id TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create whatsapp_sessions table (Twilio bot state)
CREATE TABLE IF NOT EXISTS whatsapp_sessions (
  phone_number TEXT PRIMARY KEY,
  current_agent_id TEXT,
  current_agent_name TEXT,
  current_agent_description TEXT,
  state TEXT DEFAULT 'menu',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CUSTOM RPC FUNCTIONS
-- ============================================================

-- 7. Vector similarity search function
CREATE OR REPLACE FUNCTION match_agent_memories(
  query_embedding vector(384),
  filter_agent_id UUID,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  agent_id UUID,
  content TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    agent_memories.id,
    agent_memories.agent_id,
    agent_memories.content,
    1 - (agent_memories.embedding <=> query_embedding) AS similarity
  FROM agent_memories
  WHERE agent_memories.agent_id = filter_agent_id
  ORDER BY agent_memories.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 8. Increment agent query count
CREATE OR REPLACE FUNCTION increment_query_count(agent_id UUID)
RETURNS void AS $$
  UPDATE agents
  SET query_count = COALESCE(query_count, 0) + 1
  WHERE id = agent_id;
$$ LANGUAGE sql;

-- 9. Deduct USDC credits atomically
CREATE OR REPLACE FUNCTION deduct_usdc_credits(p_wallet TEXT, p_amount NUMERIC)
RETURNS void AS $$
  UPDATE users
  SET usdc_credits = usdc_credits - p_amount
  WHERE wallet_address = p_wallet
    AND usdc_credits >= p_amount;
$$ LANGUAGE sql;

-- ============================================================
-- SUCCESS MESSAGE
-- ============================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Cloniq database setup complete!';
  RAISE NOTICE 'Tables created: agents, agent_memories, users, api_keys, topup_transactions, whatsapp_sessions';
  RAISE NOTICE 'Functions created: match_agent_memories, increment_query_count, deduct_usdc_credits';
  RAISE NOTICE 'pgvector extension enabled for RAG embeddings';
END $$;
