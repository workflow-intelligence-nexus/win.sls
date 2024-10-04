import { IconikService } from '@workflowwin/iconik-api';
import * as logger from '@helper/logger';
import { buildCustomActionsSchema, metadataSchema } from './schemas';
import { IconikCredentialsStorage } from '@services/IconikCredentialsStorage';

export class InstallManager {
  private iconikCredentialsStorage = new IconikCredentialsStorage();

  constructor(private iconik: IconikService) {}

  public async install(): Promise<void> {
    if (await this.isInstalled()) {
      logger.debug('the feature is already installed, skipping');
      return;
    }

    logger.debug('boostrap metadata');
    const metadata = this.iconik.extensions.bootstrap.createMetadataBootstrap(metadataSchema, {
      skipFieldCreationIfExists: true,
    });
    await metadata.bootstrap();

    logger.debug('boostrap custom actions');
    const credentials = await this.iconikCredentialsStorage.get();
    const customActionsSchema = buildCustomActionsSchema(credentials.appId, '/');
    const customActions = this.iconik.extensions.bootstrap.createCustomActionsBootstrap(customActionsSchema);
    await customActions.bootstrap();
  }

  public async isInstalled(): Promise<boolean> {
    return false;
  }
}
