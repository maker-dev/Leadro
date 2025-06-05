import mongoose from 'mongoose';

const { Schema } = mongoose;

const ApiKeySchema = new Schema({
  clientId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  key: {
    type: String,
    required: true,
    unique: true
  },
  revoked: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

const ApiKey = mongoose.model('ApiKey', ApiKeySchema);

export default ApiKey;
