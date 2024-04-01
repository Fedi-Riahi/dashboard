import connectDatabase from "@/lib/database";
import CarPart from '@/models/CarPart';
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const {
            name,
            category,
            description,
            price,
            stock,
            manufacturer,
            modelNumber,
            year,
            compatibleCarModels,
            images,
            specifications
        } = await request.json();

        await connectDatabase();

        // Create a new CarPart
        const newCarPart = new CarPart({
            name,
            category,
            description,
            price,
            stock,
            manufacturer,
            modelNumber,
            year,
            compatibleCarModels,
            images,
            specifications
        });

        // Save the car part
        await newCarPart.save();

        console.log("Created CarPart:", newCarPart);

        return NextResponse.json({ message: "Car Part Created", data: newCarPart }, { status: 201 });
    } catch (error) {
        console.error("Error creating Car Part:", error);
        return NextResponse.json({ message: "Error creating Car Part" }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDatabase();
        const carParts = await CarPart.find();
        return NextResponse.json({ carParts });
    } catch (error) {
        console.error("Error fetching Car Parts:", error);
        return NextResponse.json({ message: "Error fetching Car Parts" }, { status: 500 });
    }
}
