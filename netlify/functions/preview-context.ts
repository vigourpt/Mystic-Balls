import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  const isPreviewContext = process.env.CONTEXT === 'deploy-preview';

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: isPreviewContext
        ? 'This is a preview deployment context.'
        : 'This is not a preview deployment context.',
      context: process.env.CONTEXT,
    }),
  };
};
