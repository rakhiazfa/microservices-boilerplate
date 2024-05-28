import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './providers/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { RoleModule } from './modules/role/role.module';
import { AccessRightModule } from './modules/access-right/access-right.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,
        AuthModule,
        RoleModule,
        AccessRightModule,
    ],
})
export class AppModule {}
