import { User } from "@/models/User";
import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";


export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      return Response.json(
        { success: false, message: "User Not Found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, user });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
