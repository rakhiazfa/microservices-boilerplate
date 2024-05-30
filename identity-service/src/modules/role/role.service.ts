import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from '@/providers/prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class RoleService {
    constructor(private readonly prismaService: PrismaService) {}

    async findAll(): Promise<Role[]> {
        const roles = await this.prismaService.role.findMany();

        return roles;
    }

    async create(createRoleDto: CreateRoleDto): Promise<Role> {
        const { name } = createRoleDto;

        const roleWithSameName = await this.findByName(name);

        if (roleWithSameName)
            throw new BadRequestException(
                `A role with name '${name}' has been created`,
            );

        return await this.prismaService.role.create({
            data: {
                name,
            },
        });
    }

    async findById(id: string): Promise<Role> {
        const role = await this.prismaService.role.findUnique({
            where: { id },
        });

        if (!role) throw new NotFoundException('Role not found');

        return role;
    }

    async findByName(
        name: string,
        options?: { expectId?: string },
    ): Promise<Role> {
        const role = await this.prismaService.role.findUnique({
            where: {
                name,
                NOT: {
                    id: options ? options.expectId : undefined,
                },
            },
        });

        return role;
    }

    async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
        const { name } = updateRoleDto;
        const role = await this.findById(id);

        const roleWithSameName = await this.findByName(name, {
            expectId: id,
        });

        if (roleWithSameName)
            throw new BadRequestException(
                `A role with name '${name}' has been created`,
            );

        return await this.prismaService.role.update({
            where: { id: role.id },
            data: {
                name,
            },
        });
    }

    async remove(id: string): Promise<Role> {
        const role = await this.findById(id);

        return await this.prismaService.role.delete({
            where: { id: role.id },
        });
    }
}
