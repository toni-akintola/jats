import { NextResponse } from "next/server";
import { riskService } from "@/services/risk-service";

export async function POST(request: Request) {
  try {
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    const assessment = await riskService.assessRisk(address);
    return NextResponse.json(assessment);
  } catch (error) {
    console.error("Risk assessment error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to assess risk" },
      { status: 500 }
    );
  }
} 