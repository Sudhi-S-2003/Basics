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