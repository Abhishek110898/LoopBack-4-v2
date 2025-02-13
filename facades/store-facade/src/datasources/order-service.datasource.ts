import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'orderService',
  connector: 'rest',
  baseURL: 'http://127.0.0.1:3000',
  crud: false,
  operations: [
    {
      template: {
        method: 'GET',
        url: 'http://localhost:3000/orders',
      },
      functions: {
        getOrders: [],
      },
    },
    {
      template: {
        method: 'GET',
        url: 'http://localhost:3000/orders/{id}',
      },
      functions: {
        getOrderById: ['id'],
      },
    },
    {
      template: {
        method: 'POST',
        url: 'http://localhost:3000/orders', 
        body: { productId: "{productId}", userId: "{userId}", quantity: "{quantity}", price: "{price}" }, // Request body format
        headers: {
          'Content-Type': 'application/json',
        },
      },
      functions: {
        createOrder: ['productId','userId','quantity', 'price'], 
      },
    },
  ],
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class OrderServiceDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'orderService';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.orderService', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
