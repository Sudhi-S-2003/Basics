"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const auth_module_1 = require("./auth.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(auth_module_1.AuthModule, {
        transport: microservices_1.Transport.TCP,
        options: {
            host: '0.0.0.0',
            port: 4001,
        },
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: (errors) => {
            const messages = errors
                .map(err => Object.values(err.constraints || {}))
                .flat();
            return new microservices_1.RpcException(messages);
        },
    }));
    await app.listen();
    console.log('Auth Service is listening on port 4001');
}
bootstrap();
//# sourceMappingURL=main.js.map