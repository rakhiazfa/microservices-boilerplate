import { Module } from '@nestjs/common';
import { AccessRightService } from './access-right.service';
import { AccessRightController } from './access-right.controller';

@Module({
  controllers: [AccessRightController],
  providers: [AccessRightService],
})
export class AccessRightModule {}
