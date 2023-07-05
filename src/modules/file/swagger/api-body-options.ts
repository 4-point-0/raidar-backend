export const abiBodyOptionsFileUpload = {
  schema: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
        nullable: false,
      },
      tags: { type: 'array', items: { type: 'string' }, nullable: true },
    },
    required: ['file'],
  },
};
