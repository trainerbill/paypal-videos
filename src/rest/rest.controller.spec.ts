import { Test, TestingModule } from '@nestjs/testing';
import { RestController } from './rest.controller';

describe('Rest Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [RestController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: RestController = module.get<RestController>(RestController);
    expect(controller).toBeDefined();
  });
});
