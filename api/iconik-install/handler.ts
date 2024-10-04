import { CloudFormationCustomResourceHandler } from 'aws-lambda';
import { cfnResponse, ResponseStatus } from '@bifravst/cloudformation-helpers';
import * as logger from '@helper/logger';
import { createIconikClient } from '@helper/iconik';
import { InstallManager } from './lib';

/**
 * Install the feature on Iconik on deploy.
 *
 * Thia function provides installation process to create Icnok Custom Actions,
 * Metadata Fields, Metadata Values or Webhooks.
 *
 * Edit lib/schematics to define what Iconik resources should be created during deployment
 */
export const handler: CloudFormationCustomResourceHandler = async (event, context) => {
  logger.info('event', { event });

  if (event.RequestType !== 'Create' && event.RequestType !== 'Update') {
    await cfnResponse({
      event,
      Status: ResponseStatus.SUCCESS,
      PhysicalResourceId: context.logStreamName,
    });
    return;
  }

  try {
    const manager = new InstallManager(await createIconikClient());
    await manager.install();
  } catch (err) {
    logger.error('installing error', {
      err,
    });
    await cfnResponse({
      event,
      Status: ResponseStatus.FAILED,
      Reason: 'Installation process error. Check logs for more information.',
      PhysicalResourceId: context.logStreamName,
    });
  } finally {
    cfnResponse({
      event,
      Status: ResponseStatus.SUCCESS,
      PhysicalResourceId: context.logStreamName,
    });
  }
};
