import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClassicModule } from './classic/classic.module';
import { UpgradeModule } from './upgrade/upgrade.module';
import { IntegrateModule } from './integrate/integrate.module';
import { RestModule } from './rest/rest.module';
import { SpaModule } from './spa/spa.module';

@Module({
  imports: [ClassicModule, UpgradeModule, IntegrateModule, RestModule, SpaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
