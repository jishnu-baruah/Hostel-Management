const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: [true, 'Room number is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  floor: {
    type: Number,
    required: [true, 'Floor number is required'],
    min: [0, 'Floor cannot be negative']
  },
  capacity: {
    type: Number,
    required: [true, 'Room capacity is required'],
    min: [1, 'Capacity must be at least 1'],
    max: [6, 'Capacity cannot exceed 6']
  },
  currentOccupancy: {
    type: Number,
    default: 0,
    min: [0, 'Occupancy cannot be negative']
  },
  monthlyRent: {
    type: Number,
    required: [true, 'Monthly rent is required'],
    min: [0, 'Rent cannot be negative']
  },
  securityDeposit: {
    type: Number,
    required: [true, 'Security deposit is required'],
    min: [0, 'Security deposit cannot be negative']
  },
  amenities: [{
    type: String,
    enum: [
      'AC', 
      'WiFi', 
      'Attached Bathroom', 
      'Balcony', 
      'Study Table', 
      'Wardrobe', 
      'Fan', 
      'Window',
      'Geyser',
      'Refrigerator'
    ]
  }],
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance', 'blocked'],
    default: 'available'
  },
  occupants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  roomType: {
    type: String,
    enum: ['single', 'double', 'triple', 'quad', 'dormitory'],
    required: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  images: [{
    url: String,
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  maintenanceHistory: [{
    issue: String,
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reportedAt: {
      type: Date,
      default: Date.now
    },
    resolvedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'resolved'],
      default: 'pending'
    },
    notes: String
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
roomSchema.index({ roomNumber: 1 });
roomSchema.index({ status: 1 });
roomSchema.index({ floor: 1 });
roomSchema.index({ capacity: 1 });

// Virtual for availability
roomSchema.virtual('isAvailable').get(function() {
  return this.status === 'available' && this.currentOccupancy < this.capacity;
});

// Virtual for occupancy percentage
roomSchema.virtual('occupancyPercentage').get(function() {
  return Math.round((this.currentOccupancy / this.capacity) * 100);
});

// Pre-save middleware to update occupancy count
roomSchema.pre('save', function(next) {
  this.currentOccupancy = this.occupants.length;
  
  // Auto-update status based on occupancy
  if (this.currentOccupancy >= this.capacity && this.status === 'available') {
    this.status = 'occupied';
  } else if (this.currentOccupancy < this.capacity && this.status === 'occupied') {
    this.status = 'available';
  }
  
  next();
});

// Static method to find available rooms
roomSchema.statics.findAvailableRooms = function(capacity = null) {
  const query = { 
    status: 'available',
    $expr: { $lt: ['$currentOccupancy', '$capacity'] }
  };
  
  if (capacity) {
    query.capacity = { $gte: capacity };
  }
  
  return this.find(query).sort({ floor: 1, roomNumber: 1 });
};

// Static method to get occupancy statistics
roomSchema.statics.getOccupancyStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalRooms: { $sum: 1 },
        totalCapacity: { $sum: '$capacity' },
        totalOccupied: { $sum: '$currentOccupancy' },
        availableRooms: {
          $sum: {
            $cond: [
              { $eq: ['$status', 'available'] },
              1,
              0
            ]
          }
        },
        maintenanceRooms: {
          $sum: {
            $cond: [
              { $eq: ['$status', 'maintenance'] },
              1,
              0
            ]
          }
        }
      }
    }
  ]);
  
  return stats[0] || {
    totalRooms: 0,
    totalCapacity: 0,
    totalOccupied: 0,
    availableRooms: 0,
    maintenanceRooms: 0
  };
};

// Instance method to add occupant
roomSchema.methods.addOccupant = function(userId) {
  if (!this.occupants.includes(userId) && this.currentOccupancy < this.capacity) {
    this.occupants.push(userId);
    return this.save();
  }
  throw new Error('Cannot add occupant: room is full or user already assigned');
};

// Instance method to remove occupant
roomSchema.methods.removeOccupant = function(userId) {
  this.occupants = this.occupants.filter(id => !id.equals(userId));
  return this.save();
};

// Ensure virtual fields are serialized
roomSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Room', roomSchema);