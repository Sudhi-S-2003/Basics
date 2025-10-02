import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User, UserDocument } from './schemas/user.schema';
import { RegisterDto, LoginDto, VerifyTokenDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly JWT_SECRET = 'your-secret-key-change-in-production';

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      const user = await this.userModel.create({
        email: registerDto.email,
        password: hashedPassword,
        role: registerDto.role,
        name: registerDto.name,
        ...(registerDto.role === 'customer' && {
          address: registerDto.address,
          phone: registerDto.phone,
        }),
        ...(registerDto.role === 'admin' && {
          department: registerDto.department,
          canManageOrders: true,
        }),
      });

      return {
        success: true,
        message: 'User registered successfully',
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      if (error.code === 11000) {
        return { success: false, message: 'Email already exists' };
      }
      return { success: false, message: error.message };
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ email: loginDto.email });
    if (!user) return { success: false, message: 'Invalid credentials' };

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) return { success: false, message: 'Invalid credentials' };

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      this.JWT_SECRET,
      { expiresIn: '24h' },
    );

    return {
      success: true,
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email, role: user.role },
    };
  }

  async verifyToken(verifyTokenDto: VerifyTokenDto) {
    try {
      const decoded = jwt.verify(verifyTokenDto.token, this.JWT_SECRET) as jwt.JwtPayload;
      return { success: true, user: decoded, userId: decoded?.userId };
    } catch {
      return { success: false, message: 'Invalid or expired token' };
    }
  }

  async getCustomers() {
    try {
      const customers = await this.userModel
        .find({ role: 'customer' })
        .select('-password');
      return { success: true, customers };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
