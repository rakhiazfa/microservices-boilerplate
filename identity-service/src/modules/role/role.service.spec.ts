import { Test } from '@nestjs/testing';
import { RoleService } from './role.service';
import { PrismaService } from '@/providers/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '@prisma/client';
import { CreateRoleDto } from './dto/create-role.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UpdateRoleDto } from './dto/update-role.dto';

const prismaMock = {
    role: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
};

describe('RoleService', () => {
    let service: RoleService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                RoleService,
                {
                    provide: PrismaService,
                    useValue: prismaMock,
                },
            ],
        }).compile();

        service = moduleRef.get<RoleService>(RoleService);

        prismaMock.role.findMany.mockClear();
        prismaMock.role.findUnique.mockClear();
        prismaMock.role.create.mockClear();
        prismaMock.role.update.mockClear();
        prismaMock.role.delete.mockClear();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return a collection of roles', async () => {
            const roles: Role[] = [
                {
                    id: uuidv4(),
                    name: faker.person.jobTitle(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            prismaMock.role.findMany.mockResolvedValue(roles);

            await expect(service.findAll()).resolves.toBe(roles);
        });
    });

    describe('create', () => {
        it('should create a new role', async () => {
            const createRoleDto: CreateRoleDto = {
                name: faker.person.jobTitle(),
            };
            const role: Role = {
                id: uuidv4(),
                name: faker.person.jobTitle(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            prismaMock.role.create.mockResolvedValue(role);

            await expect(service.create(createRoleDto)).resolves.toBe(role);
        });

        it('should throw PrismaClientKnownRequestError if createRoleDto is empty', async () => {
            prismaMock.role.create.mockImplementation(async ({ data }) => {
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
            });

            const createRoleDto = {} as CreateRoleDto;

            await expect(service.create(createRoleDto)).rejects.toThrow(
                PrismaClientKnownRequestError,
            );
        });

        it('should throw BadRequestException if creating the same role', async () => {
            prismaMock.role.findUnique.mockResolvedValue({} as Role);

            const createRoleDto: CreateRoleDto = {
                name: faker.person.jobTitle(),
            };

            await expect(service.create(createRoleDto)).rejects.toThrow(
                BadRequestException,
            );
        });
    });

    describe('findById', () => {
        it('should return role if exists', async () => {
            const role: Role = {
                id: uuidv4(),
                name: faker.person.jobTitle(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            prismaMock.role.findUnique.mockResolvedValue(role);

            await expect(service.findById(role.id)).resolves.toBe(role);
        });

        it('should throw NotFoundException if role not exists', async () => {
            prismaMock.role.findUnique.mockResolvedValue(null);

            await expect(service.findById(uuidv4())).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('update', () => {
        it('should update role if exists', async () => {
            const role: Role = {
                id: uuidv4(),
                name: faker.person.jobTitle(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const updateRoleDto: UpdateRoleDto = {
                name: faker.person.jobTitle(),
            };

            prismaMock.role.findUnique.mockImplementation(async ({ where }) => {
                if (where?.id === role.id) return role;

                return null;
            });
            prismaMock.role.update.mockImplementation(async ({ data }) => {
                return {
                    ...role,
                    name: data?.name,
                };
            });

            await expect(
                service.update(role.id, updateRoleDto),
            ).resolves.toStrictEqual({
                ...role,
                name: updateRoleDto.name,
            } as Role);
        });

        it('should throw PrismaClientKnownRequestError if updateRoleDto is empty', async () => {
            prismaMock.role.update.mockImplementation(async ({ data }) => {
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
            });

            const role: Role = {
                id: uuidv4(),
                name: faker.person.jobTitle(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const updateRoleDto = {} as UpdateRoleDto;

            prismaMock.role.findUnique.mockImplementation(async ({ where }) => {
                if (where?.id === role.id) return role;

                return null;
            });

            await expect(
                service.update(role.id, updateRoleDto),
            ).rejects.toThrow(PrismaClientKnownRequestError);
        });

        it('should throw NotFoundException if role not exists', async () => {
            const role: Role = {
                id: uuidv4(),
                name: faker.person.jobTitle(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const updateRoleDto: UpdateRoleDto = {
                name: faker.person.jobTitle(),
            };

            prismaMock.role.findUnique.mockResolvedValue(null);

            await expect(
                service.update(role.id, updateRoleDto),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('delete', () => {
        it('should delete role if exists', async () => {
            const role: Role = {
                id: uuidv4(),
                name: faker.person.jobTitle(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            prismaMock.role.findUnique.mockResolvedValue(role);
            prismaMock.role.delete.mockImplementation(async () => {
                prismaMock.role.findUnique.mockResolvedValue(null);
                return role;
            });

            await expect(service.findById(role.id)).resolves.toBe(role);
            await expect(service.remove(role.id)).resolves.toBe(role);
            await expect(service.findById(role.id)).rejects.toThrow(
                NotFoundException,
            );
        });

        it('should throw NotFoundException if role not exists', async () => {
            prismaMock.role.findUnique.mockResolvedValue(null);

            await expect(service.remove(uuidv4())).rejects.toThrow(
                NotFoundException,
            );
        });
    });
});
