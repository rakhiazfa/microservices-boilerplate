import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AccessRightService } from './access-right.service';
import { CreateAccessRightDto } from './dto/create-access-right.dto';
import { UpdateAccessRightDto } from './dto/update-access-right.dto';

@Controller('access-right')
export class AccessRightController {
  constructor(private readonly accessRightService: AccessRightService) {}

  @Post()
  create(@Body() createAccessRightDto: CreateAccessRightDto) {
    return this.accessRightService.create(createAccessRightDto);
  }

  @Get()
  findAll() {
    return this.accessRightService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accessRightService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccessRightDto: UpdateAccessRightDto) {
    return this.accessRightService.update(+id, updateAccessRightDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accessRightService.remove(+id);
  }
}
