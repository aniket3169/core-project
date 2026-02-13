import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../api/auth/[...nextauth]/authOptions";
import { connectDB } from "../../../../lib/db";
import User from "../../../../models/User";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const users = await User.find().sort({ createdAt: -1 });

  return NextResponse.json(users);
}
