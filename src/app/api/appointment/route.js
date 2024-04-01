import connectDatabase from "@/lib/database";
import Appointment from '@/models/Appointment';
import { NextResponse } from "next/server";

export async function POST(request) {
    const {
        customerFirstName,
        customerLastName,
        customerEmail,
        phoneNumber,
        carVIN,
        plateNumber,
        mileage,
        serviceType,
        subServices,
        appointmentDateOptions,
        comment,
        status
    } = await request.json();

    await connectDatabase();

    await Appointment.create({
        customerFirstName,
        customerLastName,
        customerEmail,
        phoneNumber,
        carVIN,
        plateNumber,
        mileage,
        serviceType,
        subServices,
        appointmentDateOptions,
        comment,
        status
    });

    return NextResponse.json({ message: "Appointment created successfully" }, { status: 201 });
}


export async function GET(request) {
    try {
      await connectDatabase();
      const appointments = await Appointment.find();
  
      return NextResponse.json({ appointments });
    } catch (error) {
      console.error("Error fetching appointments:", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  }
