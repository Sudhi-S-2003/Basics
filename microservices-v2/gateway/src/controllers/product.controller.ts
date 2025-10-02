import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AppService } from '../app.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('products')
export class ProductController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getAllProducts(@Query('page') page: number, @Query('limit') limit: number) {
    return this.appService.getAllProducts(page, limit);
  }

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    return this.appService.getProduct(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createProduct(@Body() body: any) {
    return this.appService.createProduct(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateProduct(@Param('id') id: string, @Body() body: any) {
    return this.appService.updateProduct(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteProduct(@Param('id') id: string) {
    return this.appService.deleteProduct(id);
  }
}