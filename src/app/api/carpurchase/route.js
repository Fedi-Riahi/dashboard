import connectDatabase from "@/lib/database";
import PurchaseModel from "@/models/PurchaseModel";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { firstName, lastName, email, phoneNumber, address, city, state, zipCode, make, model, year, color, vin, status } = await request.json();

    await connectDatabase();

    await PurchaseModel.create({
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

    return NextResponse.json({ message: "Car Purchase Form Submitted" }, { status: 201 });
}

export async function GET() {
    await connectDatabase();
    const carOrders = await PurchaseModel.find();
    return NextResponse.json(carOrders);
}
