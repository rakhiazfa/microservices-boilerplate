import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
    BadRequestException,
    ClassSerializerInterceptor,
    ValidationPipe,
} from '@nestjs/common';
import ucfirst from './common/utils/ucfirst';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const reflector = app.get(Reflector);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            stopAtFirstError: true,
            exceptionFactory(errors) {
                errors = errors.map((error) => ({
                    property: error.property,
                    message: ucfirst(
                        error.constraints[Object.keys(error.constraints)[0]],
                    ),
                }));

                return new BadRequestException(errors);
            },
        }),
    );
    app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

    await app.listen(3000);
}

bootstrap();
