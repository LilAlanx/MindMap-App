const mongoose = require('mongoose');

const mindMapSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['viewer', 'editor'],
      default: 'viewer'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  settings: {
    layout: {
      type: String,
      enum: ['radial', 'hierarchical', 'freeform'],
      default: 'radial'
    },
    theme: {
      primaryColor: {
        type: String,
        default: '#3b82f6'
      },
      backgroundColor: {
        type: String,
        default: '#ffffff'
      },
      textColor: {
        type: String,
        default: '#1f2937'
      }
    },
    zoom: {
      type: Number,
      default: 1,
      min: 0.1,
      max: 3
    },
    pan: {
      x: {
        type: Number,
        default: 0
      },
      y: {
        type: Number,
        default: 0
      }
    }
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 20
  }],
  lastModified: {
    type: Date,
    default: Date.now
  },
  version: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Update lastModified and version on save
mindMapSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.lastModified = new Date();
    this.version += 1;
  }
  next();
});

// Index for better query performance
mindMapSchema.index({ owner: 1, createdAt: -1 });
mindMapSchema.index({ 'collaborators.user': 1 });
mindMapSchema.index({ isPublic: 1, createdAt: -1 });
mindMapSchema.index({ tags: 1 });

module.exports = mongoose.model('MindMap', mindMapSchema);
