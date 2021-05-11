import { IconikParams } from '@workflowwin/iconik-api';
import { APIGatewayAuthorizerResult } from 'aws-lambda';

export interface IconikContext {
  appId: string;
  systemDomainId: string;
  caller: {
    id: string;
    email: string;
  };
  appOwner: {
    id: string;
    email: string;
  };
  authToken: string;
  iconikUrl: string;
}

export interface IconikEnhancedAuthContext extends IconikParams {
  principalId?: string;
  integrationLatency?: string;
  callerId?: string;
  callerEmail?: string;
  ownerId?: string;
  ownerEmail?: string;
}

export type AuthorizerResponse = (APIGatewayAuthorizerResult & { context: IconikEnhancedAuthContext }) | undefined;
