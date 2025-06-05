import mongoose from 'mongoose';

const { Schema } = mongoose;

const ClientAccessSchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  sharedWithId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  permissions: {
    type: [String],
    required: true,
    enum: ['read', 'edit', 'write', 'delete'],
    default: ['read']
  }
}, {
  timestamps: true
});

const ClientAccess = mongoose.model('ClientAccess', ClientAccessSchema);

export default ClientAccess;
