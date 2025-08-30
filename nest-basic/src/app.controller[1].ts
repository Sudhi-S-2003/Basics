import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import { MessageDto, messageQueryDto } from './interface/message';
import { JoiValidationPipe } from './pipes/validation.pipe';
import { messageQuerySchema, createMessageSchema } from './schema/message.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  // GET / → returns all messages
  @Get()
  @HttpCode(HttpStatus.OK) // ✅ 200 OK
  getMessage(): MessageDto[] {
    return this.appService.getMessage({query:{}});
  }

  // POST / → add a new message
  @Post()
  @HttpCode(HttpStatus.CREATED) // ✅ 201 Created
  @UsePipes(new JoiValidationPipe(createMessageSchema))
  addRandomMessage(@Body() body: { message: string }): MessageDto {
    return this.appService.addRandomMessage(body);
  }

  @Get("filter")
  @UsePipes(new JoiValidationPipe(messageQuerySchema))
  getMessageByFilter(@Query() query: messageQueryDto): MessageDto[] {
    return this.appService.getMessage({query});
  }
}
