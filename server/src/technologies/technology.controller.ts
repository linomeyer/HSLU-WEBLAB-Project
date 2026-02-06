import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TechnologyService } from './technology.service';
import { Technology } from './technology.schema';

@Controller('technology')
export class TechnologyController {
  constructor(private readonly technologyService: TechnologyService) {}

  @Get()
  async findAll(): Promise<Technology[]> {
    return this.technologyService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Technology | null> {
    return this.technologyService.findOne(id);
  }

  @Post()
  async create(@Body() technology: Technology): Promise<Technology> {
    return this.technologyService.create(technology);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() technology: Technology,
  ): Promise<Technology | null> {
    return this.technologyService.update(id, technology);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Technology | null> {
    return this.technologyService.delete(id);
  }
}
