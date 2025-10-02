"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const order_module_1 = require("./order.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.createMicroservice(order_module_1.OrderModule, {
        transport: microservices_1.Transport.TCP,
        options: {
            host: '0.0.0.0',
            port: 4002,
        },
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    await app.listen();
    console.log('Order Service is listening on port 4002');
}
bootstrap();
//# sourceMappingURL=main.js.map