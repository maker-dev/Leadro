import mongoose from "mongoose";

const { Schema } = mongoose;

const ApiKeySchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    label: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
      unique: true,
    },
    revoked: {
      type: Boolean,
      default: false,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    lastUsedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const ApiKey = mongoose.model("ApiKey", ApiKeySchema);

export default ApiKey;
