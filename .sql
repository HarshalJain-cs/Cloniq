-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.agent_memories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  agent_id uuid,
  content text NOT NULL,
  embedding USER-DEFINED,
  access text DEFAULT 'public'::text CHECK (access = ANY (ARRAY['public'::text, 'private'::text])),
  source text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT agent_memories_pkey PRIMARY KEY (id),
  CONSTRAINT agent_memories_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.agents(id)
);
CREATE TABLE public.agents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text NOT NULL,
  owner_address text NOT NULL,
  wallet_address text,
  contract_agent_id text,
  skill_tags ARRAY DEFAULT '{}'::text[],
  price_usdc numeric DEFAULT 0,
  is_free boolean DEFAULT true,
  endpoint_url text,
  query_count integer DEFAULT 0,
  status text DEFAULT 'active'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  ens_name text,
  owner_wallet text,
  CONSTRAINT agents_pkey PRIMARY KEY (id)
);
CREATE TABLE public.api_keys (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  wallet_address text NOT NULL,
  label text DEFAULT 'Default'::text,
  created_at timestamp with time zone DEFAULT now(),
  last_used_at timestamp with time zone,
  CONSTRAINT api_keys_pkey PRIMARY KEY (id)
);
CREATE TABLE public.topup_transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  wallet_address text NOT NULL,
  amount_inr numeric NOT NULL,
  amount_usdc numeric NOT NULL,
  razorpay_order_id text NOT NULL UNIQUE,
  razorpay_payment_id text,
  status text DEFAULT 'pending'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT topup_transactions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.users (
  wallet_address text NOT NULL,
  display_displayname text,
  avatar_seed text,
  bio text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  usdc_credits numeric DEFAULT 0,
  CONSTRAINT users_pkey PRIMARY KEY (wallet_address)
);
CREATE TABLE public.whatsapp_sessions (
  phone_number text NOT NULL,
  current_agent_id text,
  current_agent_name text,
  current_agent_description text,
  state text DEFAULT 'menu'::text,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT whatsapp_sessions_pkey PRIMARY KEY (phone_number)
);