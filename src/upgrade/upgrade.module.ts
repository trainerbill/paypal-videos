import { Module } from '@nestjs/common';
import { UpgradeController } from './upgrade.controller';

@Module({
  controllers: [UpgradeController]
})
export class UpgradeModule {}
