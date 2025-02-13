import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {UserServiceDataSource} from '../datasources';

export interface UserService {
  getUsers(): Promise<any[]>;
  getUserById(id: string): Promise<any>;
  createUser(name: string, role: string, createdOn: string, modifiedOn: string) : Promise<any>;
  getUserRole(id: string): Promise<any>;
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
}

export class UserServiceProvider implements Provider<UserService> {
  constructor(
    // userService must match the name property in the datasource json file
    @inject('datasources.userService')
    protected dataSource: UserServiceDataSource = new UserServiceDataSource(),
  ) {}

  value(): Promise<UserService> {
    return getService(this.dataSource);
  }
}
