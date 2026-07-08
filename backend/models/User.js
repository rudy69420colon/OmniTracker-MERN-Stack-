const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      // Password is required only for non-guest users (validated in controller)
    },
    isGuest: {
      type: Boolean,
      default: false,
    },
    guestExpiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// TTL index — MongoDB auto-deletes guest documents after guestExpiresAt
userSchema.index({ guestExpiresAt: 1 }, { expireAfterSeconds: 0 });

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Cascade-delete tasks when a guest user is removed (TTL or manual)
userSchema.pre('deleteOne', { document: true, query: false }, async function () {
  await mongoose.model('Task').deleteMany({ user: this._id });
});

// Instance method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
