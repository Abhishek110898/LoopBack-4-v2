import {inject} from '@loopback/core';
import {get, param,requestBody, post, response, getModelSchemaRef, Request} from '@loopback/rest';
import {ProductService} from '../services/product-service.service';
import {OrderService} from '../services/order-service.service';
import {UserService} from '../services/user-service.service';
import { authenticate, STRATEGY } from 'loopback4-authentication';
import { authorize } from 'loopback4-authorization';
import { ratelimit } from 'loopback4-ratelimiter';
// const rateLimitKeyGen = (req: Request) => {
//   const token =
//     (req.headers &&
//       req.headers.authorization &&
//       req.headers.authorization.replace(/bearer /i, '')) ||
//     '';
//   return token;
// };



export class StoreController {
  constructor(
    @inject('services.ProductService') private productService: ProductService,
    @inject('services.OrderService') private orderService: OrderService,
    @inject('services.UserService') private userService: UserService,
  ) {}


  @authenticate(STRATEGY.BEARER)
  @get('/store/products-with-orders')
  async getProductsWithOrders() {
    const products = await this.productService.getProducts();
    const orders = await this.orderService.getOrders();

    return products.map(product => ({
      ...product,
      orders: orders.filter(order => order.productId === product.id),
    }));
  }

  @authenticate(STRATEGY.BEARER)
  @get('/store/orders-with-users')
  async getOrdersWithUsers() {
    const orders = await this.orderService.getOrders();
    const users = await this.userService.getUsers();

    return orders.map(order => ({
      ...order,
      user: users.find(user => user.id === order.userId),
    }));
  }

  @authenticate(STRATEGY.BEARER)
  // @ratelimit(true, {
  //   max: 5,
  //   keyGenerator: rateLimitKeyGen,
  // })
  @get('/store/users')
  async getUsers() {
    return this.userService.getUsers();
  }

  @authenticate(STRATEGY.BEARER)
  @get('/store/users/{id}')
  async getUserById(@param.path.string('id') id: string) {
    return this.userService.getUserById(id);
  }

  @post('/store/users')
  @response(201, {
    description: 'User created succesfully',
  })
  async createUser(
    @requestBody() userData: {firstName: string; lastName:string; email:string; password:string; role: string; createdOn: string; modifiedOn: string},
  ) {
    return this.userService.createUser(userData.firstName, userData.lastName, userData.email, userData.password, userData.role, userData.createdOn, userData.modifiedOn);
  }

  @post('/store/user/login')
  @response(200, {
    description: 'Welcome',
  })
  async loginUser(
    @requestBody() userData: {email: string; password: string},
  ) {
    return this.userService.loginUser(userData.email, userData.password);
  }

  @authenticate(STRATEGY.BEARER)
  @get('/store/user-role/{id}')
  async getUserRole(@param.path.string('id') id:string) {
    const user = await this.userService.getUserRole(id);
    return {name : user.name, role: user.role}
  }

  @authenticate(STRATEGY.BEARER)
  @get('/store/products')
  async getProducts() {
    return this.productService.getProducts();
  }

  @authenticate(STRATEGY.BEARER)
  @get('/store/products/{id}')
  async getProductById(@param.path.string('id') id: string) {
    return this.productService.getProductById(id);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['SuperAdmin'], resource:'role'})
  @post('/store/products')
  async createProduct(
    @requestBody() productData: {name: string, price: number},
  ) {
    return this.productService.createProduct(productData.name, productData.price);
  }

  @authenticate(STRATEGY.BEARER)
  @get('/store/orders')
  async getOrders() {
    return this.orderService.getOrders();
  }

  @authenticate(STRATEGY.BEARER)
  @get('/store/orders/{id}')
  async getOrderById(@param.path.string('id') id: string) {
    return this.orderService.getOrderById(id);
  }

  @authenticate(STRATEGY.BEARER)
  @post('/store/orders')
  async createOrder(
    @requestBody() orderData: {productId: string, userId: string, quantity: number, price: number},
  ) {
    return this.orderService.createOrder(orderData.productId, orderData.userId, orderData.quantity, orderData.price);
  }
}
