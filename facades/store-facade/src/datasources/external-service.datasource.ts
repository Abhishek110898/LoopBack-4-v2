import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'externalService',
  connector: 'rest',
  baseURL: 'http://localhost:3004',
  crud: false,
  operations: [
    {
      template: {
        method: 'GET',
        url: 'http://localhost:3004/external-data',
      },
      functions: {
        getExternalData: [],
      },
    },
  ]
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class ExternalServiceDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'externalService';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.externalService', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
