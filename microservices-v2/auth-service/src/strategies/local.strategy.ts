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