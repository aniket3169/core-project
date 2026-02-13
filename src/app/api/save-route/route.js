import { getServerSession } from "next-auth";
import { authOptions } from "../../../app/api/auth/[...nextauth]/authOptions";
import { connectDB } from "../../../lib/db";
import UserRoute from "../../../models/UserRoute";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { from, to, route, aqiScore } = await req.json();

    if (!from || !to || !route) {
      return new Response("Invalid payload", { status: 400 });
    }

    await connectDB();

    await UserRoute.create({
      email: session.user.email,
      from,
      to,
      routeGeoJSON: route,
      aqiScore,
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Save route error:", err);
    return new Response("Server error", { status: 500 });
  }
}
