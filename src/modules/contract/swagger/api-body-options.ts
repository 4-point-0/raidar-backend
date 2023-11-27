export const apiBodyOptionsCreateContract = {
  schema: {
    type: 'object',
    properties: {
      songId: {
        type: 'string',
        description: 'ID of the song associated with the contract',
      },
      file: {
        type: 'string',
        format: 'binary',
        description: 'File to upload',
      },
    },
    required: ['songId', 'file'],
  },
};
