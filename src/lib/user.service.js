import { connectDB } from "./db";
import User from "../models/User";

export async function upsertUserOnLogin({
  provider,
  providerAccountId,
  profile,
  accessToken,
  refreshToken,
  email,
  name,
  image,
  ip,
  userAgent,
}) {
  await connectDB();

  const now = new Date();

  const user = await User.findOne({ email });

  // 🆕 FIRST LOGIN
  if (!user) {
    await User.create({
      email,
      name,
      image,

      providers: [
        {
          provider,
          providerAccountId,
          profile,
          accessToken,
          refreshToken,
        },
      ],

      loginCount: 1,
      firstLoginAt: now,
      lastLoginAt: now,
      lastLoginProvider: provider,

    });

    return;
  }

  // ✅ EXISTING USER
  const providerExists = user.providers.some(
    (p) =>
      p.provider === provider &&
      p.providerAccountId === providerAccountId
  );

  const update = {
    $inc: { loginCount: 1 },
    $set: {
      lastLoginAt: now,
      lastLoginProvider: provider,
      lastLoginIP: ip,
      lastUserAgent: userAgent,
    },
  };

  // 🔗 LINK NEW PROVIDER
  if (!providerExists) {
    update.$push = {
      providers: {
        provider,
        providerAccountId,
        profile,
        accessToken,
        refreshToken,
      },
    };
  }

  await User.updateOne({ email }, update);
}
