import connectDatabase from "@/lib/database";
import CarModel from "@/models/CarModel";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
  try {
      const { id } = params;

      if (!id) {
          return NextResponse.json({ error: "ID parameter is missing" }, { status: 400 });
      }

      await connectDatabase();
      const model = await CarModel.findById(id);

      if (!model) {
          return NextResponse.json({ error: "Model not found" }, { status: 404 });
      }

      return NextResponse.json({ model });
  } catch (error) {
      console.error("Error fetching model:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;

  try {
    const requestData = await request.json();
    const { inStock,folderId, listingTitle, brand, model, condition, type, price, year, driveType, transmission, fuelType, mileage, engineSize, cylinders, color, doors, vin, description, features, safetyFeatures,cardImages,exteriorImages,interiorImages } = requestData;

    await connectDatabase();

    // Find the model by ID and update its properties
    await CarModel.findByIdAndUpdate(id, {
      folderId,
      inStock,
      listingTitle,
      brand,
      model,
      condition,
      type,
      price,
      year,
      driveType,
      transmission,
      fuelType,
      mileage,
      engineSize,
      cylinders,
      color,
      doors,
      vin,
      description,
      features,
      safetyFeatures,
      interiorImages,
      exteriorImages,
      cardImages,
    });

    return NextResponse.json({ message: "Model updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating model:", error);
    return NextResponse.json({ message: "Failed to update model", error: error.message }, { status: 500 });
  }
}


export async function DELETE(request, { params }) {
    const { id } = params;
  
    try {
      await connectDatabase();
  
      // Find the brand by ID and delete it
      const deletedModel = await CarModel.findByIdAndDelete(id);
      if (!deletedModel) {
        return NextResponse.json({ message: "Model not found" }, { status: 404 });
      }
  
      return NextResponse.json({ message: "Model deleted successfully" }, { status: 200 });
    } catch (error) {
      console.error("Error deleting Model:", error);
      return NextResponse.json({ message: "Failed to delete Model" }, { status: 500 });
    }
  }