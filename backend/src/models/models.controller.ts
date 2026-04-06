import { Controller, Get, Param, Query } from '@nestjs/common';
import { ModelsService } from './models.service';

@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Get()
  getModels(@Query('categoryId') categoryId?: string) {
    return this.modelsService.getModels(categoryId);
  }

  @Get(':id')
  getModelById(@Param('id') id: string) {
    return this.modelsService.getModelById(id);
  }
}
