import { createUserSingle } from "@/db/mongodb/userCollection";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        throw ""
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
} 