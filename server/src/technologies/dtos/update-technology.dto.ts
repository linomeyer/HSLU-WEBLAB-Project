import { PartialType } from '@nestjs/swagger';
import { TechnologyDto } from './technology.dto';

export class UpdateTechnologyDto extends PartialType(TechnologyDto) {}
