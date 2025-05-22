import { createDictSingle } from "@/db/mongodb/dictCollection";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        throw "123"
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
} 