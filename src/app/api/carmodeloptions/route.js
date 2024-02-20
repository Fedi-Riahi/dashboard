import connectDatabase from "@/lib/database";
import CarModelOptions from "@/models/CarModelOptions";
import { NextResponse } from "next/server";
export async function GET() {
    await connectDatabase();
    const carModelOptions = await CarModelOptions.find();
    return NextResponse.json({ carModelOptions });
}