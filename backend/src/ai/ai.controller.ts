import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('use-model')
  useModel(@Body() body: { key: string; input: string }) {
    return this.aiService.useModel(body.key, body.input);
  }
}
