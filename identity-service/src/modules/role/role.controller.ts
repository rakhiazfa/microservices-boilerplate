import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @Get()
    async findAll() {
        const roles = await this.roleService.findAll();

        return { roles };
    }

    @Post()
    async create(@Body() createRoleDto: CreateRoleDto) {
        const createdRole = await this.roleService.create(createRoleDto);

        return {
            message: 'Successfully created a new role',
            createdRole,
        };
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        const role = await this.roleService.findById(id);

        return { role };
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateRoleDto: UpdateRoleDto,
    ) {
        const updatedRole = await this.roleService.update(id, updateRoleDto);

        return {
            message: 'Successfully updated role',
            updatedRole,
        };
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        const deletedRole = await this.roleService.remove(id);

        return {
            message: 'Successfully deleted role',
            deletedRole,
        };
    }
}
