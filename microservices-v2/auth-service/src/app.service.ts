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
  ) { }

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
      sub: (user._id as string | { toString(): string }).toString(),
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
      id: (user._id as string | { toString(): string }).toString(),
      name: user.name,
      email: user.email?.value,
      phone: user.phone?.number,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
    };
  }
}