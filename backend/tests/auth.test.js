// Set env vars before importing app
process.env.JWT_SECRET = 'test-secret-key-for-jest';
process.env.NODE_ENV = 'test';

// Mock DB connection so it doesn't try to connect to Atlas
jest.mock('../config/db', () => jest.fn().mockResolvedValue(null));

// Mock the User model
jest.mock('../models/User');

const request = require('supertest');
const User = require('../models/User');
const app = require('../server');

const mockUser = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Test User',
  email: 'test@example.com',
  matchPassword: jest.fn(),
};

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});

describe('Auth Routes', () => {
  // ─── REGISTER ───────────────────────────────────────────────────────────

  describe('POST /api/auth/register', () => {
    it('should register a new user and return a token', async () => {
      User.findOne.mockResolvedValue(null); // no existing user
      User.create.mockResolvedValue(mockUser);

      const res = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.email).toBe(mockUser.email);
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ email: 'missing@example.com' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    it('should return 409 if email already exists', async () => {
      User.findOne.mockResolvedValue(mockUser); // user already exists

      const res = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toBe(409);
      expect(res.body.message).toMatch(/already exists/i);
    });

    it('should return 400 for an invalid email format', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'not-an-email',
        password: 'password123',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/email/i);
    });

    it('should return 400 if password is too short', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Test User',
        email: 'valid@example.com',
        password: '123',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/6/);
    });
  });

  // ─── LOGIN ──────────────────────────────────────────────────────────────

  describe('POST /api/auth/login', () => {
    it('should login with correct credentials and return a token', async () => {
      mockUser.matchPassword.mockResolvedValue(true);
      User.findOne.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should return 401 for wrong password', async () => {
      mockUser.matchPassword.mockResolvedValue(false);
      User.findOne.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/invalid/i);
    });

    it('should return 400 if fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' }); // no password

      expect(res.statusCode).toBe(400);
    });
  });

  // ─── GET ME ─────────────────────────────────────────────────────────────

  describe('GET /api/auth/me', () => {
    it('should return user profile with a valid token', async () => {
      const jwt = require('jsonwebtoken');
      const token = jwt.sign({ id: mockUser._id }, process.env.JWT_SECRET);

      // Mock findById used in authMiddleware (returns chainable .select())
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.email).toBe(mockUser.email);
    });

    it('should return 401 without a token', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.statusCode).toBe(401);
    });
  });

  // ─── GUEST ──────────────────────────────────────────────────────────────

  describe('POST /api/auth/guest', () => {
    it('should create a guest account and return a token', async () => {
      User.create.mockResolvedValue({
        _id: '507f1f77bcf86cd799439099',
        name: 'Guest_abc123',
        email: 'guest_abc123@guest.omnitracker.local',
        isGuest: true,
      });

      const res = await request(app).post('/api/auth/guest').send();

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.isGuest).toBe(true);
      expect(res.body.name).toMatch(/guest/i);
    });
  });
});
