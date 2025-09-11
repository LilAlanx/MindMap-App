const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
  mindMap: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MindMap',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  position: {
    x: {
      type: Number,
      required: true,
      default: 0
    },
    y: {
      type: Number,
      required: true,
      default: 0
    }
  },
  size: {
    width: {
      type: Number,
      default: 120,
      min: 60,
      max: 300
    },
    height: {
      type: Number,
      default: 80,
      min: 40,
      max: 200
    }
  },
  style: {
    backgroundColor: {
      type: String,
      default: '#ffffff'
    },
    textColor: {
      type: String,
      default: '#1f2937'
    },
    borderColor: {
      type: String,
      default: '#d1d5db'
    },
    borderWidth: {
      type: Number,
      default: 1,
      min: 0,
      max: 5
    },
    borderRadius: {
      type: Number,
      default: 8,
      min: 0,
      max: 20
    },
    fontSize: {
      type: Number,
      default: 14,
      min: 8,
      max: 24
    },
    fontWeight: {
      type: String,
      enum: ['normal', 'bold'],
      default: 'normal'
    }
  },
  type: {
    type: String,
    enum: ['text', 'image', 'link', 'note'],
    default: 'text'
  },
  metadata: {
    imageUrl: String,
    linkUrl: String,
    noteType: {
      type: String,
      enum: ['idea', 'task', 'question', 'important'],
      default: 'idea'
    }
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Node',
    default: null
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Node'
  }],
  connections: [{
    node: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Node'
    },
    type: {
      type: String,
      enum: ['parent', 'child', 'sibling', 'custom'],
      default: 'child'
    },
    label: String,
    style: {
      color: {
        type: String,
        default: '#6b7280'
      },
      width: {
        type: Number,
        default: 2,
        min: 1,
        max: 10
      },
      style: {
        type: String,
        enum: ['solid', 'dashed', 'dotted'],
        default: 'solid'
      }
    }
  }],
  isCollapsed: {
    type: Boolean,
    default: false
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  zIndex: {
    type: Number,
    default: 1
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
nodeSchema.index({ mindMap: 1, createdAt: -1 });
nodeSchema.index({ parent: 1 });
nodeSchema.index({ createdBy: 1 });
nodeSchema.index({ 'connections.node': 1 });

// Virtual for connection count
nodeSchema.virtual('connectionCount').get(function() {
  return this.connections.length;
});

// Method to add connection
nodeSchema.methods.addConnection = function(nodeId, connectionType = 'child', label = '') {
  const existingConnection = this.connections.find(conn => 
    conn.node.toString() === nodeId.toString()
  );
  
  if (!existingConnection) {
    this.connections.push({
      node: nodeId,
      type: connectionType,
      label: label
    });
  }
  
  return this.save();
};

// Method to remove connection
nodeSchema.methods.removeConnection = function(nodeId) {
  this.connections = this.connections.filter(conn => 
    conn.node.toString() !== nodeId.toString()
  );
  return this.save();
};

// Method to update position
nodeSchema.methods.updatePosition = function(x, y) {
  this.position.x = x;
  this.position.y = y;
  return this.save();
};

module.exports = mongoose.model('Node', nodeSchema);

