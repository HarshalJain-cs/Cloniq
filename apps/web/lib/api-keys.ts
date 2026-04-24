import { createServiceRoleClient } from "@/lib/supabase";
import crypto from "crypto";

export function generateKey(): string {
  // Use cryptographically secure random bytes
  const randomBytes = crypto.randomBytes(32);
  const key = randomBytes.toString("base64url"); // URL-safe base64
  return `sk-cloniq-${key}`;
}

export async function verifyApiKey(
  key: string
): Promise<{ walletAddress: string } | null> {
  if (!key?.startsWith("sk-cloniq-")) return null;
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("api_keys")
    .select("wallet_address")
    .eq("key", key)
    .maybeSingle();
  if (error || !data) return null;
  supabase
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("key", key)
    .then(() => {});
  return { walletAddress: data.wallet_address };
}

export async function getUserCredits(walletAddress: string): Promise<number> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("users")
    .select("usdc_credits")
    .eq("wallet_address", walletAddress)
    .maybeSingle();
  return parseFloat(data?.usdc_credits ?? "0");
}

export async function deductCredits(
  walletAddress: string,
  amount: number
): Promise<void> {
  const supabase = createServiceRoleClient();
  await supabase.rpc("deduct_usdc_credits", {
    p_wallet: walletAddress,
    p_amount: amount,
  });
}
