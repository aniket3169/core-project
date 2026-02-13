import mongoose from "mongoose";

const ProviderSchema = new mongoose.Schema(
  {
    provider: { type: String, required: true }, // google / github
    providerAccountId: { type: String, required: true },

    profile: mongoose.Schema.Types.Mixed, // 🔥 full provider profile
    accessToken: String,
    refreshToken: String,
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },

    name: String,
    image: String,

    providers: [ProviderSchema], // 🔥 MULTI PROVIDER SUPPORT

    role: { type: String, default: "user" },
    isActive: { type: Boolean, default: true },

    loginCount: { type: Number, default: 0 },

    firstLoginAt: Date,
    lastLoginAt: Date,
    lastLoginProvider: String,

  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model("User", UserSchema);
