import { PolicyMetadata, events } from '@hicommonwealth/core';

const inputs = {
  ThreadCreated: events.schemas.ThreadCreated,
  CommentCreated: events.schemas.CommentCreated,
};

export const ContestWorker = (): PolicyMetadata<typeof inputs> => ({
  inputs,
  body: {
    ThreadCreated: async ({ name, payload }) => {
      console.log(name, payload.thread);
    },
    CommentCreated: async ({ name, payload }) => {
      console.log(name, payload.comment);
    },
  },
});
