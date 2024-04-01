import connectDatabase from "@/lib/database";
import CarPart from "@/models/CarPart";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "ID parameter is missing" }, { status: 400 });
    }

    await connectDatabase();
    const part = await CarPart.findById(id);

    if (!part) {
      return NextResponse.json({ error: "Car part not found" }, { status: 404 });
    }

    return NextResponse.json({ part });
  } catch (error) {
    console.error("Error fetching car part:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
    const { id } = params;
  
    try {
      const requestData = await request.json();
      const { name, category, description, price, stock, manufacturer, modelNumber, year, compatibleCarModels, images, specifications } = requestData;
  
      await connectDatabase();
  
      // Find the car part by ID and update all its properties
      await CarPart.findByIdAndUpdate(id, {
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
  
      return NextResponse.json({ message: "Car part updated successfully" }, { status: 200 });
    } catch (error) {
      console.error("Error updating car part:", error);
      return NextResponse.json({ message: "Failed to update car part", error: error.message }, { status: 500 });
    }
  }
  

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await connectDatabase();

    // Find the car part by ID and delete it
    const deletedPart = await CarPart.findByIdAndDelete(id);
    if (!deletedPart) {
      return NextResponse.json({ message: "Car part not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Car part deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting car part:", error);
    return NextResponse.json({ message: "Failed to delete car part" }, { status: 500 });
  }
}
