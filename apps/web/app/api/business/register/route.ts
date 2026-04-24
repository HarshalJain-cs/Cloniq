import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase";
import { z } from "zod";

const RegisterBusinessSchema = z.object({
  businessName: z.string().min(2),
  businessSlug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  businessEmail: z.string().email(),
  businessType: z.enum(["startup", "enterprise", "agency", "individual"]),
  industry: z.string().optional(),
  companySize: z.enum(["1-10", "11-50", "51-200", "201-500", "500+"]).optional(),
  websiteUrl: z.string().url().optional(),
  description: z.string().optional(),
  ownerWallet: z.string().min(42),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = RegisterBusinessSchema.parse(body);

    const supabase = createServiceRoleClient();

    // Check slug uniqueness
    const { data: existing } = await supabase
      .from("businesses")
      .select("id")
      .eq("business_slug", data.businessSlug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Business slug already taken" },
        { status: 409 }
      );
    }

    // Create business
    const { data: business, error: businessError } = await supabase
      .from("businesses")
      .insert({
        business_name: data.businessName,
        business_slug: data.businessSlug,
        business_email: data.businessEmail,
        business_type: data.businessType,
        industry: data.industry,
        company_size: data.companySize,
        website_url: data.websiteUrl,
        description: data.description,
        owner_wallet: data.ownerWallet.toLowerCase(),
        status: "active",
        verified: false,
      })
      .select()
      .single();

    if (businessError) {
      console.error("Business creation failed:", businessError);
      return NextResponse.json(
        { error: "Failed to create business" },
        { status: 500 }
      );
    }

    // Create owner as first team member
    const { error: memberError } = await supabase
      .from("business_members")
      .insert({
        business_id: business.id,
        user_wallet: data.ownerWallet.toLowerCase(),
        email: data.businessEmail,
        role: "owner",
        status: "active",
        joined_at: new Date().toISOString(),
      });

    if (memberError) {
      console.error("Member creation failed:", memberError);
    }

    return NextResponse.json({
      success: true,
      business,
      message: `Business "${data.businessName}" created successfully`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Business registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
