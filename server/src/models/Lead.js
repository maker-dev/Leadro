import mongoose from 'mongoose';

const { Schema } = mongoose;

const LeadSchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: false
  },
  source: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'converted', 'lost'],
    default: 'new',
    required: true,
  },
  message: {
    type: String,
    required: false
  },
  extraFields: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

const Lead = mongoose.model('Lead', LeadSchema);

export default Lead;
