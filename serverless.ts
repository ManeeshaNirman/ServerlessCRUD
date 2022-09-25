import type { AWS } from '@serverless/typescript';

import functions from '@functions/index';
import sns from './resources/sns';

const serverlessConfiguration: AWS = {
  service: 'student-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild','serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage:'dev',
    profile:'ManeeshaNirman',
    stackName: '${self:service}-stack-${sls:stage}',
    apiName: '${self:service}-${sls:stage}',
    region:'us-west-2',
    timeout:30,
    memorySize:1024,
    endpointType:'regional',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
      apiKeys:['${self:provider.apiName}-apikey-${sls:stage}']
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      DBHOSTNAME:'student-service-test.cluster-ccrzylxpgyd2.us-west-2.rds.amazonaws.com',
      DBPORT:'5432',
      DBNAME:'studentdb',
      DBUSERNAME:'postgres',
      DBPASSWORD:'12345678',
      DBSCHEMA:'public'
    },
  },
  // import the function via paths
  functions: functions ,
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk','pg-native'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    allowedHttpHeaders:
    'Accept,Authorization,Content-Type,Content-Length,x-api-key',
  },
  resources: {
    Resources: {
    ...sns,
    },
  },
};

module.exports = serverlessConfiguration;
