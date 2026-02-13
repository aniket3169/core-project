import mongoose from "mongoose";

const UserRouteSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    routeGeoJSON: {
      type: Object,
      required: true,
    },
    aqiScore: Number,
  },
  { timestamps: true }
);

export default mongoose.models.UserRoute ||
  mongoose.model("UserRoute", UserRouteSchema);
