import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {ProductServiceDataSource} from '../datasources';

export interface ProductService {
  getProducts(): Promise<any[]>;
  getProductById(id: string): Promise<any>;
  createProduct(name: string, quantity: number) : Promise<any>; // Fetch a single product by ID
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
}

export class ProductServiceProvider implements Provider<ProductService> {
  constructor(
    // productService must match the name property in the datasource json file
    @inject('datasources.productService')
    protected dataSource: ProductServiceDataSource = new ProductServiceDataSource(),
  ) {}

  value(): Promise<ProductService> {
    return getService(this.dataSource);
  }
}
