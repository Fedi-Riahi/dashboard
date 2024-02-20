import connectDatabase from "@/lib/database"
import FeatureModel from '@/models/FeatureModel'
import { NextResponse } from "next/server";
export async function POST(request) {
    const { name } = await request.json()

    await connectDatabase();

    await FeatureModel.create({ name });
    return NextResponse.json({message : "Feature Created "}, {status: 201});
}

export async function GET(){

    await connectDatabase()
    const features = await FeatureModel.find()

    return  NextResponse.json({features});
    
}

    