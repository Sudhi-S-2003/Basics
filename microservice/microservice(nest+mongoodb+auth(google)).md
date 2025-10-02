# NestJS Microservices v2 - MongoDB + Advanced Authentication

## Project Structure
```
microservices-v2/
├── auth-service/      # Port 4001 - MongoDB: mongodb://localhost:27017/auth_db
├── user-service/      # Port 4002 - MongoDB: mongodb://localhost:27017/user_db
├── product-service/   # Port 4003 - MongoDB: mongodb://localhost:27017/product_db
├── order-service/     # Port 4004 - MongoDB: mongodb://localhost:27017/order_db
└── gateway/          # Port 3000 - REST API
```

## Prerequisites

1. **Install MongoDB**
   - Download from: https://www.mongodb.com/try/download/community
   - Start MongoDB service:
     ```bash
     # Windows
     net start MongoDB
     
     # Linux/Mac
     sudo systemctl start mongod
     ```

2. **Create project structure**
   ```bash
   mkdir microservices-v2 && cd microservices-v2
   nest new auth-service
   nest new user-service
   nest new product-service
   nest new order-service
   nest new gateway
   ```

---

## 1. AUTH SERVICE (Port 4001)

### Install Dependencies
```bash
cd auth-service
npm install @nestjs/microservices @nestjs/mongoose mongoose @nestjs/passport @nestjs/jwt passport passport-local passport-jwt passport-google-oauth20 bcrypt class-validator class-transformer
npm install -D @types/bcrypt @types/passport-local @types/passport-jwt @types/passport-google-oauth20
```

### `auth-service/src/main.ts`
```typescript
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
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
  
  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
  console.log('🔐 Auth Service is listening on port 4001');
}
bootstrap();
```

### `auth-service/src/app.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User, UserSchema } from './schemas/user.schema';
import { Session, SessionSchema } from './schemas/session.schema';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/auth_db'),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SECRET_KEY_CHANGE_IN_PRODUCTION',
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy, LocalStrategy, GoogleStrategy],
})
export class AppModule {}
```

### `auth-service/src/schemas/user.schema.ts`
```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: Object })
  name: {
    first: string;
    last: string;
  };

  @Prop({ type: Object, unique: true, sparse: true })
  email?: {
    value: string;
    verified: boolean;
  };

  @Prop({ type: Object, unique: true, sparse: true })
  phone?: {
    number: string;
    verified: boolean;
  };

  @Prop()
  password?: string;

  @Prop({ type: String, enum: ['user', 'admin', 'guest'], default: 'user' })
  role: string;

  @Prop({ type: Object })
  google?: {
    id: string;
    email: string;
    picture: string;
  };

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Date })
  lastLogin?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
```

### `auth-service/src/schemas/session.schema.ts`
```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema({ timestamps: true })
export class Session {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  token: string;

