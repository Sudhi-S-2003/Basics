import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { MessageDto, messageQueryDto } from './interface/message';
import { JoiValidationPipe } from './pipes/validation.pipe';
import { messageQuerySchema, createMessageSchema } from './schema/message.schema';
import { MessageResponses } from './swagger/message.responses';

@ApiTags('messages')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse(MessageResponses.getAll) // ⬅️ use schema here
  getMessage(): MessageDto[] {
    return this.appService.getMessage({ query: {} });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new JoiValidationPipe(createMessageSchema))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Hello world' },
      },
    },
  })
  @ApiResponse(MessageResponses.created) // ⬅️ use schema here
  addRandomMessage(@Body() body: { message: string }): MessageDto {
    return this.appService.addRandomMessage(body);
  }

  @Get('filter')
  @UsePipes(new JoiValidationPipe(messageQuerySchema))
  @ApiQuery({ name: 'id', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse(MessageResponses.filter) // ⬅️ use schema here
  getMessageByFilter(@Query() query: messageQueryDto): MessageDto[] {
    return this.appService.getMessage({ query });
  }
}
