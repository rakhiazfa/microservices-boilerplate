import { Injectable } from '@nestjs/common';
import { CreateAccessRightDto } from './dto/create-access-right.dto';
import { UpdateAccessRightDto } from './dto/update-access-right.dto';

@Injectable()
export class AccessRightService {
  create(createAccessRightDto: CreateAccessRightDto) {
    return 'This action adds a new accessRight';
  }

  findAll() {
    return `This action returns all accessRight`;
  }

  findOne(id: number) {
    return `This action returns a #${id} accessRight`;
  }

  update(id: number, updateAccessRightDto: UpdateAccessRightDto) {
    return `This action updates a #${id} accessRight`;
  }

  remove(id: number) {
    return `This action removes a #${id} accessRight`;
  }
}
