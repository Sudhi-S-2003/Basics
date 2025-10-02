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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("./schemas/order.schema");
let OrderService = class OrderService {
    constructor(orderModel) {
        this.orderModel = orderModel;
    }
    async createOrder(createOrderDto) {
        try {
            const totalPrice = createOrderDto.quantity * 10;
            const order = new this.orderModel({
                userId: createOrderDto.userId,
                item: createOrderDto.item,
                quantity: createOrderDto.quantity,
                totalPrice,
                status: 'pending',
            });
            await order.save();
            return {
                success: true,
                message: 'Order created successfully',
                order: {
                    id: order._id,
                    userId: order.userId,
                    item: order.item,
                    quantity: order.quantity,
                    totalPrice: order.totalPrice,
                    status: order.status,
                    createdAt: order.createdAt,
                },
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
    async getOrders(getOrdersDto) {
        try {
            let orders;
            if (getOrdersDto.role === 'admin') {
                orders = await this.orderModel.find().sort({ createdAt: -1 });
            }
            else {
                orders = await this.orderModel
                    .find({ userId: getOrdersDto.userId })
                    .sort({ createdAt: -1 });
            }
            return {
                success: true,
                count: orders.length,
                orders: orders.map(order => ({
                    id: order._id,
                    userId: order.userId,
                    item: order.item,
                    quantity: order.quantity,
                    totalPrice: order.totalPrice,
                    status: order.status,
                    createdAt: order.createdAt,
                })),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], OrderService);
//# sourceMappingURL=order.service.js.map