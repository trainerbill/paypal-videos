import { Test, TestingModule } from '@nestjs/testing';
import { UpgradeController } from './upgrade.controller';

describe('Upgrade Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [UpgradeController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: UpgradeController = module.get<UpgradeController>(UpgradeController);
    expect(controller).toBeDefined();
  });
});
