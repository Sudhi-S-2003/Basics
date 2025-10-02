# NestJS Microservices Project

## Project Structure
```
microservices-project/
├── auth-service/
├── user-service/
├── product-service/
├── order-service/
└── gateway/
```

## Setup Instructions

### 1. Create the project structure
```bash
mkdir microservices-project
cd microservices-project
```

### 2. Create each service
```bash
# Create services
nest new auth-service
nest new user-service
nest new product-service
nest new order-service
nest new gateway
```

### 3. Install dependencies for each service

**For all microservices (auth, user, product, order):**
```bash
cd auth-service
npm install @nestjs/microservices
# Repeat for user-service, product-service, order-service
```

**For auth-service specifically:**
```bash
cd auth-service
npm install bcrypt @nestjs/jwt
npm install -D @types/bcrypt
```

**For gateway:**
```bash
cd gateway
npm install @nestjs/microservices
```

---

## Auth Service (Port 4001)

### `auth-service/src/main.ts`
```typescript
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 4001,
      },
    },
  );
  await app.listen();
  console.log('Auth Service is listening on port 4001');
}
bootstrap();
```

### `auth-service/src/app.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'SECRET_KEY_CHANGE_IN_PRODUCTION',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### `auth-service/src/app.controller.ts`
```typescript
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('register')
  async register(data: { email: string; password: string }) {
    return this.appService.register(data.email, data.password);
  }

  @MessagePattern('login')
  async login(data: { email: string; password: string }) {
    return this.appService.login(data.email, data.password);
  }

  @MessagePattern('verify_token')
  async verifyToken(data: { token: string }) {
    return this.appService.verifyToken(data.token);
  }
}
```

### `auth-service/src/app.service.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

interface User {
  id: number;
  email: string;
  password: string;
}

@Injectable()
export class AppService {
  private users: User[] = [];
  private currentId = 1;

  constructor(private jwtService: JwtService) {}

  async register(email: string, password: string) {
    const existingUser = this.users.find((u) => u.email === email);
    if (existingUser) {
      return { success: false, message: 'User already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user: User = {
      id: this.currentId++,
      email,
      password: hashedPassword,
    };

    this.users.push(user);

    return {
      success: true,
      message: 'User registered successfully',
      userId: user.id,
    };
  }

  async login(email: string, password: string) {
    const user = this.users.find((u) => u.email === email);
    if (!user) {
      return { success: false, message: 'Invalid credentials' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: 'Invalid credentials' };
    }

    const token = this.jwtService.sign({ userId: user.id, email: user.email });

    return {
      success: true,
      token,
      userId: user.id,
    };
  }

  async verifyToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return { success: true, userId: decoded.userId, email: decoded.email };
    } catch (error) {
      return { success: false, message: 'Invalid or expired token' };
    }
  }
}
```

---

## User Service (Port 4002)

### `user-service/src/main.ts`
```typescript
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 4002,
      },
    },
  );
  await app.listen();
  console.log('User Service is listening on port 4002');
}
bootstrap();
```

### `user-service/src/app.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### `user-service/src/app.controller.ts`
```typescript
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('get_user')
  getUser(data: { userId: number }): any {
    return this.appService.getUserById(data.userId);
  }
}
```

### `user-service/src/app.service.ts`
```typescript
import { Injectable } from '@nestjs/common';

interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class AppService {
  private users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
  ];

  getUserById(userId: number) {
    const user = this.users.find((u) => u.id === userId);
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    return { success: true, user };
  }
}
```

---

## Product Service (Port 4003)

### `product-service/src/main.ts`
```typescript
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 4003,
      },
    },
  );
  await app.listen();
  console.log('Product Service is listening on port 4003');
}
bootstrap();
```

### `product-service/src/app.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### `product-service/src/app.controller.ts`
```typescript
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('get_product')
  getProduct(data: { productId: number }): any {
    return this.appService.getProductById(data.productId);
  }
}
```

### `product-service/src/app.service.ts`
```typescript
import { Injectable } from '@nestjs/common';

interface Product {
  id: number;
  name: string;
  price: number;
}

@Injectable()
export class AppService {
  private products: Product[] = [
    { id: 1, name: 'Laptop', price: 999.99 },
    { id: 2, name: 'Mouse', price: 29.99 },
    { id: 3, name: 'Keyboard', price: 79.99 },
    { id: 4, name: 'Monitor', price: 299.99 },
  ];

  getProductById(productId: number) {
    const product = this.products.find((p) => p.id === productId);
    if (!product) {
      return { success: false, message: 'Product not found' };
    }
    return { success: true, product };
  }
}
```

---

## Order Service (Port 4004)

### `order-service/src/main.ts`
```typescript
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 4004,
      },
    },
  );
  await app.listen();
  console.log('Order Service is listening on port 4004');
}
bootstrap();
```

### `order-service/src/app.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 4001,
        },
      },
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 4003,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### `order-service/src/app.controller.ts`
```typescript
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('create_order')
  createOrder(data: { token: string; userId: number; productId: number }) {
    return this.appService.createOrder(data.token, data.userId, data.productId);
  }
}
```

