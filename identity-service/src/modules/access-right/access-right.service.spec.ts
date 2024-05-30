import { Test, TestingModule } from '@nestjs/testing';
import { AccessRightService } from './access-right.service';
import { PrismaService } from '@/providers/prisma/prisma.service';

const prismaMock = {
    accessRight: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};

describe('AccessRightService', () => {
    let service: AccessRightService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AccessRightService,
                {
                    provide: PrismaService,
                    useValue: prismaMock,
                },
            ],
        }).compile();

        service = module.get<AccessRightService>(AccessRightService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