  @Prop({ type: Object })
  device?: {
    userAgent: string;
    ip: string;
  };

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  @Prop({ default: true })
  isValid: boolean;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
```

### `auth-service/src/strategies/local.strategy.ts`
```typescript
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AppService } from '../app.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private appService: AppService) {
    super({
      usernameField: 'identifier', // email or phone
      passwordField: 'password',
    });
  }

  async validate(identifier: string, password: string): Promise<any> {
    const user = await this.appService.validateUserCredentials(identifier, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
```

### `auth-service/src/strategies/jwt.strategy.ts`
```typescript
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'SECRET_KEY_CHANGE_IN_PRODUCTION',
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
    };
  }
}
```

### `auth-service/src/strategies/google.strategy.ts`
```typescript
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
      callbackURL: 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;
    const user = {
      googleId: id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
    };
    done(null, user);
  }
}
```

### `auth-service/src/app.controller.ts`
```typescript
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('auth.register.email')
  async registerWithEmail(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    return this.appService.registerWithEmail(data);
  }

  @MessagePattern('auth.register.phone')
  async registerWithPhone(data: {
    phone: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    return this.appService.registerWithPhone(data);
  }

  @MessagePattern('auth.register.google')
  async registerWithGoogle(data: {
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
  }) {
    return this.appService.registerWithGoogle(data);
  }

  @MessagePattern('auth.login.email')
  async loginWithEmail(data: { email: string; password: string }) {
    return this.appService.loginWithEmail(data.email, data.password);
  }

  @MessagePattern('auth.login.phone')
  async loginWithPhone(data: { phone: string; password: string }) {
    return this.appService.loginWithPhone(data.phone, data.password);
  }

  @MessagePattern('auth.verify_token')
  async verifyToken(data: { token: string }) {
    return this.appService.verifyToken(data.token);
  }

  @MessagePattern('auth.refresh_token')
  async refreshToken(data: { token: string }) {
    return this.appService.refreshToken(data.token);
  }

  @MessagePattern('auth.logout')
  async logout(data: { token: string }) {
    return this.appService.logout(data.token);
  }

  @MessagePattern('auth.get_user_by_id')
  async getUserById(data: { userId: string }) {
    return this.appService.getUserById(data.userId);
  }

  @MessagePattern('auth.get_user_by_email')
  async getUserByEmail(data: { email: string }) {
    return this.appService.getUserByEmail(data.email);
  }

  @MessagePattern('auth.get_user_by_phone')
  async getUserByPhone(data: { phone: string }) {
    return this.appService.getUserByPhone(data.phone);
  }
}
```

### `auth-service/src/app.service.ts`
```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { Session, SessionDocument } from './schemas/session.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    private jwtService: JwtService,
  ) {}

  async registerWithEmail(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    try {
      const existingUser = await this.userModel.findOne({
        'email.value': data.email,
      });

      if (existingUser) {
        return { success: false, message: 'Email already registered' };
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await this.userModel.create({
        name: { first: data.firstName, last: data.lastName },
        email: { value: data.email, verified: false },
        password: hashedPassword,
        role: 'user',
      });

      const token = await this.createSession(user);

      return {
        success: true,
        message: 'User registered successfully',
        token,
        user: this.sanitizeUser(user),
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async registerWithPhone(data: {
    phone: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    try {
      const existingUser = await this.userModel.findOne({
        'phone.number': data.phone,
      });

      if (existingUser) {
        return { success: false, message: 'Phone already registered' };
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await this.userModel.create({
        name: { first: data.firstName, last: data.lastName },
        phone: { number: data.phone, verified: false },
        password: hashedPassword,
        role: 'user',
      });

      const token = await this.createSession(user);

      return {
        success: true,
        message: 'User registered successfully',
        token,
        user: this.sanitizeUser(user),
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async registerWithGoogle(data: {
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
  }) {
    try {
      let user = await this.userModel.findOne({ 'google.id': data.googleId });

      if (!user) {
        user = await this.userModel.create({
          name: { first: data.firstName, last: data.lastName },
          email: { value: data.email, verified: true },
          google: {
            id: data.googleId,
            email: data.email,
            picture: data.picture,
          },
          role: 'user',
        });
      }

      const token = await this.createSession(user);

      return {
        success: true,
        message: 'Google authentication successful',
        token,
        user: this.sanitizeUser(user),
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async loginWithEmail(email: string, password: string) {
    try {
      const user = await this.userModel.findOne({ 'email.value': email });

      if (!user || !user.password) {
        return { success: false, message: 'Invalid credentials' };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return { success: false, message: 'Invalid credentials' };
      }

      user.lastLogin = new Date();
      await user.save();

      const token = await this.createSession(user);

      return {
        success: true,
        token,
        user: this.sanitizeUser(user),
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async loginWithPhone(phone: string, password: string) {
    try {
      const user = await this.userModel.findOne({ 'phone.number': phone });

      if (!user || !user.password) {
        return { success: false, message: 'Invalid credentials' };
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return { success: false, message: 'Invalid credentials' };
      }

      user.lastLogin = new Date();
      await user.save();

      const token = await this.createSession(user);

      return {
        success: true,
        token,
        user: this.sanitizeUser(user),
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async verifyToken(token: string) {
    try {
      const session = await this.sessionModel.findOne({ token, isValid: true });

      if (!session || session.expiresAt < new Date()) {
        return { success: false, message: 'Invalid or expired token' };
      }

      const decoded = this.jwtService.verify(token);
      const user = await this.userModel.findById(decoded.sub);

      if (!user || !user.isActive) {
        return { success: false, message: 'User not found or inactive' };
      }

      return {
        success: true,
        user: this.sanitizeUser(user),
      };
    } catch (error) {
      return { success: false, message: 'Invalid token' };
    }
  }

  async refreshToken(oldToken: string) {
    try {
      const decoded = this.jwtService.verify(oldToken);
      const user = await this.userModel.findById(decoded.sub);

      if (!user) {
        return { success: false, message: 'User not found' };
      }

      // Invalidate old session
      await this.sessionModel.updateOne(
        { token: oldToken },
        { isValid: false },
      );

      // Create new session
      const newToken = await this.createSession(user);

      return {
        success: true,
        token: newToken,
      };
    } catch (error) {
      return { success: false, message: 'Invalid token' };
    }
  }

  async logout(token: string) {
    try {
      await this.sessionModel.updateOne({ token }, { isValid: false });
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getUserById(userId: string) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        return { success: false, message: 'User not found' };
      }
      return { success: true, user: this.sanitizeUser(user) };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getUserByEmail(email: string) {
    try {
      const user = await this.userModel.findOne({ 'email.value': email });
      if (!user) {
        return { success: false, message: 'User not found' };
      }
      return { success: true, user: this.sanitizeUser(user) };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getUserByPhone(phone: string) {
    try {
      const user = await this.userModel.findOne({ 'phone.number': phone });
      if (!user) {
        return { success: false, message: 'User not found' };
      }
      return { success: true, user: this.sanitizeUser(user) };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async validateUserCredentials(identifier: string, password: string) {
    const user = await this.userModel.findOne({
      $or: [{ 'email.value': identifier }, { 'phone.number': identifier }],
    });

    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    return isPasswordValid ? this.sanitizeUser(user) : null;
  }

  private async createSession(user: UserDocument) {
    const payload = {
      sub: user._id.toString(),
      email: user.email?.value,
      phone: user.phone?.number,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    await this.sessionModel.create({
      userId: user._id,
      token,
      expiresAt,
      isValid: true,
    });

    return token;
  }

  private sanitizeUser(user: UserDocument) {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email?.value,
      phone: user.phone?.number,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
    };
  }
}
```

---

## 2. USER SERVICE (Port 4002)

### Install Dependencies
```bash
cd user-service
npm install @nestjs/microservices @nestjs/mongoose mongoose class-validator class-transformer
```

### `user-service/src/main.ts`
```typescript
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
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
  
  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
  console.log('👤 User Service is listening on port 4002');
}
bootstrap();
```

### `user-service/src/app.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserProfile, UserProfileSchema } from './schemas/user-profile.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/user_db'),
    MongooseModule.forFeature([
      { name: UserProfile.name, schema: UserProfileSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### `user-service/src/schemas/user-profile.schema.ts`
```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserProfileDocument = UserProfile & Document;

@Schema({ timestamps: true })
export class UserProfile {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop()
  bio?: string;

  @Prop()
  avatar?: string;

  @Prop({ type: Object })
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };

  @Prop({ type: Object })
  preferences?: {
    language: string;
    timezone: string;
    notifications: boolean;
  };

  @Prop({ type: [String], default: [] })
  interests: string[];
}

export const UserProfileSchema = SchemaFactory.createForClass(UserProfile);
```

### `user-service/src/app.controller.ts`
```typescript
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('user.get_profile')
  async getUserProfile(data: { userId: string }) {
    return this.appService.getUserProfile(data.userId);
  }

  @MessagePattern('user.create_profile')
  async createProfile(data: any) {
    return this.appService.createProfile(data);
  }

  @MessagePattern('user.update_profile')
  async updateProfile(data: { userId: string; updates: any }) {
    return this.appService.updateProfile(data.userId, data.updates);
  }

  @MessagePattern('user.delete_profile')
  async deleteProfile(data: { userId: string }) {
    return this.appService.deleteProfile(data.userId);
  }
}
```

### `user-service/src/app.service.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserProfile, UserProfileDocument } from './schemas/user-profile.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(UserProfile.name)
    private userProfileModel: Model<UserProfileDocument>,
  ) {}

  async getUserProfile(userId: string) {
    try {
      const profile = await this.userProfileModel.findOne({ userId });
      if (!profile) {
        return { success: false, message: 'Profile not found' };
      }
      return { success: true, profile };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async createProfile(data: any) {
    try {
      const existingProfile = await this.userProfileModel.findOne({
        userId: data.userId,
      });

      if (existingProfile) {
        return { success: false, message: 'Profile already exists' };
      }

      const profile = await this.userProfileModel.create(data);
      return { success: true, profile };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async updateProfile(userId: string, updates: any) {
    try {
      const profile = await this.userProfileModel.findOneAndUpdate(
        { userId },
        { $set: updates },
        { new: true },
      );

      if (!profile) {
        return { success: false, message: 'Profile not found' };
      }

      return { success: true, profile };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async deleteProfile(userId: string) {
    try {
      const result = await this.userProfileModel.deleteOne({ userId });
      if (result.deletedCount === 0) {
        return { success: false, message: 'Profile not found' };
      }
      return { success: true, message: 'Profile deleted successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
```

---

## 3. PRODUCT SERVICE (Port 4003)

### Install Dependencies
```bash
cd product-service
npm install @nestjs/microservices @nestjs/mongoose mongoose class-validator class-transformer
```

### `product-service/src/main.ts`
```typescript
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
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
  
  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
  console.log('🛍️  Product Service is listening on port 4003');
}
bootstrap();
```

### `product-service/src/app.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Product, ProductSchema } from './schemas/product.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/product_db'),
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### `product-service/src/schemas/product.schema.ts`
```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  description?: string;

  @Prop({ required: true, default: 0 })
  stock: number;

  @Prop()
  category?: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: true })
  isAvailable: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
```

### `product-service/src/app.controller.ts`
```typescript
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('product.get_by_id')
  async getProduct(data: { productId: string }) {
    return this.appService.getProductById(data.productId);
  }

  @MessagePattern('product.get_all')
  async getAllProducts(data: { page?: number; limit?: number }) {
    return this.appService.getAllProducts(data.page, data.limit);
  }

  @MessagePattern('product.create')
  async createProduct(data: any) {
    return this.appService.createProduct(data);
  }

  @MessagePattern('product.update')
  async updateProduct(data: { productId: string; updates: any }) {
    return this.appService.updateProduct(data.productId, data.updates);
  }

  @MessagePattern('product.delete')
  async deleteProduct(data: { productId: string }) {
    return this.appService.deleteProduct(data.productId);
  }

  @MessagePattern('product.check_stock')
  async checkStock(data: { productId: string; quantity: number }) {
    return this.appService.checkStock(data.productId, data.quantity);
  }
}
```

### `product-service/src/app.service.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {
    this.seedProducts();
  }

  async seedProducts() {
    const count = await this.productModel.countDocuments();
    if (count === 0) {
      await this.productModel.insertMany([
        {
          name: 'Laptop Pro',
          price: 1299.99,
          description: 'High-performance laptop',
          stock: 50,
          category: 'Electronics',
          isAvailable: true,
        },
        {
          name: 'Wireless Mouse',
          price: 29.99,
          description: 'Ergonomic wireless mouse',
          stock: 200,
          category: 'Accessories',
          isAvailable: true,
        },
        {
          name: 'Mechanical Keyboard',
          price: 89.99,
          description: 'RGB mechanical keyboard',
          stock: 100,
          category: 'Accessories',
          isAvailable: true,
        },
        {
          name: '4K Monitor',
          price: 399.99,
          description: '27-inch 4K display',
          stock: 75,
          category: 'Electronics',
          isAvailable: true,
        },
      ]);
      console.log('✅ Products seeded successfully');
    }
  }

  async getProductById(productId: string) {
    try {
      const product = await this.productModel.findById(productId);
      if (!product) {
        return { success: false, message: 'Product not found' };
      }
      return { success: true, product };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getAllProducts(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const products = await this.productModel
        .find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
      
      const total = await this.productModel.countDocuments();

      return {
        success: true,
        products,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async createProduct(data: any) {
    try {
      const product = await this.productModel.create(data);
      return { success: true, product };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async updateProduct(productId: string, updates: any) {
    try {
      const product = await this.productModel.findByIdAndUpdate(
        productId,
        { $set: updates },
        { new: true },
      );

      if (!product) {
        return { success: false, message: 'Product not found' };
      }

      return { success: true, product };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async deleteProduct(productId: string) {
    try {
      const result = await this.productModel.deleteOne({ _id: productId });
      if (result.deletedCount === 0) {
        return { success: false, message: 'Product not found' };
      }
      return { success: true, message: 'Product deleted successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async checkStock(productId: string, quantity: number) {
    try {
      const product = await this.productModel.findById(productId);
      if (!product) {
        return { success: false, message: 'Product not found' };
      }

      if (!product.isAvailable) {
        return { success: false, message: 'Product is not available' };
      }

      if (product.stock < quantity) {
        return {
          success: false,
          message: 'Insufficient stock',
          available: product.stock,
        };
      }

      return { success: true, available: true, stock: product.stock };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async decreaseStock(productId: string, quantity: number) {
    try {
      const product = await this.productModel.findByIdAndUpdate(
        productId,
        { $inc: { stock: -quantity } },
        { new: true },
      );

      if (!product) {
        return { success: false, message: 'Product not found' };
      }

      return { success: true, product };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
```

---

## 4. ORDER SERVICE (Port 4004)

### Install Dependencies
```bash
cd order-service
npm install @nestjs/microservices @nestjs/mongoose mongoose class-validator class-transformer rxjs
```

### `order-service/src/main.ts`
```typescript
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
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
  
  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
  console.log('📦 Order Service is listening on port 4004');
}
bootstrap();
```

### `order-service/src/app.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Order, OrderSchema } from './schemas/order.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/order_db'),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 4001 },
      },
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 4003 },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### `order-service/src/schemas/order.schema.ts`
```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  })
  status: string;

  @Prop({ type: Object })
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };

  @Prop({ type: Object })
  productSnapshot: {
    name: string;
    price: number;
    description?: string;
  };
}

export const OrderSchema = SchemaFactory.createForClass(Order);
```

### `order-service/src/app.controller.ts`
```typescript
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('order.create')
  createOrder(data: {
    token: string;
    productId: string;
    quantity: number;
    shippingAddress?: any;
  }) {
    return this.appService.createOrder(data);
  }

  @MessagePattern('order.get_by_id')
  getOrder(data: { orderId: string }) {
    return this.appService.getOrderById(data.orderId);
  }

  @MessagePattern('order.get_user_orders')
  getUserOrders(data: { userId: string; page?: number; limit?: number }) {
    return this.appService.getUserOrders(data.userId, data.page, data.limit);
  }

  @MessagePattern('order.update_status')
  updateOrderStatus(data: { orderId: string; status: string }) {
    return this.appService.updateOrderStatus(data.orderId, data.status);
  }

  @MessagePattern('order.cancel')
  cancelOrder(data: { orderId: string }) {
    return this.appService.cancelOrder(data.orderId);
  }
}
```

### `order-service/src/app.service.ts`
```typescript
import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { Model } from 'mongoose';
import { Observable, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Order, OrderDocument } from './schemas/order.schema';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    @Inject('PRODUCT_SERVICE') private productClient: ClientProxy,
  ) {}

  async onModuleInit() {
    await Promise.all([
      this.authClient.connect(),
      this.productClient.connect(),
    ]);
    console.log('✅ Order Service: Connected to Auth and Product services');
  }

  createOrder(data: {
    token: string;
    productId: string;
    quantity: number;
    shippingAddress?: any;
  }): Observable<any> {
    // Step 1: Verify authentication token
    return this.authClient.send('auth.verify_token', { token: data.token }).pipe(
      switchMap((authResponse: any) => {
        if (!authResponse.success) {
          return throwError(() => new Error('Unauthorized: Invalid token'));
        }

        const userId = authResponse.user.id;

        // Step 2: Check product availability and stock
        return this.productClient
          .send('product.check_stock', {
            productId: data.productId,
            quantity: data.quantity,
          })
          .pipe(
            switchMap((stockResponse: any) => {
              if (!stockResponse.success) {
                return throwError(() => new Error(stockResponse.message));
              }

              // Step 3: Get full product details
              return this.productClient
                .send('product.get_by_id', { productId: data.productId })
                .pipe(
                  map((productResponse: any) => {
                    if (!productResponse.success) {
                      throw new Error('Product not found');
                    }

                    return {
                      userId,
                      product: productResponse.product,
                    };
                  }),
                );
            }),
          );
      }),
      switchMap(async ({ userId, product }) => {
        // Step 4: Create order in database
        const totalAmount = product.price * data.quantity;

        const order = await this.orderModel.create({
          userId,
          productId: data.productId,
          quantity: data.quantity,
          totalAmount,
          status: 'pending',
          shippingAddress: data.shippingAddress,
          productSnapshot: {
            name: product.name,
            price: product.price,
            description: product.description,
          },
        });

        return {
          success: true,
          message: 'Order created successfully',
          order: {
            id: order._id.toString(),
            userId: order.userId,
            productId: order.productId,
            quantity: order.quantity,
            totalAmount: order.totalAmount,
            status: order.status,
            createdAt: order.createdAt,
          },
        };
      }),
      catchError((error) => {
        console.error('[createOrder] Error:', error.message);
        return throwError(() => ({
          success: false,
          message: error.message || 'Failed to create order',
        }));
      }),
    );
  }

  async getOrderById(orderId: string) {
    try {
      const order = await this.orderModel.findById(orderId);
      if (!order) {
        return { success: false, message: 'Order not found' };
      }
      return { success: true, order };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async getUserOrders(userId: string, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const orders = await this.orderModel
        .find({ userId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await this.orderModel.countDocuments({ userId });

      return {
        success: true,
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async updateOrderStatus(orderId: string, status: string) {
    try {
      const order = await this.orderModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true },
      );

      if (!order) {
        return { success: false, message: 'Order not found' };
      }

      return { success: true, order };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async cancelOrder(orderId: string) {
    try {
      const order = await this.orderModel.findById(orderId);

      if (!order) {
        return { success: false, message: 'Order not found' };
      }

      if (order.status === 'delivered' || order.status === 'cancelled') {
        return {
          success: false,
          message: 'Order cannot be cancelled',
        };
      }

      order.status = 'cancelled';
      await order.save();

      return { success: true, message: 'Order cancelled successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
```

---

## 5. API GATEWAY (Port 3000)

### Install Dependencies
```bash
cd gateway
npm install @nestjs/microservices @nestjs/passport passport passport-jwt @nestjs/jwt class-validator class-transformer
npm install -D @types/passport-jwt
```

### `gateway/src/main.ts`
```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api/v1');
  
  await app.listen(3000);
  console.log('🚀 API Gateway is running on http://localhost:3000');
}
bootstrap();
```

### `gateway/src/app.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { ProductController } from './controllers/product.controller';
import { OrderController } from './controllers/order.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 4001 },
      },
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 4002 },
      },
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 4003 },
      },
      {
        name: 'ORDER_SERVICE',
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 4004 },
      },
    ]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SECRET_KEY_CHANGE_IN_PRODUCTION',
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    UserController,
    ProductController,
    OrderController,
  ],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
```

### `gateway/src/strategies/jwt.strategy.ts`
```typescript
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'SECRET_KEY_CHANGE_IN_PRODUCTION',
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
    };
  }
}
```

### `gateway/src/guards/jwt-auth.guard.ts`
```typescript
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
```

### `gateway/src/controllers/auth.controller.ts`
```typescript
import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AppService } from '../app.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly appService: AppService) {}

  @Post('register/email')
  async registerEmail(@Body() body: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    return this.appService.registerWithEmail(body);
  }

  @Post('register/phone')
  async registerPhone(@Body() body: {
    phone: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    return this.appService.registerWithPhone(body);
  }

  @Post('register/google')
  async registerGoogle(@Body() body: {
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
  }) {
    return this.appService.registerWithGoogle(body);
  }

  @Post('login/email')
  async loginEmail(@Body() body: { email: string; password: string }) {
    return this.appService.loginWithEmail(body);
  }

  @Post('login/phone')
  async loginPhone(@Body() body: { phone: string; password: string }) {
    return this.appService.loginWithPhone(body);
  }

  @Post('refresh')
  async refreshToken(@Body() body: { token: string }) {
    return this.appService.refreshToken(body.token);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req) {
    const token = req.headers.authorization?.split(' ')[1];
    return this.appService.logout(token);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return { success: true, user: req.user };
  }
}
```

### `gateway/src/controllers/user.controller.ts`
```typescript
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AppService } from '../app.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly appService: AppService) {}

  @Get('profile')
  async getMyProfile(@Request() req) {
    return this.appService.getUserProfile(req.user.userId);
  }

  @Post('profile')
  async createProfile(@Request() req, @Body() body: any) {
    return this.appService.createUserProfile({
      userId: req.user.userId,
      ...body,
    });
  }

  @Put('profile')
  async updateProfile(@Request() req, @Body() body: any) {
    return this.appService.updateUserProfile(req.user.userId, body);
  }

  @Delete('profile')
  async deleteProfile(@Request() req) {
    return this.appService.deleteUserProfile(req.user.userId);
  }
}
```

### `gateway/src/controllers/product.controller.ts`
```typescript
import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AppService } from '../app.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('products')
export class ProductController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getAllProducts(@Query('page') page: number, @Query('limit') limit: number) {
    return this.appService.getAllProducts(page, limit);
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return this.appService.getProduct(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createProduct(@Body() body: any) {
    return this.appService.createProduct(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateProduct(@Param('id') id: string, @Body() body: any) {
    return this.appService.updateProduct(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteProduct(@Param('id') id: string) {
    return this.appService.deleteProduct(id);
  }
}
```

### `gateway/src/controllers/order.controller.ts`
```typescript
import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request, Headers } from '@nestjs/common';
import { AppService } from '../app.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async createOrder(
    @Headers('authorization') auth: string,
    @Body() body: {
      productId: string;
      quantity: number;
      shippingAddress?: any;
    },
  ) {
    const token = auth?.split(' ')[1];
    return this.appService.createOrder({
      token,
      productId: body.productId,
      quantity: body.quantity,
      shippingAddress: body.shippingAddress,
    });
  }

  @Get()
  async getMyOrders(
    @Request() req,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.appService.getUserOrders(req.user.userId, page, limit);
  }

  @Get(':id')
  async getOrder(@Param('id') id: string) {
    return this.appService.getOrder(id);
  }

  @Put(':id/status')
  async updateOrderStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.appService.updateOrderStatus(id, body.status);
  }

  @Put(':id/cancel')
  async cancelOrder(@Param('id') id: string) {
    return this.appService.cancelOrder(id);
  }
}
```

### `gateway/src/app.service.ts`
```typescript
import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    @Inject('USER_SERVICE') private userClient: ClientProxy,
    @Inject('PRODUCT_SERVICE') private productClient: ClientProxy,
    @Inject('ORDER_SERVICE') private orderClient: ClientProxy,
  ) {}

  async onModuleInit() {
    await Promise.all([
      this.authClient.connect(),
      this.userClient.connect(),
      this.productClient.connect(),
      this.orderClient.connect(),
    ]);
    console.log('✅ Gateway: All microservice connections established');
  }

  // Auth methods
  async registerWithEmail(data: any): Promise<any> {
    return lastValueFrom(this.authClient.send('auth.register.email', data));
  }

  async registerWithPhone(data: any): Promise<any> {
    return lastValueFrom(this.authClient.send('auth.register.phone', data));
  }

  async registerWithGoogle(data: any): Promise<any> {
    return lastValueFrom(this.authClient.send('auth.register.google', data));
  }

  async loginWithEmail(data: any): Promise<any> {
    return lastValueFrom(this.authClient.send('auth.login.email', data));
  }

  async loginWithPhone(data: any): Promise<any> {
    return lastValueFrom(this.authClient.send('auth.login.phone', data));
  }

  async refreshToken(token: string): Promise<any> {
    return lastValueFrom(this.authClient.send('auth.refresh_token', { token }));
  }

  async logout(token: string): Promise<any> {
    return lastValueFrom(this.authClient.send('auth.logout', { token }));
  }

  // User methods
  async getUserProfile(userId: string): Promise<any> {
    return lastValueFrom(this.userClient.send('user.get_profile', { userId }));
  }

  async createUserProfile(data: any): Promise<any> {
    return lastValueFrom(this.userClient.send('user.create_profile', data));
  }

  async updateUserProfile(userId: string, updates: any): Promise<any> {
    return lastValueFrom(
      this.userClient.send('user.update_profile', { userId, updates }),
    );
  }

  async deleteUserProfile(userId: string): Promise<any> {
    return lastValueFrom(this.userClient.send('user.delete_profile', { userId }));
  }

  // Product methods
  async getAllProducts(page?: number, limit?: number): Promise<any> {
    return lastValueFrom(
      this.productClient.send('product.get_all', { page, limit }),
    );
  }

  async getProduct(productId: string): Promise<any> {
    return lastValueFrom(
      this.productClient.send('product.get_by_id', { productId }),
    );
  }

  async createProduct(data: any): Promise<any> {
    return lastValueFrom(this.productClient.send('product.create', data));
  }

  async updateProduct(productId: string, updates: any): Promise<any> {
    return lastValueFrom(
      this.productClient.send('product.update', { productId, updates }),
    );
  }

  async deleteProduct(productId: string): Promise<any> {
    return lastValueFrom(
      this.productClient.send('product.delete', { productId }),
    );
  }

  // Order methods
  async createOrder(data: any): Promise<any> {
    return lastValueFrom(this.orderClient.send('order.create', data));
  }

  async getUserOrders(userId: string, page?: number, limit?: number): Promise<any> {
    return lastValueFrom(
      this.orderClient.send('order.get_user_orders', { userId, page, limit }),
    );
  }

  async getOrder(orderId: string): Promise<any> {
    return lastValueFrom(this.orderClient.send('order.get_by_id', { orderId }));
  }

  async updateOrderStatus(orderId: string, status: string): Promise<any> {
    return lastValueFrom(
      this.orderClient.send('order.update_status', { orderId, status }),
    );
  }

  async cancelOrder(orderId: string): Promise<any> {
    return lastValueFrom(this.orderClient.send('order.cancel', { orderId }));
  }
}
```

### `gateway/src/app.controller.ts`
```typescript
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHealth() {
    return {
      status: 'ok',
      message: 'API Gateway is running',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  healthCheck() {
    return {
      status: 'healthy',
      services: {
        auth: 'tcp://localhost:4001',
        user: 'tcp://localhost:4002',
        product: 'tcp://localhost:4003',
        order: 'tcp://localhost:4004',
      },
    };
  }
}
```

---

## Running All Services

### Option 1: Using Concurrently (Recommended)

Create `package.json` in root directory:

```json
{
  "name": "microservices-v2",
  "version": "1.0.0",
  "scripts": {
    "start:all": "concurrently \"npm run start:auth\" \"npm run start:user\" \"npm run start:product\" \"npm run start:order\" \"npm run start:gateway\"",
    "start:auth": "cd auth-service && npm run start",
    "start:user": "cd user-service && npm run start",
    "start:product": "cd product-service && npm run start",
    "start:order": "cd order-service && npm run start",
    "start:gateway": "cd gateway && npm run start",
    "dev:all": "concurrently \"npm run dev:auth\" \"npm run dev:user\" \"npm run dev:product\" \"npm run dev:order\" \"npm run dev:gateway\"",
    "dev:auth": "cd auth-service && npm run start:dev",
    "dev:user": "cd user-service && npm run start:dev",
    "dev:product": "cd product-service && npm run start:dev",
    "dev:order": "cd order-service && npm run start:dev",
    "dev:gateway": "cd gateway && npm run start:dev"
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

### Option 2: Individual Terminals

```bash
# Terminal 1 - Auth Service
cd auth-service
npm run start:dev

# Terminal 2 - User Service
cd user-service
npm run start:dev

# Terminal 3 - Product Service
cd product-service
npm run start:dev

# Terminal 4 - Order Service
cd order-service
npm run start:dev

# Terminal 5 - Gateway
cd gateway
npm run start:dev
```

---

## Environment Variables

Create `.env` files in each service:

### `auth-service/.env`
```env
MONGODB_URI=mongodb://localhost:27017/auth_db
JWT_SECRET=your-super-secret-jwt-key-change-this
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### `user-service/.env`
```env
MONGODB_URI=mongodb://localhost:27017/user_db
```

### `product-service/.env`
```env
MONGODB_URI=mongodb://localhost:27017/product_db
```

### `order-service/.env`
```env
MONGODB_URI=mongodb://localhost:27017/order_db
```

### `gateway/.env`
```env
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=3000
```

---

## API Testing Examples

### 1. Register with Email
```bash
curl -X POST http://localhost:3000/api/v1/auth/register/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f1234567890abcdef12345",
    "name": {
      "first": "John",
      "last": "Doe"
    },
    "email": "john@example.com",
    "role": "user"
  }
}
```

### 2. Register with Phone
```bash
curl -X POST http://localhost:3000/api/v1/auth/register/phone \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+1234567890",
    "password": "password123",
    "firstName": "Jane",
    "lastName": "Smith"
  }'
```

### 3. Login with Email
```bash
curl -X POST http://localhost:3000/api/v1/auth/login/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 4. Get Current User Profile
```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Get All Products
```bash
curl -X GET "http://localhost:3000/api/v1/products?page=1&limit=10"
```

Response:
```json
{
  "success": true,
  "products": [
    {
      "_id": "65f1234567890abcdef12345",
      "name": "Laptop Pro",
      "price": 1299.99,
      "description": "High-performance laptop",
      "stock": 50,
      "category": "Electronics",
      "isAvailable": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 4,
    "pages": 1
  }
}
```

### 6. Create User Profile
```bash
curl -X POST http://localhost:3000/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Software Developer",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "zipCode": "10001"
    },
    "preferences": {
      "language": "en",
      "timezone": "America/New_York",
      "notifications": true
    }
  }'
```

### 7. Create Order
```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "65f1234567890abcdef12345",
    "quantity": 2,
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "zipCode": "10001"
    }
  }'
```

Response:
```json
{
  "success": true,
  "message": "Order created successfully",
  "order": {
    "id": "65f9876543210fedcba98765",
    "userId": "65f1234567890abcdef12345",
    "productId": "65f1234567890abcdef12345",
    "quantity": 2,
    "totalAmount": 2599.98,
    "status": "pending",
    "createdAt": "2025-10-02T07:30:00.000Z"
  }
}
```

### 8. Get My Orders
```bash
curl -X GET "http://localhost:3000/api/v1/orders?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 9. Update Order Status (Admin)
```bash
curl -X PUT http://localhost:3000/api/v1/orders/65f9876543210fedcba98765/status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed"
  }'
```

### 10. Cancel Order
```bash
curl -X PUT http://localhost:3000/api/v1/orders/65f9876543210fedcba98765/cancel \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 11. Logout
```bash
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 12. Refresh Token
```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_OLD_TOKEN_HERE"
  }'
```

---

## Postman Collection

Import this JSON into Postman for easier testing:

```json
{
  "info": {
    "name": "NestJS Microservices v2",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:3000/api/v1"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register Email",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/auth/register/email",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\",\n  \"firstName\": \"Test\",\n  \"lastName\": \"User\"\n}"
            }
          }
        },
        {
          "name": "Login Email",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/auth/login/email",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\"\n}"
            }
          }
        },
        {
          "name": "Get Me",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/auth/me",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ]
          }
        }
      ]
    }
  ]
}
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway :3000                       │
│                        (REST API)                            │
│  Routes: /auth, /users, /products, /orders                  │
│  Authentication: JWT Guards                                  │
└─────────────┬───────────────────────────────────────────────┘
              │
      ┌───────┼───────┬───────────┬───────────┐
      │       │       │           │           │
┌─────▼─────┐ │ ┌─────▼─────┐ ┌──▼────────┐ │
│   Auth    │ │ │   User    │ │  Product  │ │
│  Service  │ │ │  Service  │ │  Service  │ │
│  :4001    │ │ │  :4002    │ │  :4003    │ │
│           │ │ │           │ │           │ │
│ MongoDB   │ │ │ MongoDB   │ │ MongoDB   │ │
│ auth_db   │ │ │ user_db   │ │ product_db│ │
└───────────┘ │ └───────────┘ └───────────┘ │
              │                              │
              │       ┌──────────────────────┘
              │       │
          ┌───▼───────▼───┐
          │     Order      │
          │    Service     │
          │     :4004      │
          │                │
          │    MongoDB     │
          │    order_db    │
          └────────────────┘
          Calls Auth & Product
          for verification
```

---

## Key Features Implemented

### 🔐 Authentication Service
- ✅ Email/Password registration and login
- ✅ Phone/Password registration and login
- ✅ Google OAuth integration (strategy ready)
- ✅ JWT token generation and validation
- ✅ Session management in database
- ✅ Token refresh mechanism
- ✅ Logout with session invalidation
- ✅ Multiple Passport strategies (Local, JWT, Google)

### 👤 User Service
- ✅ User profile management
- ✅ Profile CRUD operations
- ✅ User preferences and settings
- ✅ Address management

### 🛍️ Product Service
- ✅ Product catalog with pagination
- ✅ Stock management
- ✅ Product CRUD operations
- ✅ Auto-seeding sample products
- ✅ Stock availability checking

### 📦 Order Service
- ✅ Order creation with RxJS operators
- ✅ Multi-step validation (auth → stock → create)
- ✅ Order history with pagination
- ✅ Order status management
- ✅ Order cancellation
- ✅ Product snapshot in orders

### 🚪 API Gateway
- ✅ Centralized REST API
- ✅ JWT authentication guards
- ✅ Request routing to microservices
- ✅ CORS enabled
- ✅ Global validation pipes
- ✅ Structured controllers per domain

---

## Database Schemas

### Auth Service - Users Collection
```javascript
{
  _id: ObjectId,
  name: {
    first: String,
    last: String
  },
  email: {
    value: String,
    verified: Boolean
  },
  phone: {
    number: String,
    verified: Boolean
  },
  password: String (hashed),
  role: String (user|admin|guest),
  google: {
    id: String,
    email: String,
    picture: String
  },
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Auth Service - Sessions Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  token: String (JWT),
  device: {
    userAgent: String,
    ip: String
  },
  expiresAt: Date,
  isValid: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# Or restart MongoDB
# Windows
net stop MongoDB
net start MongoDB

# Linux/Mac
sudo systemctl restart mongod
```

### Port Already in Use
```bash
# Windows - Kill process on port
netstat -ano | findstr :4001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:4001 | xargs kill -9
```

### Service Not Connecting
1. Start services in order: Auth → User → Product → Order → Gateway
2. Check console for "Connected" messages
3. Verify all ports are free before starting

---

## Production Considerations

1. **Environment Variables**: Use proper secret management
2. **Database**: Use MongoDB Atlas or replica sets
3. **Authentication**: Implement rate limiting
4. **Logging**: Add Winston or Pino
5. **Monitoring**: Add health checks and metrics
6. **Docker**: Containerize each service
7. **API Documentation**: Add Swagger/OpenAPI
8. **Testing**: Add unit and e2e tests

---

## Next Steps

1. Add email verification flow
2. Add phone OTP verification
3. Implement role-based access control (RBAC)
4. Add Redis for caching
5. Add message queue (RabbitMQ/Kafka)
6. Implement saga pattern for distributed transactions
7. Add API rate limiting
8. Add comprehensive error handling
9. Add logging and monitoring
10. Add Docker Compose for easy deployment

---

## Success Indicators

When everything is running correctly, you should see:

```
🔐 Auth Service is listening on port 4001
👤 User Service is listening on port 4002
🛍️  Product Service is listening on port 4003
✅ Products seeded successfully
📦 Order Service is listening on port 4004
✅ Order Service: Connected to Auth and Product services
🚀 API Gateway is running on http://localhost:3000
✅ Gateway: All microservice connections established
```

Now you're ready to test the full authentication flow and create orders! 🎉