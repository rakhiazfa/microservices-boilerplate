import { IsNotEmpty } from 'class-validator';

export class CreateAccessRightDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    method: string;

    @IsNotEmpty()
    path: string;
}
