import connectDatabase from "@/lib/database";
import PurchaseModel from "@/models/PurchaseModel";
import { NextResponse } from "next/server";

export async function GET(request, {params}) {
  try {
      const { id } = params;

      if (!id) {
          return NextResponse.json({ error: "ID parameter is missing" }, { status: 400 });
      }

      await connectDatabase();
      const order = await PurchaseModel.findById(id);

      if (!model) {
          return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      return NextResponse.json({ order });
  } catch (error) {
      console.error("Error fetching Order:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;

  try {
    const requestData = await request.json();
    const { firstName, lastName, email, phoneNumber, address, city, state, zipCode, make, model, year, color, vin, status } = requestData;

    await connectDatabase();

    // Find the model by ID and update its properties
    await PurchaseModel.findByIdAndUpdate(id, {
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        city,
        state,
        zipCode,
        make,
        model,
        year,
        color,
        vin,
        status
    });

    return NextResponse.json({ message: "Order updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ message: "Failed to update order", error: error.message }, { status: 500 });
  }
}


export async function DELETE(request, { params }) {
    const { id } = params;
  
    try {
      await connectDatabase();
  
      // Find the brand by ID and delete it
      const deletedOrder = await PurchaseModel.findByIdAndDelete(id);
      if (!deletedOrder) {
        return NextResponse.json({ message: "Order not found" }, { status: 404 });
      }
  
      return NextResponse.json({ message: "Order deleted successfully" }, { status: 200 });
    } catch (error) {
      console.error("Error deleting Order:", error);
      return NextResponse.json({ message: "Failed to delete Order" }, { status: 500 });
    }
  }