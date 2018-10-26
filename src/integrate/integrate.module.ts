import { Module } from '@nestjs/common';
import { IntegrateController } from './integrate.controller';

@Module({
  controllers: [IntegrateController],
})
export class IntegrateModule {}
