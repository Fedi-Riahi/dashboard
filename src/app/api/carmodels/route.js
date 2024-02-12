import connectDatabase from "@/lib/database"
import CarModel from '@/models/CarModel'
import { NextResponse } from "next/server";
export async function POST(request) {
    const {folderId,listingTitle,brand,model,condition,type,price,year,driveType,transmission,fuelType,mileage,engineSize,cylinders,color,doors,vin,description,features,safetyFeatures,images,internImages} = await request.json()

    await connectDatabase();

    await CarModel.create({folderId,listingTitle,brand,model,condition,type,price,year,driveType,transmission,fuelType,mileage,engineSize,cylinders,color,doors,vin,description,features,safetyFeatures,images,internImages});
    return NextResponse.json({message : "Car Listing Created "}, {status: 201});
}

export async function GET(){

    await connectDatabase()
    const carListing = await CarModel.find()

    return  NextResponse.json({carListing});

    
}

    