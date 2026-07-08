const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Create a temporary guest account
// @route   POST /api/auth/guest
// @access  Public
const createGuestUser = asyncHandler(async (req, res) => {
  // Generate a short random suffix for the guest name
  const suffix = Math.random().toString(36).substring(2, 8);
  const guestExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const user = await User.create({
    name: `Guest_${suffix}`,
    email: `guest_${suffix}_${Date.now()}@guest.omnitracker.local`,
    isGuest: true,
    guestExpiresAt,
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isGuest: true,
    token: generateToken(user._id),
  });
});

module.exports = { createGuestUser };
