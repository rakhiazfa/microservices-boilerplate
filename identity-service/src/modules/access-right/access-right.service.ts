import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateAccessRightDto } from './dto/create-access-right.dto';
import { UpdateAccessRightDto } from './dto/update-access-right.dto';
import { PrismaService } from '@/providers/prisma/prisma.service';
import { AccessRight } from '@prisma/client';

@Injectable()
export class AccessRightService {
    constructor(private readonly prismaService: PrismaService) {}

    async findAll(): Promise<AccessRight[]> {
        const accessRights = await this.prismaService.accessRight.findMany();

        return accessRights;
    }

    async create(
        createAccessRightDto: CreateAccessRightDto,
    ): Promise<AccessRight> {
        const { name, method, path } = createAccessRightDto;

        const accessRightWithSameName = await this.findByName(name);

        if (accessRightWithSameName)
            throw new BadRequestException(
                `An access right with name '${name}' has been created`,
            );

        const accessRightWithSameAction = await this.findByAction(name, method);

        if (accessRightWithSameAction)
            throw new BadRequestException(
                `An access right with method '${method}' and path '${path}' has been created`,
            );

        return await this.prismaService.accessRight.create({
            data: {
                name,
                method,
                path,
            },
        });
    }

    async findById(id: string) {
        const accessRight = await this.prismaService.accessRight.findUnique({
            where: { id },
        });

        if (!accessRight) throw new NotFoundException('Role not found');

        return accessRight;
    }

    async findByName(
        name: string,
        options?: { expectId?: string },
    ): Promise<AccessRight> {
        const accessRight = await this.prismaService.accessRight.findUnique({
            where: {
                name,
                NOT: {
                    id: options ? options.expectId : undefined,
                },
            },
        });

        return accessRight;
    }

    async findByAction(
        method: string,
        path: string,
        options?: { expectId?: string },
    ): Promise<AccessRight> {
        const accessRight = await this.prismaService.accessRight.findFirst({
            where: {
                method: method,
                path: path,
                NOT: {
                    id: options ? options.expectId : undefined,
                },
            },
        });

        return accessRight;
    }

    async update(id: string, updateAccessRightDto: UpdateAccessRightDto) {
        const { name, method, path } = updateAccessRightDto;
        const accessRight = await this.findById(id);

        const accessRightWithSameName = await this.findByName(name, {
            expectId: id,
        });

        if (accessRightWithSameName)
            throw new BadRequestException(
                `An access right with name '${name}' has been created`,
            );

        const accessRightWithSameAction = await this.findByAction(
            method,
            path,
            {
                expectId: id,
            },
        );

        if (accessRightWithSameAction)
            throw new BadRequestException(
                `An access right with method '${method}' and path '${path}' has been created`,
            );

        return await this.prismaService.accessRight.update({
            where: {
                id: accessRight.id,
            },
            data: {
                name,
                method,
                path,
            },
        });
    }

    async remove(id: string) {
        const accessRight = await this.findById(id);

        return await this.prismaService.accessRight.delete({
            where: { id: accessRight.id },
        });
    }
}
