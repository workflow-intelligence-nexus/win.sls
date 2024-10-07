import { IconikMetadataBootstrapSchema } from '@workflowwin/iconik-api/dist/src/client-extensions/bootstrap';
import { getEnv, getStage } from '@helper/environment';

export const SERVICE_INSTALLED_FIELD = `win_${getEnv('SERVICE_NAME')}_${getStage()}_installed`;

export function buildServiceInstalledMetadata(): IconikMetadataBootstrapSchema {
  const schema: IconikMetadataBootstrapSchema = {
    fields: {
      [SERVICE_INSTALLED_FIELD]: {
        properties: {
          description: 'WIN Automation',
          field_type: 'boolean',
          label: 'Installed',
          read_only: true,
        },
      },
    },
  };

  return schema;
}
