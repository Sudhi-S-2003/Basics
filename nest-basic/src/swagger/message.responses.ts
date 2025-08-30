// src/swagger/message.responses.ts
export const MessageResponses = {
  getAll: {
    status: 200,
    description: 'Fetch all messages',
    schema: {
      example: {
        success: true,
        data: [
          {
            id: 'AbCdE1234',
            message: 'hello',
            createdAt: '2025-08-30T12:00:00.000Z',
          },
        ],
        timestamp: '2025-08-30T12:00:00.000Z',
      },
    },
  },

  created: {
    status: 201,
    description: 'Message created',
    schema: {
      example: {
        success: true,
        data: {
          id: 'XyZ12345',
          message: 'Hello world',
          createdAt: '2025-08-30T12:00:00.000Z',
        },
        timestamp: '2025-08-30T12:00:00.000Z',
      },
    },
  },

  filter: {
    status: 200,
    description: 'Filter messages by id or search term',
    schema: {
      example: {
        success: true,
        data: [
          {
            id: 'AbCdE1234',
            message: 'hello',
            createdAt: '2025-08-30T12:00:00.000Z',
          },
        ],
        timestamp: '2025-08-30T12:00:00.000Z',
      },
    },
  },
};
