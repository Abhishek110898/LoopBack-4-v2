import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {ExternalServiceDataSource} from '../datasources';

export interface ExternalService {
  getExternalData(): Promise<any[]>;
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
}

export class ExternalServiceProvider implements Provider<ExternalService> {
  constructor(
    // externalService must match the name property in the datasource json file
    @inject('datasources.externalService')
    protected dataSource: ExternalServiceDataSource = new ExternalServiceDataSource(),
  ) {}

  value(): Promise<ExternalService> {
    return getService(this.dataSource);
  }
}
