import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['text', 'image', 'file', 'system'],
      default: 'text',
      required: true,
    },
    content: {
      type: String,
      required: function () {
        return this.type === 'text' || this.type === 'system';
      },
      maxlength: 5000,
    },
    attachments: [
      {
        filename: String,
        originalName: String,
        mimeType: String,
        size: Number,
        url: String,
        thumbnailUrl: String, // For images
      },
    ],
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent',
    },
    // Track which users have read this message
    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Track delivery to offline users
    deliveredTo: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        deliveredAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Reply/thread support
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    // Soft delete
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ conversationId: 1, status: 1 });
messageSchema.index({ sender: 1, createdAt: -1 });

// Method to mark as read by user
messageSchema.methods.markAsRead = async function (userId) {
  const alreadyRead = this.readBy.some(
    (r) => r.user.toString() === userId.toString()
  );

  if (!alreadyRead) {
    this.readBy.push({ user: userId, readAt: new Date() });
    this.status = 'read';
    await this.save();
  }
};

// Method to mark as delivered to user
messageSchema.methods.markAsDelivered = async function (userId) {
  const alreadyDelivered = this.deliveredTo.some(
    (d) => d.user.toString() === userId.toString()
  );

  if (!alreadyDelivered) {
    this.deliveredTo.push({ user: userId, deliveredAt: new Date() });
    if (this.status === 'sent') {
      this.status = 'delivered';
    }
    await this.save();
  }
};

// Static method to get undelivered messages for a user
messageSchema.statics.getUndeliveredMessages = async function (userId) {
  return await this.find({
    'deliveredTo.user': { $ne: userId },
    sender: { $ne: userId },
    isDeleted: false,
  }).populate('sender', 'name avatar');
};

// Sanitize content to prevent XSS
messageSchema.pre('save', function (next) {
  if (this.isModified('content') && this.content) {
    // Basic XSS prevention - strip HTML tags
    this.content = this.content.replace(/<[^>]*>/g, '');
  }
  next();
});

const Message = mongoose.model('Message', messageSchema);

export default Message;