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