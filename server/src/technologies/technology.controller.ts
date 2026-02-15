import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TechnologyService } from './technology.service';
import { Technology } from './technology.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

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
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() technology: Technology): Promise<Technology> {
    return this.technologyService.create(technology);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(
    @Param('id') id: string,
    @Body() technology: Technology,
  ): Promise<Technology | null> {
    return this.technologyService.update(id, technology);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Param('id') id: string): Promise<Technology | null> {
    return this.technologyService.delete(id);
  }
}
