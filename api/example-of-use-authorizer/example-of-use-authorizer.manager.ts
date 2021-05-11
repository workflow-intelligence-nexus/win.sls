import { HttpBadRequestError } from '@errors/http';
import { getEnv } from '@helper/environment';
import { IconikService } from '@workflowwin/iconik-api';

export class ExampleOfUseAuthorizerManager {
  public async initialization(iconikService: IconikService): Promise<{ message: string }> {
    try {
      const apiUrl = getEnv('EXAMPLE_OF_USE_AUTHORIZER_URL');

      await iconikService.assets.createCustomAction('NONE', {
        context: 'NONE',
        type: 'POST',
        title: 'Example Custom Action',
        url: apiUrl,
      });

      await iconikService.notifications.createWebhook({
        event_type: 'assets',
        realm: 'segments',
        name: 'Example WebHook',
        url: apiUrl,
      });

      return { message: 'ExampleOfUseAuthorizer Workflow successfully initialize.' };
    } catch (error) {
      console.log('initialize error', error);
      throw new HttpBadRequestError('Cannot initialize ExampleOfUseAuthorizer. Connect WIN Support team.');
    }
  }
}
