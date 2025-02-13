import {inject} from '@loopback/core';
import {get, param,requestBody, post, response, getModelSchemaRef} from '@loopback/rest';
import {ProductService} from '../services/product-service.service';
import {OrderService} from '../services/order-service.service';
import {UserService} from '../services/user-service.service';


export class StoreController {
  constructor(
    @inject('services.ProductService') private productService: ProductService,
    @inject('services.OrderService') private orderService: OrderService,
    @inject('services.UserService') private userService: UserService,
  ) {}

  @get('/store/products-with-orders')
  async getProductsWithOrders() {
    const products = await this.productService.getProducts();
    const orders = await this.orderService.getOrders();

    return products.map(product => ({
      ...product,
      orders: orders.filter(order => order.productId === product.id),
    }));
  }

  @get('/store/orders-with-users')
  async getOrdersWithUsers() {
    const orders = await this.orderService.getOrders();
    const users = await this.userService.getUsers();

    return orders.map(order => ({
      ...order,
      user: users.find(user => user.id === order.userId),
    }));
  }

  @get('/store/users')
  async getUsers() {
    return this.userService.getUsers();
  }

  @get('/store/users/{id}')
  async getUserById(@param.path.string('id') id: string) {
    return this.userService.getUserById(id);
  }

  @post('/store/users')
  @response(201, {
    description: 'User created succesfully',
  })
  async createUser(
    @requestBody() userData: {name: string; role: string; createdOn: string; modifiedOn: string},
  ) {
    return this.userService.createUser(userData.name, userData.role, userData.createdOn, userData.modifiedOn);
  }

  @get('/store/user-role/{id}')
  async getUserRole(@param.path.string('id') id:string) {
    const user = await this.userService.getUserRole(id);
    return {name : user.name, role: user.role}
  }

  @get('/store/products')
  async getProducts() {
    return this.productService.getProducts();
  }

  @get('/store/products/{id}')
  async getProductById(@param.path.string('id') id: string) {
    return this.productService.getProductById(id);
  }

  @post('/store/products')
  async createProduct(
    @requestBody() productData: {name: string, price: number},
  ) {
    return this.productService.createProduct(productData.name, productData.price);
  }

  @get('/store/orders')
  async getOrders() {
    return this.orderService.getOrders();
  }

  @get('/store/orders/{id}')
  async getOrderById(@param.path.string('id') id: string) {
    return this.orderService.getOrderById(id);
  }

  @post('/store/orders')
  async createOrder(
    @requestBody() orderData: {productId: string, userId: string, quantity: number, price: number},
  ) {
    return this.orderService.createOrder(orderData.productId, orderData.userId, orderData.quantity, orderData.price);
  }
}
