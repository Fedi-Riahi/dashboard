import connectDatabase from "@/lib/database";
import CarBrand from "@/models/CarBrand";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const { id } = params;

  try {
    const { name, models, coverImages } = await request.json();

    await connectDatabase();

    // Find the brand by ID and update the coverImages array
    await CarBrand.findByIdAndUpdate(id, { name, models, coverImages });

    return NextResponse.json({ message: "Brand updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating Brand:", error);
    return NextResponse.json({ message: "Failed to update Brand" }, { status: 500 });
  }
}
