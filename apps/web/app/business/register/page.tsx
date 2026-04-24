"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useActiveAccount } from "thirdweb/react";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/lib/thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { inAppWallet, createWallet } from "thirdweb/wallets";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Building2, CheckCircle, Loader2 } from "lucide-react";

export default function BusinessRegisterPage() {
  const router = useRouter();
  const account = useActiveAccount();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    businessName: "",
    businessSlug: "",
    businessEmail: "",
    businessType: "startup" as const,
    industry: "",
    companySize: "1-10" as const,
    websiteUrl: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // Auto-generate slug from business name
      if (name === "businessName") {
        updated.businessSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      }
      return updated;
    });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Business Name validation
    if (!formData.businessName.trim()) {
      errors.businessName = "Business name is required";
    } else if (formData.businessName.length < 2) {
      errors.businessName = "Business name must be at least 2 characters";
    }

    // Business Slug validation
    if (!formData.businessSlug.trim()) {
      errors.businessSlug = "Business URL is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.businessSlug)) {
      errors.businessSlug = "Only lowercase letters, numbers, and hyphens allowed";
    }

    // Email validation
    if (!formData.businessEmail.trim()) {
      errors.businessEmail = "Business email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.businessEmail)) {
      errors.businessEmail = "Please enter a valid email address";
    }

    // Website validation (optional but must be valid if provided)
    if (formData.websiteUrl && !/^https?:\/\/.+/.test(formData.websiteUrl)) {
      errors.websiteUrl = "Please enter a valid URL (e.g., https://example.com)";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account?.address) return;

    // Validate form
    if (!validateForm()) {
      setError("Please fix the errors above");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});

    try {
      const response = await fetch("/api/business/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, ownerWallet: account.address }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create business");
      }

      router.push(`/business/${result.business.business_slug}/dashboard`);
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-32 pb-20 px-6 flex items-center justify-center">
        <Card className="glass shadow-premium border-black/5 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Building2 className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h2 className="font-bold text-2xl mb-2">Connect Wallet</h2>
            <p className="text-foreground/60 mb-6">Connect your wallet to register your business on Cloniq</p>
            <ConnectButton
              client={client}
              chain={baseSepolia}
              wallets={[
                inAppWallet({ auth: { options: ["google", "email"] }, smartAccount: { chain: baseSepolia, sponsorGas: true } }),
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
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <Badge variant="accent" className="mb-4">Business Account</Badge>
          <h1 className="font-outfit font-black text-5xl tracking-tight mb-4">
            Register Your <span className="text-primary italic">Business</span>
          </h1>
          <p className="text-foreground/60">Deploy agents for your team and manage them from one dashboard</p>
        </div>

        <Card className="glass shadow-premium border-black/5">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Business Name */}
              <div>
                <label className="block text-sm font-bold text-foreground/60 mb-2">Business Name *</label>
                <input
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  placeholder="Acme Corporation"
                  className={`w-full bg-white/50 border ${
                    fieldErrors.businessName ? 'border-red-500' : 'border-black/10'
                  } px-4 py-3 rounded-xl focus:outline-none focus:border-primary/30`}
                />
                {fieldErrors.businessName && (
                  <p className="text-red-500 text-xs font-medium mt-1">{fieldErrors.businessName}</p>
                )}
              </div>

              {/* Business Slug */}
              <div>
                <label className="block text-sm font-bold text-foreground/60 mb-2">Business URL *</label>
                <div className="flex items-center gap-2">
                  <span className="text-foreground/40 text-sm">cloniq.app/business/</span>
                  <input
                    name="businessSlug"
                    value={formData.businessSlug}
                    onChange={handleChange}
                    required
                    pattern="[a-z0-9-]+"
                    placeholder="acme-corp"
                    className={`flex-1 bg-white/50 border ${
                      fieldErrors.businessSlug ? 'border-red-500' : 'border-black/10'
                    } px-4 py-3 rounded-xl focus:outline-none focus:border-primary/30`}
                  />
                </div>
                {fieldErrors.businessSlug && (
                  <p className="text-red-500 text-xs font-medium mt-1">{fieldErrors.businessSlug}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-foreground/60 mb-2">Business Email *</label>
                <input
                  name="businessEmail"
                  type="email"
                  value={formData.businessEmail}
                  onChange={handleChange}
                  required
                  placeholder="contact@acme.com"
                  className={`w-full bg-white/50 border ${
                    fieldErrors.businessEmail ? 'border-red-500' : 'border-black/10'
                  } px-4 py-3 rounded-xl focus:outline-none focus:border-primary/30`}
                />
                {fieldErrors.businessEmail && (
                  <p className="text-red-500 text-xs font-medium mt-1">{fieldErrors.businessEmail}</p>
                )}
              </div>

              {/* Type & Size */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-foreground/60 mb-2">Business Type *</label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full bg-white/50 border border-black/10 px-4 py-3 rounded-xl focus:outline-none focus:border-primary/30"
                  >
                    <option value="startup">Startup</option>
                    <option value="enterprise">Enterprise</option>
                    <option value="agency">Agency</option>
                    <option value="individual">Individual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground/60 mb-2">Company Size</label>
                  <select
                    name="companySize"
                    value={formData.companySize}
                    onChange={handleChange}
                    className="w-full bg-white/50 border border-black/10 px-4 py-3 rounded-xl focus:outline-none focus:border-primary/30"
                  >
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-500">201-500</option>
                    <option value="500+">500+</option>
                  </select>
                </div>
              </div>

              {/* Industry & Website */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-foreground/60 mb-2">Industry</label>
                  <input
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    placeholder="Fintech"
                    className="w-full bg-white/50 border border-black/10 px-4 py-3 rounded-xl focus:outline-none focus:border-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-foreground/60 mb-2">Website</label>
                  <input
                    name="websiteUrl"
                    type="url"
                    value={formData.websiteUrl}
                    onChange={handleChange}
                    placeholder="https://acme.com"
                    className={`w-full bg-white/50 border ${
                      fieldErrors.websiteUrl ? 'border-red-500' : 'border-black/10'
                    } px-4 py-3 rounded-xl focus:outline-none focus:border-primary/30`}
                  />
                  {fieldErrors.websiteUrl && (
                    <p className="text-red-500 text-xs font-medium mt-1">{fieldErrors.websiteUrl}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-foreground/60 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Brief description of your business..."
                  className="w-full bg-white/50 border border-black/10 px-4 py-3 rounded-xl focus:outline-none focus:border-primary/30 resize-none"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-base font-bold">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Business...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Create Business Account
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
