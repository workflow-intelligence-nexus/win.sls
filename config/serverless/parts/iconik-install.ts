import { GetAtt } from '../cf-intristic-fn';
import { AWSPartitial } from '../types';

export const iconikInstallConfig: AWSPartitial = {
  functions: {
    install: {
      handler: 'api/iconik-install/handler.handler',
    },
  },
  resources: {
    extensions: {
      InstallLogGroup: {
        DeletionPolicy: 'Retain',
      },
    },
    Resources: {
      Install: {
        Type: 'AWS::CloudFormation::CustomResource',
        Properties: {
          ServiceToken: GetAtt('InstallLambdaFunction.Arn'),
        },
      },
    },
  },
};
