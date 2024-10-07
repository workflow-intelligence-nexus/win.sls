import { IconikCustomActionBootstrapSchema } from '@workflowwin/iconik-api/dist/src/client-extensions/bootstrap';

export function buildCustomActionsSchema(appId: string, baseApiUrl: string): IconikCustomActionBootstrapSchema[] {
  if (!baseApiUrl.endsWith('/')) {
    baseApiUrl = `${baseApiUrl}/`;
  }

  return [
    {
      properties: {
        title: 'Example custom action',
        context: 'NONE',
        type: 'POST',
        app_id: appId,
        url: `${baseApiUrl}api/example`,
      },
    },
  ];
}
