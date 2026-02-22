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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TechnologyService } from './technology.service';
import { Technology } from './technology.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminRoleGuard } from '../auth/admin-role.guard';
import { TechnologyDto } from './dtos/technology.dto';
import { UpdateTechnologyDto } from './dtos/update-technology.dto';
import { EmployeeRoleGuard } from '../auth/employee-role.guard';

@ApiTags('technologies')
@Controller('technology')
export class TechnologyController {
  constructor(private readonly technologyService: TechnologyService) {}

  @Get()
  @UseGuards(JwtAuthGuard, EmployeeRoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all technologies (Admin or Employee only)' })
  @ApiResponse({ status: 200, description: 'Returns all technologies' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin or Employee role required',
  })
  async findAll(): Promise<Technology[]> {
    return this.technologyService.findAll();
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard, EmployeeRoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get technology by ID' })
  @ApiResponse({ status: 200, description: 'Returns the technology' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin or Employee role required',
  })
  @ApiResponse({ status: 404, description: 'Technology not found' })
  async findOne(@Param('id') id: string): Promise<Technology> {
    return this.technologyService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new technology (Admin only)' })
  @ApiResponse({ status: 201, description: 'Technology created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async create(@Body() technology: TechnologyDto): Promise<Technology> {
    return this.technologyService.create(technology);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update technology (Admin only)' })
  @ApiResponse({ status: 200, description: 'Technology updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Technology not found' })
  async update(
    @Param('id') id: string,
    @Body() technology: UpdateTechnologyDto,
  ): Promise<Technology> {
    return this.technologyService.update(id, technology);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete technology (Admin only)' })
  @ApiResponse({ status: 200, description: 'Technology deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @ApiResponse({ status: 404, description: 'Technology not found' })
  async delete(@Param('id') id: string): Promise<Technology> {
    return this.technologyService.delete(id);
  }
}
