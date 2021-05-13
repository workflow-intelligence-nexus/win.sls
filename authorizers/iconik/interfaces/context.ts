import { IconikParams } from '@workflowwin/iconik-api';
import { APIGatewayAuthorizerResult } from 'aws-lambda';

export interface IconikContext extends IconikParams {
  caller: {
    id: string;
    email: string;
  };
  appOwner: {
    id: string;
    email: string;
  };
}

export interface IconikEnhancedAuthContext extends IconikParams {
  principalId?: string;
  integrationLatency?: string;
  ownerId?: string;
  ownerEmail?: string;
}

export type AuthorizerResponse = (APIGatewayAuthorizerResult & { context: IconikEnhancedAuthContext }) | undefined;
