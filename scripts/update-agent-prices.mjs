import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from apps/web/.env.local
dotenv.config({ path: join(__dirname, '../apps/web/.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateAgentPrices() {
  console.log('🔄 Updating agent prices to $0.00...\n');

  // Update yield-aggregator
  const { data: yieldData, error: yieldError } = await supabase
    .from('agents')
    .update({
      price_usdc: 0.0,
      is_free: true
    })
    .eq('name', 'yield-aggregator')
    .select();

  if (yieldError) {
    console.error('❌ Error updating yield-aggregator:', yieldError.message);
  } else {
    console.log('✅ yield-aggregator updated:', yieldData);
  }

  // Update options-trader
  const { data: optionsData, error: optionsError } = await supabase
    .from('agents')
    .update({
      price_usdc: 0.0,
      is_free: true
    })
    .eq('name', 'options-trader')
    .select();

  if (optionsError) {
    console.error('❌ Error updating options-trader:', optionsError.message);
  } else {
    console.log('✅ options-trader updated:', optionsData);
  }

  // Verify the updates
  console.log('\n🔍 Verifying updates...\n');

  const { data: agents, error: fetchError } = await supabase
    .from('agents')
    .select('name, price_usdc, is_free')
    .in('name', ['yield-aggregator', 'options-trader']);

  if (fetchError) {
    console.error('❌ Error fetching agents:', fetchError.message);
  } else {
    agents.forEach(agent => {
      console.log(`${agent.name}:`);
      console.log(`  - price_usdc: ${agent.price_usdc}`);
      console.log(`  - is_free: ${agent.is_free}`);
      console.log();
    });
  }
}

updateAgentPrices().catch(console.error);
