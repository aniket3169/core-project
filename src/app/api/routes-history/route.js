import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import { connectDB } from "../../../lib/db";
import UserRoute from "../../../models/UserRoute";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    await connectDB();

    const routes = await UserRoute.find({
      email: session.user.email,
    })
      .sort({ createdAt: -1 }) // latest first
      .lean();

    return Response.json(routes);
  } catch (err) {
    console.error("Fetch history error:", err);
    return new Response("Server error", { status: 500 });
  }
}
