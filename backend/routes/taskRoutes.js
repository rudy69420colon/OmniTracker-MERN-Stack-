const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { validateCreateTask, validateUpdateTask } = require('../middleware/validators');

// All task routes are protected
router.use(protect);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks for the logged-in user
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [todo, in-progress, done] }
 *       - in: query
 *         name: priority
 *         schema: { type: string, enum: [low, medium, high] }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [dueDate, priority] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search task titles (regex)
 *     responses:
 *       200: { description: Array of tasks, content: { application/json: { schema: { type: array, items: { $ref: '#/components/schemas/Task' } } } } }
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:       { type: string, example: "Finish report" }
 *               description: { type: string }
 *               status:      { type: string, enum: [todo, in-progress, done] }
 *               priority:    { type: string, enum: [low, medium, high] }
 *               dueDate:     { type: string, format: date }
 *     responses:
 *       201: { description: Task created, content: { application/json: { schema: { $ref: '#/components/schemas/Task' } } } }
 *       400: { description: Validation error }
 */
router.route('/').get(getTasks).post(validateCreateTask, createTask);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a single task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Task details }
 *       404: { description: Task not found }
 *       403: { description: Not authorized }
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:       { type: string }
 *               description: { type: string }
 *               status:      { type: string, enum: [todo, in-progress, done] }
 *               priority:    { type: string, enum: [low, medium, high] }
 *               dueDate:     { type: string, format: date }
 *     responses:
 *       200: { description: Task updated }
 *       403: { description: Not authorized }
 *       404: { description: Task not found }
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Task deleted }
 *       403: { description: Not authorized }
 *       404: { description: Task not found }
 */
router.route('/:id').get(getTaskById).put(validateUpdateTask, updateTask).delete(deleteTask);

module.exports = router;
