import { Test, TestingModule } from '@nestjs/testing';
import { ClassicController } from './classic.controller';

describe('Classic Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [ClassicController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: ClassicController = module.get<ClassicController>(ClassicController);
    expect(controller).toBeDefined();
  });
});
