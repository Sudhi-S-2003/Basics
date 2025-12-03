import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,              // <-- This creates the email index
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false, // Don't return password by default
    },

    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 50,
    },

    avatar: {
      type: String,
      default: null,
    },

    statusMessage: {
      type: String,
      maxlength: 150,
      default: 'Hey there! I am using chat app',
    },

    lastSeen: {
      type: Date,
      default: Date.now,
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    socketId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Text index for searching name & email
userSchema.index({ name: 'text', email: 'text' });
// ❌ Removed duplicate: userSchema.index({ email: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Public profile (safe user data)
userSchema.methods.toPublicProfile = function () {
  return {
    _id: this._id,
    email: this.email,
    name: this.name,
    avatar: this.avatar,
    statusMessage: this.statusMessage,
    lastSeen: this.lastSeen,
    isOnline: this.isOnline,
  };
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
