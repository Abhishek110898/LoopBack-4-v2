import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'userService',
  connector: 'rest',
  baseURL: 'http://127.0.0.1:3002',
  crud: false,
  operations: [
    {
      template: {
        method: 'GET',
        url: 'http://localhost:3002/users',
      },
      functions: {
        getUsers: [],
      },
    },
    {
      template: {
        method: 'GET',
        url: 'http://localhost:3002/users/{id}',
      },
      functions: {
        getUsertById: ['id'],
      },
    },
    {
      template: {
        method: 'POST',
        url: 'http://localhost:3002/users', 
        body: { firstName: "{firstName}",lastName: "{lastName}", email:"{email}", password:"{password}", role: "{role}", createdOn: "{createdOn}", modifiedOn: "{modifiedOn}" }, // Request body format
        headers: {
          'Content-Type': 'application/json',
        },
      },
      functions: {
        createUser: ['firstName', "lastName", "email", "password", 'role', 'createdOn', 'modifiedOn'], 
      },
    },
    {
      template: {
        method: 'GET',
        url: 'http://localhost:3002/users/{id}',
      },
      functions: {
        getUserRole: ['id'],
      },
    },
    {
      template: {
        method: 'POST',
        url: 'http://localhost:3002/user/login', 
        body: { email: "{email}", password: "{password}" }, // Request body format
        headers: {
          'Content-Type': 'application/json',
        },
      },
      functions: {
        loginUser: ['email', 'password'], 
      },
    },
  ],
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class UserServiceDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'userService';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.userService', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
