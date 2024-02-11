// routes/api/carBrands.js
import connectDatabase from "@/lib/database";
import CarBrand from '@/models/CarBrand';
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { name, models, coverImages, folderId } = await request.json();

        await connectDatabase();

        // Check if the brand already exists
        const existingBrand = await CarBrand.findOne({ name });

        if (existingBrand) {
            return NextResponse.json({ message: "Brand with this name already exists" }, { status: 400 });
        }

        // Create a new CarBrand
        const newCarBrand = new CarBrand({ name, models, coverImages, folderId });

        // Save the brand and models
        await newCarBrand.save();

        console.log("Created CarBrand:", newCarBrand);

        const savedBrand = await CarBrand.findOne({ name }); // Retrieve the saved brand for verification
        console.log("Saved CarBrand:", savedBrand);

        return NextResponse.json({ message: "Car Brand Created", data: newCarBrand }, { status: 201 });
    } catch (error) {
        console.error("Error creating Car Brand:", error);
        return NextResponse.json({ message: "Error creating Car Brand" }, { status: 500 });
    }
}

export async function GET() {
    await connectDatabase();
    const carBrand = await CarBrand.find();
    return NextResponse.json({ carBrand });
}





export async function DELETE(request) {
    try {
        const { id } = request.params;
        await connectDatabase();
        const brand = await CarBrand.findById(id);
        if (!brand) {
            return new Response("Brand not found", { status: 404 });
        }
        brand.coverImages = []; // Empty the coverImages array
        await brand.save();
        return new Response("Cover images deleted successfully", { status: 200 });
    } catch (error) {
        console.error("Error deleting cover images:", error);
        return new Response("Error deleting cover images", { status: 500 });
    }
}
