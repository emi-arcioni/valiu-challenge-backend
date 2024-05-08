import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoresModule } from './stores/stores.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'config/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), StoresModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
