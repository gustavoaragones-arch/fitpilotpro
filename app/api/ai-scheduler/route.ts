import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { message: "AI scheduler endpoint coming soon" },
    { status: 501 }
  );
}
