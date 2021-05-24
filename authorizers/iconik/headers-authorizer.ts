import { getEnv } from '@helper/environment';
import { errorHandler } from '@helper/error-handler';
import { log } from '@helper/logger';
import { IconikParams } from '@workflowwin/iconik-api';
import { APIGatewayAuthorizerEvent, Handler } from 'aws-lambda';
import { getIconikContext } from './helper';
import { generatePolicy } from '../policy-generator';
import { AuthorizerResponse, IconikContext, IconikEnhancedAuthContext } from './interfaces/context';

export const iconikAuthorizer: Handler<APIGatewayAuthorizerEvent, AuthorizerResponse> = async (event, context) => {
  log('[Iconik Authorizer]', event);
  try {
    const callerId: string = event['headers']['User-Id'];
    const authToken: string = event['headers']['auth-token'];

    const iconikUrl = getEnv('ICONIK_URL');
    const appId = getEnv('ICONIK_APP_ID');
    const systemDomainId = getEnv('ICONIK_DOMAIN_ID');

    const iconikParams: IconikParams = { authToken, iconikUrl, appId, systemDomainId };

    const { appOwner }: IconikContext = await getIconikContext(iconikParams, callerId);
    const context: IconikEnhancedAuthContext = {
      ...iconikParams,
      ownerId: appOwner?.id,
      ownerEmail: appOwner?.email,
    };

    return generatePolicy<IconikEnhancedAuthContext | any>(`user|${appOwner?.id}`, 'Allow', event.methodArn, context);
  } catch (error) {
    errorHandler(error);
  }
};
