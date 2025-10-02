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
exports.AdminSchema = exports.Admin = exports.CustomerSchema = exports.Customer = exports.UserSchema = exports.User = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let User = class User {
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['customer', 'admin'], default: 'customer' }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, discriminatorKey: 'role' })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
let Customer = class Customer {
};
exports.Customer = Customer;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Customer.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Customer.prototype, "phone", void 0);
exports.Customer = Customer = __decorate([
    (0, mongoose_1.Schema)()
], Customer);
exports.CustomerSchema = mongoose_1.SchemaFactory.createForClass(Customer);
let Admin = class Admin {
};
exports.Admin = Admin;
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Admin.prototype, "department", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Admin.prototype, "canManageOrders", void 0);
exports.Admin = Admin = __decorate([
    (0, mongoose_1.Schema)()
], Admin);
exports.AdminSchema = mongoose_1.SchemaFactory.createForClass(Admin);
//# sourceMappingURL=user.schema.js.map