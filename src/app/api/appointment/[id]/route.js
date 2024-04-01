    import connectDatabase from "@/lib/database";
    import Appointment from "@/models/Appointment";
    import { NextResponse } from "next/server";



    export async function GET(request, { params }) {
    try {
        const { id } = params;

        if (!id) {
        return NextResponse.json({ error: "ID parameter is missing" }, { status: 400 });
        }

        await connectDatabase();
        const appointment = await Appointment.findById(id);

        if (!appointment) {
        return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
        }

        return NextResponse.json({ appointment });
    } catch (error) {
        console.error("Error fetching appointment:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
    }

    export async function PUT(request, { params }) {
    const { id } = params;

    try {
        const requestData = await request.json();
        await connectDatabase();

        // Find the appointment by ID and update its properties
        await Appointment.findByIdAndUpdate(id, requestData);

        return NextResponse.json({ message: "Appointment updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating appointment:", error);
        return NextResponse.json({ message: "Failed to update appointment", error: error.message }, { status: 500 });
    }
    }

    export async function DELETE(request, { params }) {
    const { id } = params;

    try {
        await connectDatabase();

        // Find the appointment by ID and delete it
        const deletedAppointment = await Appointment.findByIdAndDelete(id);
        if (!deletedAppointment) {
        return NextResponse.json({ message: "Appointment not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Appointment deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting appointment:", error);
        return NextResponse.json({ message: "Failed to delete appointment" }, { status: 500 });
    }
    }
