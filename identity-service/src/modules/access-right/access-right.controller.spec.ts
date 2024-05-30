import { Test, TestingModule } from '@nestjs/testing';
import { AccessRightController } from './access-right.controller';
import { AccessRightService } from './access-right.service';
import { PrismaService } from '@/providers/prisma/prisma.service';
import { AccessRight } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { CreateAccessRightDto } from './dto/create-access-right.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateAccessRightDto } from './dto/update-access-right.dto';

const prismaMock = {
    accessRight: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};

describe('AccessRightController', () => {
    let controller: AccessRightController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AccessRightController],
            providers: [
                AccessRightService,
                {
                    provide: PrismaService,
                    useValue: prismaMock,
                },
            ],
        }).compile();

        controller = module.get<AccessRightController>(AccessRightController);

        prismaMock.accessRight.findMany.mockClear();
        prismaMock.accessRight.findUnique.mockClear();
        prismaMock.accessRight.create.mockClear();
        prismaMock.accessRight.update.mockClear();
        prismaMock.accessRight.delete.mockClear();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('findAll', () => {
        it('should return a collection of access rights', async () => {
            const accessRights: AccessRight[] = [
                {
                    id: uuidv4(),
                    name: faker.word.sample(),
                    method: faker.word.sample(),
                    path: faker.internet.url(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            prismaMock.accessRight.findMany.mockResolvedValue(accessRights);

            await expect(controller.findAll()).resolves.toStrictEqual({
                accessRights,
            });
        });
    });

    describe('create', () => {
        it('should create a new access right', async () => {
            const createAccessRightDto: CreateAccessRightDto = {
                name: faker.word.sample(),
                method: faker.word.sample(),
                path: faker.internet.url(),
            };
            const accessRight: AccessRight = {
                id: uuidv4(),
                name: faker.word.sample(),
                method: faker.word.sample(),
                path: faker.internet.url(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            prismaMock.accessRight.create.mockResolvedValue(accessRight);

            await expect(
                controller.create(createAccessRightDto),
            ).resolves.toStrictEqual({
                message: 'Successfully created a new access right',
                createdAccessRight: accessRight,
            });
        });

        it('should throw PrismaClientKnownRequestError if createAccessRightDto is empty', async () => {
            prismaMock.accessRight.create.mockImplementation(
                async ({ data }) => {
                    if (!data?.name) {
                        throw new PrismaClientKnownRequestError(
                            'The name column cannot be empty',
                            {
                                clientVersion: '^5.14.0',
                                code: 'P2002',
                            },
                        );
                    }

                    return null;
                },
            );

            const createAccessRightDto = {} as CreateAccessRightDto;

            await expect(
                controller.create(createAccessRightDto),
            ).rejects.toThrow(PrismaClientKnownRequestError);
        });

        it('should throw BadRequestException if creating the same access right', async () => {
            prismaMock.accessRight.findUnique.mockResolvedValue(
                {} as AccessRight,
            );

            const createAccessRightDto: CreateAccessRightDto = {
                name: faker.word.sample(),
                method: faker.word.sample(),
                path: faker.internet.url(),
            };

            await expect(
                controller.create(createAccessRightDto),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('findById', () => {
        it('should return access right if exists', async () => {
            const accessRight: AccessRight = {
                id: uuidv4(),
                name: faker.word.sample(),
                method: faker.word.sample(),
                path: faker.internet.url(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            prismaMock.accessRight.findUnique.mockResolvedValue(accessRight);

            await expect(
                controller.findById(accessRight.id),
            ).resolves.toStrictEqual({
                accessRight,
            });
        });

        it('should throw NotFoundException if accessRight not exists', async () => {
            prismaMock.accessRight.findUnique.mockResolvedValue(null);

            await expect(controller.findById(uuidv4())).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('update', () => {
        it('should update access right if exists', async () => {
            const accessRight: AccessRight = {
                id: uuidv4(),
                name: faker.word.sample(),
                method: faker.word.sample(),
                path: faker.internet.url(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const updateAccessRightDto: UpdateAccessRightDto = {
                name: faker.word.sample(),
                method: faker.word.sample(),
                path: faker.internet.url(),
            };

            prismaMock.accessRight.findUnique.mockImplementation(
                async ({ where }) => {
                    if (where?.id === accessRight.id) return accessRight;

                    return null;
                },
            );
            prismaMock.accessRight.update.mockImplementation(
                async ({ data }) => {
                    return {
                        ...accessRight,
                        name: data?.name,
                        method: data?.method,
                        path: data?.path,
                    };
                },
            );

            await expect(
                controller.update(accessRight.id, updateAccessRightDto),
            ).resolves.toStrictEqual({
                message: 'Successfully updated access right',
                updatedAccessRight: {
                    ...accessRight,
                    name: updateAccessRightDto.name,
                    method: updateAccessRightDto.method,
                    path: updateAccessRightDto.path,
                },
            });
        });

        it('should throw PrismaClientKnownRequestError if updateAccessRightDto is empty', async () => {
            prismaMock.accessRight.update.mockImplementation(
                async ({ data }) => {
                    if (!data?.name || !data?.method || !data?.path) {
                        throw new PrismaClientKnownRequestError(
                            'The name column cannot be empty',
                            {
                                clientVersion: '^5.14.0',
                                code: 'P2002',
                            },
                        );
                    }

                    return null;
                },
            );

            const accessRight: AccessRight = {
                id: uuidv4(),
                name: faker.word.sample(),
                method: faker.word.sample(),
                path: faker.internet.url(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const updateAccessRightDto = {} as UpdateAccessRightDto;

            prismaMock.accessRight.findUnique.mockImplementation(
                async ({ where }) => {
                    if (where?.id === accessRight.id) return accessRight;

                    return null;
                },
            );

            await expect(
                controller.update(accessRight.id, updateAccessRightDto),
            ).rejects.toThrow(PrismaClientKnownRequestError);
        });

        it('should throw NotFoundException if access right not exists', async () => {
            const accessRight: AccessRight = {
                id: uuidv4(),
                name: faker.word.sample(),
                method: faker.word.sample(),
                path: faker.internet.url(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const updateAccessRightDto: UpdateAccessRightDto = {
                name: faker.word.sample(),
                method: faker.word.sample(),
                path: faker.internet.url(),
            };

            prismaMock.accessRight.findUnique.mockResolvedValue(null);

            await expect(
                controller.update(accessRight.id, updateAccessRightDto),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('delete', () => {
        it('should delete access right if exists', async () => {
            const accessRight: AccessRight = {
                id: uuidv4(),
                name: faker.word.sample(),
                method: faker.word.sample(),
                path: faker.internet.url(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            prismaMock.accessRight.findUnique.mockResolvedValue(accessRight);
            prismaMock.accessRight.delete.mockImplementation(async () => {
                prismaMock.accessRight.findUnique.mockResolvedValue(null);

                return accessRight;
            });

            await expect(
                controller.findById(accessRight.id),
            ).resolves.toStrictEqual({
                accessRight,
            });
            await expect(
                controller.remove(accessRight.id),
            ).resolves.toStrictEqual({
                message: 'Successfully deleted access right',
                deletedAccessRight: accessRight,
            });
            await expect(controller.findById(accessRight.id)).rejects.toThrow(
                NotFoundException,
            );
        });

        it('should throw NotFoundException if access right not exists', async () => {
            prismaMock.accessRight.findUnique.mockResolvedValue(null);

            await expect(controller.remove(uuidv4())).rejects.toThrow(
                NotFoundException,
            );
        });
    });
});
