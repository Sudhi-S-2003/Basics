import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['direct', 'group'],
      required: true,
      default: 'direct',
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    name: {
      type: String,
      trim: true,
      maxlength: 100,
      // Required for group chats
      required: function () {
        return this.type === 'group';
      },
    },
    avatar: {
      type: String,
      default: null,
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
      default: null,
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    // Admin users (for group chats)
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    // Read receipts tracking
    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        messageId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Message',
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for efficient queries
conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageAt: -1 });
conversationSchema.index({ type: 1, participants: 1 });

// Ensure direct conversations have exactly 2 participants
conversationSchema.pre('save', function (next) {
  if (this.type === 'direct' && this.participants.length !== 2) {
    next(new Error('Direct conversation must have exactly 2 participants'));
  }
  next();
});

// Static method to find or create direct conversation
conversationSchema.statics.findOrCreateDirect = async function (userId1, userId2) {
  let conversation = await this.findOne({
    type: 'direct',
    participants: { $all: [userId1, userId2], $size: 2 },
  }).populate('participants', 'name email avatar isOnline lastSeen');

  if (!conversation) {
    conversation = await this.create({
      type: 'direct',
      participants: [userId1, userId2],
    });
    
    conversation = await conversation.populate('participants', 'name email avatar isOnline lastSeen');
  }

  return conversation;
};

// Method to add participant to group
conversationSchema.methods.addParticipant = async function (userId) {
  if (!this.participants.includes(userId)) {
    this.participants.push(userId);
    await this.save();
  }
};

// Method to remove participant from group
conversationSchema.methods.removeParticipant = async function (userId) {
  this.participants = this.participants.filter(
    (id) => id.toString() !== userId.toString()
  );
  await this.save();
};

// Method to check if user is participant
conversationSchema.methods.isParticipant = function (userId) {
  return this.participants.some((id) => id.toString() === userId.toString());
};

// Method to check if user is admin
conversationSchema.methods.isAdmin = function (userId) {
  return this.admins.some((id) => id.toString() === userId.toString());
};

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;