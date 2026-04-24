"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActiveAccount } from "thirdweb/react";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/lib/thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { inAppWallet, createWallet } from "thirdweb/wallets";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Building2, Loader2, ArrowRight, Plus } from "lucide-react";
import Link from "next/link";

export default function BusinessLoginPage() {
  const router = useRouter();
  const account = useActiveAccount();
  const [loading, setLoading] = useState(false);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (account?.address) {
      fetchUserBusinesses();
    }
  }, [account?.address]);

  const fetchUserBusinesses = async () => {
    if (!account?.address) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/business/my-businesses?wallet=${account.address}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch businesses");
      }

      setBusinesses(result.businesses || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBusiness = (slug: string) => {
    router.push(`/business/${slug}/dashboard`);
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-32 pb-20 px-6 flex items-center justify-center">
        <Card className="glass shadow-premium border-black/5 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Building2 className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h2 className="font-bold text-2xl mb-2">Business Login</h2>
            <p className="text-foreground/60 mb-6">
              Connect your wallet to access your business account
            </p>
            <ConnectButton
              client={client}
              chain={baseSepolia}
              wallets={[
                inAppWallet({
                  auth: { options: ["google", "email"] },
                  smartAccount: { chain: baseSepolia, sponsorGas: true },
                }),
                createWallet("io.metamask"),
                createWallet("com.coinbase.wallet"),
              ]}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <Badge variant="accent" className="mb-4">
            Business Account
          </Badge>
          <h1 className="font-outfit font-black text-5xl tracking-tight mb-4">
            Select Your <span className="text-primary italic">Business</span>
          </h1>
          <p className="text-foreground/60">Choose a business to manage or create a new one</p>
        </div>

        {loading ? (
          <Card className="glass shadow-premium border-black/5">
            <CardContent className="p-12 text-center">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
              <p className="text-foreground/60">Loading your businesses...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="glass shadow-premium border-black/5">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="text-red-500 text-lg font-bold mb-2">Error Loading Businesses</div>
                <p className="text-foreground/60 mb-4">{error}</p>
                <Button onClick={fetchUserBusinesses}>Try Again</Button>
              </div>
              <div className="pt-6 border-t border-black/5 text-center">
                <p className="text-foreground/60 mb-4">Or create a new business account</p>
                <Link href="/business/register">
                  <Button variant="outline" className="crisp-border">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Business
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : businesses.length === 0 ? (
          <Card className="glass shadow-premium border-black/5">
            <CardContent className="p-12 text-center">
              <Building2 className="w-16 h-16 mx-auto mb-4 text-foreground/40" />
              <h2 className="font-bold text-2xl mb-2">No Businesses Found</h2>
              <p className="text-foreground/60 mb-6">
                You don't have any business accounts yet. Create one to get started!
              </p>
              <Link href="/business/register">
                <Button size="lg" className="font-bold">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Business
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Business List */}
            <div className="grid gap-4">
              {businesses.map((business) => (
                <Card
                  key={business.id}
                  className="glass shadow-premium border-black/5 hover:shadow-2xl transition-all cursor-pointer"
                  onClick={() => handleSelectBusiness(business.business_slug)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 rounded-xl p-4">
                          <Building2 className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl mb-1">{business.business_name}</h3>
                          <p className="text-foreground/60 text-sm mb-2">
                            {business.business_email}
                          </p>
                          <div className="flex gap-2">
                            <Badge
                              className={
                                business.status === "active"
                                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                                  : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                              }
                            >
                              {business.status}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {business.subscription_tier}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-6 h-6 text-foreground/40" />
                    </div>
                    {business.description && (
                      <p className="text-foreground/60 text-sm mt-4 pl-16">
                        {business.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Create New Business */}
            <Card className="glass shadow-premium border-black/5 border-dashed hover:shadow-xl transition-all">
              <CardContent className="p-8 text-center">
                <Plus className="w-12 h-12 mx-auto mb-4 text-foreground/40" />
                <h3 className="font-bold text-lg mb-2">Create Another Business</h3>
                <p className="text-foreground/60 mb-4 text-sm">
                  Manage multiple business accounts from one wallet
                </p>
                <Link href="/business/register">
                  <Button variant="outline" className="crisp-border">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Business
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
