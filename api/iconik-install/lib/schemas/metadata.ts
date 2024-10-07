import { IconikMetadataBootstrapSchema } from '@workflowwin/iconik-api/dist/src/client-extensions/bootstrap';

export const metadataSchema: IconikMetadataBootstrapSchema = {
  fields: {
    win_InstallationExample: {
      properties: {
        description: 'WIN Automation',
        field_type: 'string',
        label: 'App ID',
      },
    },
  },
  views: [
    {
      properties: {
        name: 'win_InstallationExampleView',
      },
      fields: {
        win_InstallationExample: {},
      },
      categories: ['custom_actions'],
    },
  ],
};
