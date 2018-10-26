import { Test, TestingModule } from '@nestjs/testing';
import { IntegrateController } from './integrate.controller';

describe('Integrate Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [IntegrateController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: IntegrateController = module.get<IntegrateController>(IntegrateController);
    expect(controller).toBeDefined();
  });
});
