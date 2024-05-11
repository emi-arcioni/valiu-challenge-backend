import { Test, TestingModule } from '@nestjs/testing';
import { TablesController } from './tables.controller';
import { TablesService } from './tables.service';

describe('TablesController', () => {
  let controller: TablesController;
  const mockTable = { id: 1, size: 2 };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TablesController],
      providers: [
        {
          provide: TablesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockTable]),
            findOne: jest.fn().mockResolvedValue(mockTable),
            create: jest.fn().mockResolvedValue(mockTable),
            remove: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    controller = module.get<TablesController>(TablesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
