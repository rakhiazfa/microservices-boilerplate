import { IsNotEmpty } from 'class-validator';

export class UpdateAccessRightDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    method: string;

    @IsNotEmpty()
    path: string;
}
