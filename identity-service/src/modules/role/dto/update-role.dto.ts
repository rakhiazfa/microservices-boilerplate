import { IsNotEmpty } from 'class-validator';

export class UpdateRoleDto {
    @IsNotEmpty()
    name: string;
}
