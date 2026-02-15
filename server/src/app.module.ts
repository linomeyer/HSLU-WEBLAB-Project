import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TechnologyModule } from './technologies/technology.module';
import { AuthModule } from './auth/auth.module';

const db_pwd = 'ZKAJvz2nxYvVcG1Y';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://linomeyer02_db_user:${db_pwd}@technology-radar.szo9bpi.mongodb.net/technology-radar?appName=Technology-Radar`,
    ),
    TechnologyModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
