import { Module } from '@nestjs/common';
import { ClassicController } from './classic.controller';

@Module({
  controllers: [ClassicController],
})
export class ClassicModule {}
