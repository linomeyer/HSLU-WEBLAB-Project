import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Trim } from 'class-sanitizer';
import { CategoryEnum } from './category.enum';
import { RingEnum } from './ring.enum';
import { IsRequiredWhenPublished } from './required-when-published.decorator';

export class TechnologyDto {
  @ApiProperty({
    required: true,
    description: 'Technology name',
    example: 'React',
  })
  @IsNotEmpty()
  @IsString()
  @Trim()
  @Matches(/\S/, { message: 'name must not be blank' })
  name: string;

  @ApiProperty({
    required: true,
    enum: CategoryEnum,
    description: 'Technology category',
    example: CategoryEnum.LANGUAGES_FRAMEWORKS,
  })
  @IsIn(Object.values(CategoryEnum), {
    message:
      'category must be one of: Techniques, Tools, Platforms, Languages & Frameworks',
  })
  category: CategoryEnum;

  @ApiProperty({
    required: true,
    enum: RingEnum,
    description: 'Technology adoption ring',
    example: RingEnum.ADOPT,
  })
  @IsOptional()
  @IsIn(Object.values(RingEnum), {
    message: 'ring must be one of: Adopt, Trial, Assess, Hold',
  })
  @IsRequiredWhenPublished()
  ring?: RingEnum | null;

  @ApiProperty({
    required: true,
    description: 'Technology description',
    example: 'A JavaScript library for building user interfaces',
  })
  @IsNotEmpty()
  @IsString()
  @Trim()
  @Matches(/\S/, { message: 'description must not be blank' })
  description: string;

  @ApiProperty({
    required: true,
    description: 'Reason for adoption/assessment',
    example: 'Industry standard for modern web development',
  })
  @IsString()
  @Trim()
  @IsOptional()
  @IsRequiredWhenPublished()
  reason?: string | null;

  @ApiProperty({
    required: true,
    description: 'Publication status',
    example: true,
  })
  @IsBoolean()
  isPublished: boolean;
}
