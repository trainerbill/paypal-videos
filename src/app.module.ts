import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClassicModule } from './classic/classic.module';
import { UpgradeModule } from './upgrade/upgrade.module';

@Module({
  imports: [ClassicModule, UpgradeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
