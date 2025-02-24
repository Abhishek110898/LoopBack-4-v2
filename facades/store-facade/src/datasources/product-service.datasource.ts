import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'productService',
  connector: 'rest',
  baseURL: 'http://127.0.0.1:3001',
  crud: false,
  operations: [
    {
      template: {
        method: 'GET',
        url: 'http://localhost:3001/products',
      },
      functions: {
        getProducts: [],
      },
    },
    {
      template: {
        method: 'GET',
        url: 'http://localhost:3001/products/{id}',
      },
      functions: {
        getProductById: ['id'],
      },
    },
    {
      template: {
        method: 'POST',
        url: 'http://localhost:3001/products', // ✅ Create user API
        body: { name: "{name}", price: "{price}" }, // Request body format
        headers: {
          'Content-Type': 'application/json',
        },
      },
      functions: {
        createProduct: ['name', 'price'], 
      },
    },
  ],
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class ProductServiceDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'productService';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.productService', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
