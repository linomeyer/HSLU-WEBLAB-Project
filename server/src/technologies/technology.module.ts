import { Module } from '@nestjs/common';
import { TechnologyController } from './technology.controller';
import { TechnologyService } from './technology.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Technology, TechnologySchema } from './technology.schema';

@Module({
  controllers: [TechnologyController],
  providers: [TechnologyService],
  imports: [
    MongooseModule.forFeature([
      { name: Technology.name, schema: TechnologySchema },
    ]),
  ],
})
export class TechnologyModule {}
