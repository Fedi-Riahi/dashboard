import connectDatabase from "@/lib/database"
import Overview from '@/models/overview'
import { NextResponse } from "next/server";
export async function POST(request) {
    const { coverImage, title, description, images } = await request.json()

    await connectDatabase();

    await Overview.create({ coverImage, title, description, images });
    return NextResponse.json({message : "Overview Created "}, {status: 201});
}

export async function GET(){

    await connectDatabase()
    const overviews = await Overview.find()

    return  NextResponse.json({overviews});
    
}

    