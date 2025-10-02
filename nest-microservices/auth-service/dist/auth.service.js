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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user_schema_1 = require("./schemas/user.schema");
let AuthService = class AuthService {
    constructor(userModel) {
        this.userModel = userModel;
        this.JWT_SECRET = 'your-secret-key-change-in-production';
    }
    async register(registerDto) {
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
        }
        catch (error) {
            if (error.code === 11000) {
                return { success: false, message: 'Email already exists' };
            }
            return { success: false, message: error.message };
        }
    }
    async login(loginDto) {
        const user = await this.userModel.findOne({ email: loginDto.email });
        if (!user)
            return { success: false, message: 'Invalid credentials' };
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid)
            return { success: false, message: 'Invalid credentials' };
        const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, this.JWT_SECRET, { expiresIn: '24h' });
        return {
            success: true,
            message: 'Login successful',
            token,
            user: { id: user._id, email: user.email, role: user.role },
        };
    }
    async verifyToken(verifyTokenDto) {
        try {
            const decoded = jwt.verify(verifyTokenDto.token, this.JWT_SECRET);
            return { success: true, user: decoded, userId: decoded?.userId };
        }
        catch {
            return { success: false, message: 'Invalid or expired token' };
        }
    }
    async getCustomers() {
        try {
            const customers = await this.userModel
                .find({ role: 'customer' })
                .select('-password');
            return { success: true, customers };
        }
        catch (error) {
            return { success: false, message: error.message };
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AuthService);
//# sourceMappingURL=auth.service.js.map