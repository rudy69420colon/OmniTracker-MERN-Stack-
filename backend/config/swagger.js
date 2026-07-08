const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'OmniTracker API',
      version: '1.0.0',
      description:
        'REST API for OmniTracker — a MERN-stack task management application with JWT authentication, guest access, and full CRUD.',
      license: { name: 'MIT', url: 'https://opensource.org/licenses/MIT' },
    },
    servers: [
      { url: '/api', description: 'API base path' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id:     { type: 'string', example: '507f1f77bcf86cd799439011' },
            name:    { type: 'string', example: 'John Doe' },
            email:   { type: 'string', example: 'john@example.com' },
            isGuest: { type: 'boolean', example: false },
            token:   { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
          },
        },
        Task: {
          type: 'object',
          properties: {
            _id:         { type: 'string' },
            user:        { type: 'string' },
            title:       { type: 'string', example: 'Finish report' },
            description: { type: 'string', example: 'Complete Q3 report by Friday' },
            status:      { type: 'string', enum: ['todo', 'in-progress', 'done'] },
            priority:    { type: 'string', enum: ['low', 'medium', 'high'] },
            dueDate:     { type: 'string', format: 'date-time', nullable: true },
            createdAt:   { type: 'string', format: 'date-time' },
            updatedAt:   { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            stack:   { type: 'string', nullable: true },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
