import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

describe('ReservationsController', () => {
  let controller: ReservationsController;
  const mockReservation = {
    id: 1,
    date: '2024-05-10',
    customers: 4,
    created_at: '2024-05-10T09:00:00Z',
    tableId: 4,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [
        {
          provide: ReservationsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockReservation]),
            findOne: jest.fn().mockResolvedValue(mockReservation),
            create: jest.fn().mockResolvedValue(mockReservation),
            remove: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    controller = module.get<ReservationsController>(ReservationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
