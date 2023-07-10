export const abiBodyOptionsFileUpload = {
  schema: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
        nullable: false,
      },
    },
    required: ['file'],
  },
};
