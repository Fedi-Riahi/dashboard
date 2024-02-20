import connectDatabase from "@/lib/database"
import SafetyFeatureModel from '@/models/SafetyFeatureModel'
import { NextResponse } from "next/server";
export async function POST(request) {
    const { name } = await request.json()

    await connectDatabase();

    await SafetyFeatureModel.create({ name });
    return NextResponse.json({message : "Safety Feature Created "}, {status: 201});
}

export async function GET(){

    await connectDatabase()
    const safetyFeatures = await SafetyFeatureModel.find()

    return  NextResponse.json({safetyFeatures});

    
}

    