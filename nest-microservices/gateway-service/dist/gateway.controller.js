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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayController = void 0;
const common_1 = require("@nestjs/common");
const gateway_service_1 = require("./gateway.service");
const auth_dto_1 = require("./dto/auth.dto");
const order_dto_1 = require("./dto/order.dto");
let GatewayController = class GatewayController {
    constructor(gatewayService) {
        this.gatewayService = gatewayService;
    }
    async register(body) {
        const result = await this.gatewayService.register(body);
        if (!result.success)
            throw new common_1.HttpException(result.message, common_1.HttpStatus.BAD_REQUEST);
        return result;
    }
    async login(body, res) {
        const result = await this.gatewayService.login(body);
        if (!result.success)
            throw new common_1.HttpException(result.message, common_1.HttpStatus.UNAUTHORIZED);
        res.cookie('auth_token', result.token, {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'strict',
        });
        return { success: true, message: result.message, user: result.user };
    }
    async logout(res) {
        res.clearCookie('auth_token');
        return { success: true, message: 'Logged out successfully' };
    }
    async getOrders(req) {
        const token = req.cookies['auth_token'];
        if (!token)
            throw new common_1.HttpException('No token provided', common_1.HttpStatus.UNAUTHORIZED);
        const result = await this.gatewayService.getOrders(token);
        if (!result.success)
            throw new common_1.HttpException(result.message, common_1.HttpStatus.UNAUTHORIZED);
        return result;
    }
    async createOrder(req, body) {
        const token = req.cookies['auth_token'];
        if (!token)
            throw new common_1.HttpException('No token provided', common_1.HttpStatus.UNAUTHORIZED);
        const result = await this.gatewayService.createOrder(token, body);
        if (!result.success)
            throw new common_1.HttpException(result.message, common_1.HttpStatus.BAD_REQUEST);
        return result;
    }
};
exports.GatewayController = GatewayController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], GatewayController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], GatewayController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GatewayController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('orders'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GatewayController.prototype, "getOrders", null);
__decorate([
    (0, common_1.Post)('orders'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", Promise)
], GatewayController.prototype, "createOrder", null);
exports.GatewayController = GatewayController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [gateway_service_1.GatewayService])
], GatewayController);
//# sourceMappingURL=gateway.controller.js.map