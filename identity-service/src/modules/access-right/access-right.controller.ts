import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
} from '@nestjs/common';
import { AccessRightService } from './access-right.service';
import { CreateAccessRightDto } from './dto/create-access-right.dto';
import { UpdateAccessRightDto } from './dto/update-access-right.dto';

@Controller('access-rights')
export class AccessRightController {
    constructor(private readonly accessRightService: AccessRightService) {}

    @Get()
    async findAll() {
        const accessRights = await this.accessRightService.findAll();

        return { accessRights };
    }

    @Post()
    async create(@Body() createAccessRightDto: CreateAccessRightDto) {
        const createdAccessRight =
            await this.accessRightService.create(createAccessRightDto);

        return {
            message: 'Successfully created a new access right',
            createdAccessRight,
        };
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        const accessRight = await this.accessRightService.findById(id);

        return { accessRight };
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateAccessRightDto: UpdateAccessRightDto,
    ) {
        const updatedAccessRight = await this.accessRightService.update(
            id,
            updateAccessRightDto,
        );

        return {
            message: 'Successfully updated access right',
            updatedAccessRight,
        };
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        const deletedAccessRight = await this.accessRightService.remove(id);

        return {
            message: 'Successfully deleted access right',
            deletedAccessRight,
        };
    }
}
