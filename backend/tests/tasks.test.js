// Set env vars before importing app
process.env.JWT_SECRET = 'test-secret-key-for-jest';
process.env.NODE_ENV = 'test';

jest.mock('../config/db', () => jest.fn().mockResolvedValue(null));
jest.mock('../models/User');
jest.mock('../models/Task');

const request = require('supertest');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Task = require('../models/Task');
const app = require('../server');

const mockUserId = '507f1f77bcf86cd799439011';
const mockUser = { _id: mockUserId, name: 'Task User', email: 'task@example.com' };

// Generate a valid JWT for our mock user
const authToken = jwt.sign({ id: mockUserId }, process.env.JWT_SECRET);

const mockTask = {
  _id: '507f1f77bcf86cd799439022',
  user: mockUserId,
  title: 'Test Task',
  priority: 'high',
  status: 'todo',
  deleteOne: jest.fn().mockResolvedValue({}),
};

beforeEach(() => {
  jest.clearAllMocks();
  // authMiddleware calls User.findById().select('-password') on every protected route
  User.findById.mockReturnValue({
    select: jest.fn().mockResolvedValue(mockUser),
  });
});

describe('Task Routes', () => {
  // ─── CREATE TASK ─────────────────────────────────────────────────────────

  describe('POST /api/tasks', () => {
    it('should create a task with valid data', async () => {
      Task.create.mockResolvedValue(mockTask);

      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test Task', priority: 'high', status: 'todo' });

      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe('Test Task');
    });

    it('should return 400 if title is missing', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ priority: 'low' });

      expect(res.statusCode).toBe(400);
    });

    it('should return 401 without auth token', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'Unauthorized task' });

      expect(res.statusCode).toBe(401);
    });

    it('should return 400 for an invalid priority value', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Valid Title', priority: 'urgent' });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/priority/i);
    });

    it('should return 400 for an invalid status value', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Valid Title', status: 'completed' });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/status/i);
    });
  });

  // ─── GET TASKS ───────────────────────────────────────────────────────────

  describe('GET /api/tasks', () => {
    it('should return an array of tasks for the logged-in user', async () => {
      Task.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue([mockTask]),
      });

      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].title).toBe('Test Task');
    });
  });

  // ─── GET SINGLE TASK ────────────────────────────────────────────────────

  describe('GET /api/tasks/:id', () => {
    it('should return a single task by ID', async () => {
      Task.findById.mockResolvedValue(mockTask);

      const res = await request(app)
        .get(`/api/tasks/${mockTask._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe('Test Task');
    });

    it('should return 404 for a non-existent task', async () => {
      Task.findById.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/tasks/507f1f77bcf86cd799439099')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(404);
    });

    it('should return 403 when accessing another user\'s task', async () => {
      const otherUserTask = { ...mockTask, user: '000000000000000000000099' };
      Task.findById.mockResolvedValue(otherUserTask);

      const res = await request(app)
        .get(`/api/tasks/${mockTask._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(403);
    });
  });

  // ─── UPDATE TASK ─────────────────────────────────────────────────────────

  describe('PUT /api/tasks/:id', () => {
    it('should update a task successfully', async () => {
      const updatedTask = { ...mockTask, title: 'Updated Title', status: 'done' };
      // First findById (ownership check), then findByIdAndUpdate
      Task.findById.mockResolvedValue(mockTask);
      Task.findByIdAndUpdate.mockResolvedValue(updatedTask);

      const res = await request(app)
        .put(`/api/tasks/${mockTask._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated Title', status: 'done' });

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe('Updated Title');
      expect(res.body.status).toBe('done');
    });

    it('should return 403 when updating another user\'s task', async () => {
      // Task belongs to a different user
      const otherUserTask = { ...mockTask, user: '000000000000000000000099' };
      Task.findById.mockResolvedValue(otherUserTask);

      const res = await request(app)
        .put(`/api/tasks/${mockTask._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Hacked' });

      expect(res.statusCode).toBe(403);
    });

    it('should return 404 when updating a non-existent task', async () => {
      Task.findById.mockResolvedValue(null);

      const res = await request(app)
        .put('/api/tasks/507f1f77bcf86cd799439099')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Ghost Task' });

      expect(res.statusCode).toBe(404);
    });
  });

  // ─── DELETE TASK ─────────────────────────────────────────────────────────

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task and return a success message', async () => {
      Task.findById.mockResolvedValue(mockTask);

      const res = await request(app)
        .delete(`/api/tasks/${mockTask._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toMatch(/deleted/i);
    });

    it('should return 403 when deleting another user\'s task', async () => {
      const otherUserTask = { ...mockTask, user: '000000000000000000000099' };
      Task.findById.mockResolvedValue(otherUserTask);

      const res = await request(app)
        .delete(`/api/tasks/${mockTask._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(403);
    });
  });
});
