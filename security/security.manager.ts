import { HttpBadRequestError } from '@errors/http';
import { getEnv } from '@helper/environment';
import { log } from '@helper/logger';
import { IconikTokenInterface, IconikTokenModel, IconikTokenSchema } from '@models/DynamoDB/iconik-token.model';
import { CloudFormationService } from '@services/cloud-formation.service';
import { IconikService } from '@workflowwin/iconik-api';
import { MetadataFieldSchema } from '@workflowwin/iconik-api/dist/src/metadata/metadata-methods';
import { CustomActionSchema } from '@workflowwin/iconik-api/src/assets/assets-methods';
import { WebhookResponseSchema } from '@workflowwin/iconik-api/src/notifications/notifications-methods';
import { ScanResponse } from 'dynamoose/dist/DocumentRetriever';
import { SecurityService } from './security.service';

const refreshHoursField: MetadataFieldSchema = {
  field_type: 'integer',
  name: 'win_RefreshHours',
  label: 'Refresh Hours',
  required: true,
};

export class SecurityManager {
  private readonly service: SecurityService;

  constructor() {
    this.service = new SecurityService();
  }

  async initialization(iconikService: IconikService, cloudFormation: CloudFormationService) {
    try {
      const apiUrl = await cloudFormation.getServiceEndpoint();

      const field: MetadataFieldSchema = await iconikService.metadata.createMetadataField(refreshHoursField);
      const view = await iconikService.metadata.createMetadataView({
        name: 'win_RefreshHoursView',
        label: 'Set Token Refresh Time',
        view_fields: [field],
      });
      await iconikService.metadata.addCategoryToView(view.id, 'custom_actions');

      const customAction = await iconikService.assets.createCustomAction('NONE', {
        context: 'NONE',
        type: 'POST',
        title: 'Change Refresh Token Period',
        url: `${apiUrl}/api/security/change-refresh-token-period`,
        metadata_view: view.id,
      });

      const { groups_acl } = await iconikService.acls.getAclByObjectId(customAction.id!, 'custom_actions');
      await Promise.all(
        groups_acl.map(
          async (acl) => await iconikService.acls.removeGroupAcl(customAction.id!, acl.group_id, 'custom_actions')
        )
      );
      return { message: 'Security Workflow successfully initialize.' };
    } catch (error) {
      log('initialize error', error);
      throw new HttpBadRequestError('Cannot initialize Security. Connect WIN Support team.');
    }
  }

  async changeRefreshTokenPeriod(
    refreshHours: string,
    refreshTokensLambdaARN: string,
    invalidateTokensLambdaARN: string
  ): Promise<{ message: string }> {
    const refreshTokensRuleName = 'refresh-tokens-event';
    const tokensRefreshTime = parseFloat(refreshHours) * 60;

    const invalidateTokensRuleName = 'invalidate-tokens-event';
    const tokensInvalidateTime = tokensRefreshTime + parseFloat(getEnv('REFRESH_TOKEN_HOURS')) * 60;

    await this.service.createRuleAndBindLambda(
      invalidateTokensRuleName,
      tokensInvalidateTime,
      invalidateTokensLambdaARN
    );

    await new Promise((res) => setTimeout(() => res(), 5000));

    await this.service.createRuleAndBindLambda(refreshTokensRuleName, tokensRefreshTime, refreshTokensLambdaARN);

    return { message: 'Tokens refresh time changed successfully.' };
  }

  async refreshTokens(iconikService: IconikService): Promise<{ message: string }> {
    const customActions: CustomActionSchema[] = await this.service.getCustomActions(iconikService);
    const webHooks: WebhookResponseSchema[] = await this.service.getWebHooks(iconikService);

    const invalidationTokens: IconikTokenSchema[] = this.service.getTokensFromWHandCA(webHooks, customActions);
    if (invalidationTokens?.length) {
      const batchPut = await IconikTokenModel.batchPut(invalidationTokens);
      log('batchPut', batchPut);
    }

    const newToken: string = await this.service.createNewAppToken(iconikService);
    await this.service.updateTokensInWHandCA(iconikService, webHooks, customActions, newToken);

    return { message: 'Refresh tokens successfully!' };
  }

  async invalidateTokens(iconikService: IconikService): Promise<{ message: string }> {
    const invalidationTokens: ScanResponse<IconikTokenInterface> = await this.service.getTokensFromDynamoDB();

    await Promise.all(
      invalidationTokens.map(async ({ token, createdAt }) => {
        if (this.service.isInvalidateIconikToken(createdAt)) {
          await this.service.invalidateIconikToken(iconikService, token);
          await IconikTokenModel.delete({ token });
        }
      })
    );

    return { message: 'Invalidate tokens successfully!' };
  }
}
