import { IconikWebhookBootstrapSchema } from '@workflowwin/iconik-api/dist/src/client-extensions/bootstrap';

export const webhooksSchema: IconikWebhookBootstrapSchema[] = [
  {
    properties: {
      name: 'win_InstallationExampleWebhook',
      event_type: 'assets',
      operation: 'create',
      realm: 'segments',
      status: undefined,
      url: '',
      headers: undefined,
      object_id: undefined,
      description: undefined,
    },
  },
];
