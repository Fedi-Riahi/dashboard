import connectDatabase from "@/lib/database"
import Trims from '@/models/Trims'
import { NextResponse } from "next/server";
export async function POST(request) {
    const { 
        name,
        year,
        model,
        consommation,
        consommationWLTP,
        emissions,
        capacity,
        fuelType,
        motorisation,
        cylinders,
        couple,
        puissance,
        compression,
        autonomie,
        maxSpeed,
        acceleration,
        dimensions,
        length,
        height,
        width,
        performance,
        driveType,
        transmission,
        transmissionType,
        chassis,
        places,
        doors,
        wheels,
        frontWheels,
        rearWheels,
        weight,
        PTAC,
        emptyWeight,
        maxCharge,
        trailer,
        roofWeight,
        trunkCapacity,
        onDemand } = await request.json()

    await connectDatabase();

    await Trims.create({ 
        name,
        year,
        model,
        consommation,
        consommationWLTP,
        emissions,
        capacity,
        fuelType,
        motorisation,
        cylinders,
        couple,
        puissance,
        compression,
        autonomie,
        maxSpeed,
        acceleration,
        dimensions,
        length,
        height,
        width,
        performance,
        driveType,
        transmission,
        transmissionType,
        chassis,
        places,
        doors,
        wheels,
        frontWheels,
        rearWheels,
        weight,
        PTAC,
        emptyWeight,
        maxCharge,
        trailer,
        roofWeight,
        trunkCapacity,
        onDemand });
    return NextResponse.json({message : "New Trim Created "}, {status: 201});
}

export async function GET(){

    await connectDatabase()
    const trims = await Trims.find()

    return  NextResponse.json({trims});
    
}

    