import connectDatabase from "@/lib/database";
import Trims from "@/models/Trims";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await connectDatabase();

    // Find the brand by ID and delete it
    const deletedTrim = await Trims.findByIdAndDelete(id);
    if (!deletedTrim) {
      return NextResponse.json({ message: "Trim not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Trim deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting Trim:", error);
    return NextResponse.json(
      { message: "Failed to delete Trim" },
      { status: 500 }
    );
  }
}