### `order-service/src/app.service.ts`
```typescript
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

interface Order {
  id: number;
  userId: number;
  productId: number;
  total: number;
  createdAt: Date;
}

@Injectable()
export class AppService {
  private orders: Order[] = [];
  private currentId = 1;

  constructor(
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    @Inject('PRODUCT_SERVICE') private productClient: ClientProxy,
  ) {}

  createOrder(
    token: string,
    userId: number,
    productId: number,
  ): Observable<any> {
    return this.authClient.send('verify_token', { token }).pipe(
      switchMap((authResponse: any) => {
        if (!authResponse.success) {
          return throwError(() => new Error('Unauthorized'));
        }

        return this.productClient.send('get_product', { productId }).pipe(
          map((productResponse: any) => {
            if (!productResponse.success) {
              throw new Error('Product not found');
            }

            const order: Order = {
              id: this.currentId++,
              userId,
              productId,
              total: productResponse.product.price,
              createdAt: new Date(),
            };

            this.orders.push(order);

            return {
              success: true,
              message: 'Order created successfully',
              order,
            };
          }),
        );
      }),
      catchError((error) => {
        return throwError(() => ({
          success: false,
          message: error.message || 'Failed to create order',
        }));
      }),
    );
  }
}
```

---

## API Gateway (Port 3000)

### `gateway/src/main.ts`
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  console.log('API Gateway is running on http://localhost:3000');
}
bootstrap();
```

### `gateway/src/app.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 4001,
        },
      },
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 4002,
        },
      },
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 4003,
        },
      },
      {
        name: 'ORDER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 4004,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### `gateway/src/app.controller.ts`
```typescript
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string }) {
    return this.appService.register(body.email, body.password);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.appService.login(body.email, body.password);
  }

  @Post('order')
  async createOrder(
    @Body() body: { token: string; userId: number; productId: number },
  ) {
    return this.appService.createOrder(body.token, body.userId, body.productId);
  }

  @Get('user/:id')
  async getUser(@Param('id') id: string) {
    return this.appService.getUser(parseInt(id));
  }

  @Get('product/:id')
  async getProduct(@Param('id') id: string) {
    return this.appService.getProduct(parseInt(id));
  }
}
```

### `gateway/src/app.service.ts`
```typescript
import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    @Inject('USER_SERVICE') private userClient: ClientProxy,
    @Inject('PRODUCT_SERVICE') private productClient: ClientProxy,
    @Inject('ORDER_SERVICE') private orderClient: ClientProxy,
  ) {}

  async register(email: string, password: string): Promise<any><any> {
    return lastValueFrom(
      this.authClient.send('register', { email, password }),
    );
  }

  async login(email: string, password: string): Promise<any><any> {
    return lastValueFrom(this.authClient.send('login', { email, password }));
  }

  async createOrder(token: string, userId: number, productId: number): Promise<any><any> {
    return lastValueFrom(
      this.orderClient.send('create_order', { token, userId, productId }),
    );
  }

  async getUser(userId: number): Promise<any><any> {
    return lastValueFrom(this.userClient.send('get_user', { userId }));
  }

  async getProduct(productId: number): Promise<any><any> {
    return lastValueFrom(
      this.productClient.send('get_product', { productId }),
    );
  }
}
```

---

## Running All Services

### Option 1: Multiple Terminals
Open 5 separate terminals and run:

```bash
# Terminal 1 - Auth Service
cd auth-service
npm run start

# Terminal 2 - User Service
cd user-service
npm run start

# Terminal 3 - Product Service
cd product-service
npm run start

# Terminal 4 - Order Service
cd order-service
npm run start

# Terminal 5 - Gateway
cd gateway
npm run start
```

### Option 2: Using tmux
```bash
tmux new-session -d -s microservices
tmux send-keys -t microservices 'cd auth-service && npm run start' C-m
tmux split-window -t microservices
tmux send-keys -t microservices 'cd user-service && npm run start' C-m
tmux split-window -t microservices
tmux send-keys -t microservices 'cd product-service && npm run start' C-m
tmux split-window -t microservices
tmux send-keys -t microservices 'cd order-service && npm run start' C-m
tmux split-window -t microservices
tmux send-keys -t microservices 'cd gateway && npm run start' C-m
tmux attach -t microservices
```

### Option 3: Using concurrently (Recommended)
Create a `package.json` in the root directory:

```json
{
  "name": "microservices-project",
  "scripts": {
    "start:all": "concurrently \"npm run start:auth\" \"npm run start:user\" \"npm run start:product\" \"npm run start:order\" \"npm run start:gateway\"",
    "start:auth": "cd auth-service && npm run start",
    "start:user": "cd user-service && npm run start",
    "start:product": "cd product-service && npm run start",
    "start:order": "cd order-service && npm run start",
    "start:gateway": "cd gateway && npm run start"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

Install and run:
```bash
npm install
npm run start:all
```

---

## Testing the API

### 1. Register a user
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Response will include a token like:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1
}
```

### 3. Create an order (use the token from login)
```bash
curl -X POST http://localhost:3000/order \
  -H "Content-Type: application/json" \
  -d '{
    "token":"YOUR_TOKEN_HERE",
    "userId":1,
    "productId":1
  }'
```

### 4. Get user by ID
```bash
curl http://localhost:3000/user/1
```

### 5. Get product by ID
```bash
curl http://localhost:3000/product/1
```

---

## Architecture Overview

```
┌─────────────┐
│   Gateway   │ :3000 (REST API)
└──────┬──────┘
       │
       ├─────────────┬─────────────┬─────────────┐
       │             │             │             │
   ┌───▼───┐    ┌───▼───┐    ┌───▼────┐   ┌────▼────┐
   │ Auth  │    │ User  │    │Product │   │  Order  │
   │ :4001 │    │ :4002 │    │ :4003  │   │  :4004  │
   └───────┘    └───────┘    └────────┘   └────┬────┘
                                                │
                                        ┌───────┴───────┐
                                        │               │
                                    ┌───▼───┐      ┌───▼────┐
                                    │ Auth  │      │Product │
                                    │ :4001 │      │ :4003  │
                                    └───────┘      └────────┘
```

The Order Service uses RxJS operators to chain calls to Auth Service (for token verification) and Product Service (for product details) before creating the order.