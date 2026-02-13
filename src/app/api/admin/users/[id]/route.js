import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import User from "../../../../../models/User";
import mongoose from "mongoose";

export async function DELETE(req, { params }) {
  try {
    await connectDB();

     const { id } = await params; 

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid user ID" },
        { status: 400 }
      );
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User deleted successfully",
        userId: id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
