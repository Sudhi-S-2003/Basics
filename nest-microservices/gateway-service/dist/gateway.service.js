"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayService = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
let GatewayService = class GatewayService {
    constructor() {
        this.authClient = microservices_1.ClientProxyFactory.create({
            transport: microservices_1.Transport.TCP,
            options: { host: '0.0.0.0', port: 4001 },
        });
        this.orderClient = microservices_1.ClientProxyFactory.create({
            transport: microservices_1.Transport.TCP,
            options: { host: '0.0.0.0', port: 4002 },
        });
    }
    async register(registerDto) {
        return (0, rxjs_1.lastValueFrom)(this.authClient.send({ cmd: 'register' }, registerDto));
    }
    async login(loginDto) {
        return (0, rxjs_1.lastValueFrom)(this.authClient.send({ cmd: 'login' }, loginDto));
    }
    async verifyToken(verifyTokenDto) {
        return (0, rxjs_1.lastValueFrom)(this.authClient.send({ cmd: 'verify_token' }, verifyTokenDto));
    }
    async getOrders(token) {
        const verify = await this.verifyToken({ token });
        if (!verify.success)
            return { success: false, message: 'Invalid token' };
        const userId = verify.user?.userId || verify.userId;
        try {
            return await (0, rxjs_1.lastValueFrom)(this.orderClient.send({ cmd: 'get_orders' }, { userId }));
        }
        catch (error) {
            console.error('Error fetching orders:', error);
            return { success: false, message: 'Internal server error' };
        }
    }
    async createOrder(token, body) {
        const verify = await this.verifyToken({ token });
        if (!verify.success)
            return { success: false, message: 'Invalid token' };
        return (0, rxjs_1.lastValueFrom)(this.orderClient.send({ cmd: 'create_order' }, {
            userId: verify.userId,
            item: body.item,
            quantity: body.quantity,
        }));
    }
};
exports.GatewayService = GatewayService;
exports.GatewayService = GatewayService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], GatewayService);
//# sourceMappingURL=gateway.service.js.map