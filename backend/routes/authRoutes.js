const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { createGuestUser } = require('../controllers/guestController');
const { protect } = require('../middleware/authMiddleware');
const { validateRegister, validateLogin } = require('../middleware/validators');

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:     { type: string, example: "John Doe" }
 *               email:    { type: string, example: "john@example.com" }
 *               password: { type: string, example: "secret123" }
 *     responses:
 *       201: { description: User created, content: { application/json: { schema: { $ref: '#/components/schemas/User' } } } }
 *       400: { description: Validation error }
 *       409: { description: Email already exists }
 */
router.post('/register', validateRegister, registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user and get JWT token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:    { type: string, example: "john@example.com" }
 *               password: { type: string, example: "secret123" }
 *     responses:
 *       200: { description: Login successful, content: { application/json: { schema: { $ref: '#/components/schemas/User' } } } }
 *       400: { description: Missing fields }
 *       401: { description: Invalid credentials }
 */
router.post('/login', validateLogin, loginUser);

/**
 * @swagger
 * /auth/guest:
 *   post:
 *     summary: Create a temporary guest account (24h TTL)
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       201: { description: Guest account created, content: { application/json: { schema: { $ref: '#/components/schemas/User' } } } }
 */
router.post('/guest', createGuestUser);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current logged-in user profile
 *     tags: [Auth]
 *     responses:
 *       200: { description: User profile, content: { application/json: { schema: { $ref: '#/components/schemas/User' } } } }
 *       401: { description: Not authorized }
 */
router.get('/me', protect, getMe);

module.exports = router;
