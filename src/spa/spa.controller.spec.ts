import { Test, TestingModule } from '@nestjs/testing';
import { SpaController } from './spa.controller';

describe('Spa Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [SpaController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: SpaController = module.get<SpaController>(SpaController);
    expect(controller).toBeDefined();
  });
});
