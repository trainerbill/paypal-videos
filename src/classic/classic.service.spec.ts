import { Test, TestingModule } from '@nestjs/testing';
import { ClassicService } from './classic.service';

describe('ClassicService', () => {
  let service: ClassicService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassicService],
    }).compile();
    service = module.get<ClassicService>(ClassicService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
