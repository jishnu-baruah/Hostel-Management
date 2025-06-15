const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  college: {
    type: String,
    required: function() {
      return this.role === 'student';
    },
    trim: true
  },
  course: {
    type: String,
    required: function() {
      return this.role === 'student';
    },
    trim: true
  },
  year: {
    type: Number,
    required: function() {
      return this.role === 'student';
    },
    min: [1, 'Year must be at least 1'],
    max: [6, 'Year cannot exceed 6']
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    default: null
  },
  documents: [{
    type: {
      type: String,
      enum: ['id_proof', 'college_id'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isApproved: {
    type: Boolean,
    default: false
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  expoPushToken: {
    type: String,
    default: null
  },
  profilePicture: {
    type: String,
    default: null
  },
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  }
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isApproved: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update lastActive on save
userSchema.pre('save', function(next) {
  this.lastActive = new Date();
  next();
});

// Instance method to check password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Instance method to get public profile
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Static method to find active students
userSchema.statics.findActiveStudents = function() {
  return this.find({ 
    role: 'student', 
    isApproved: true 
  }).populate('roomId');
};

// Static method to find pending approvals
userSchema.statics.findPendingApprovals = function() {
  return this.find({ 
    role: 'student', 
    isApproved: false 
  });
};

// Virtual for full name (if needed for display)
userSchema.virtual('displayName').get(function() {
  return this.name;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);