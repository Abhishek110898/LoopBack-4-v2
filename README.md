# LoopBack 4 Microservices Monorepo

This repository contains multiple LoopBack 4 microservices that are structured as a monorepo using npm workspaces. The services include:

- **Product Service**: Manages product data.
- **Order Service**: Manages order data.
- **User Service**: Manages user data.
- **Store Facade**: Aggregates calls to the above services and exposes a unified API to end customers.

## Project Structure

The project is organized as follows:

lb4-training-2/ │ 
                ├── services/ # Microservices (Product, Order, User, Store Facade) │ 
                  ├── product-service/ # Product microservice │ 
                  ├── order-service/ # Order microservice │ 
                  ├── user-service/ # User microservice │ 
                └── facades/ # Facade service 
                  ├── store-facade 
                ├── package.json # Root package.json with workspace setup 
                └── README.md # This file


### Prerequisites

Before getting started, make sure you have:

- [Node.js](https://nodejs.org/) (LTS version is recommended)
- [npm](https://www.npmjs.com/) (npm comes with Node.js)
- [LoopBack 4](https://loopback.io/doc/en/lb4/) installed globally (optional)

### Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository_url>
   cd lb4-training-2

2. **Install dependencies**: Since this is a monorepo, dependencies for all services are managed via npm workspaces. From the root folder, 
run: `npm install`

3. **Set up environment variables**: Create a .env file in the relevant microservice(product/order/user) folder and add the necessary environment variables.
Example env file 
MONGOURL = "your mongo url"
MONGOPASSWORD= "your mongo password"

4. **Start the server**: run `npm run dev` at the root directory of project 

5. **Endpoint** Base URL: `http://127.0.0.1:3003` (store facade aggregator)

    