import { Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login() {
        return await this.authService.login();
    }

    @HttpCode(HttpStatus.OK)
    @Post('logout')
    async logout() {
        return await this.authService.logout();
    }

    @Get('user')
    async user() {
        return await this.authService.user();
    }

    @HttpCode(HttpStatus.OK)
    @Post('token')
    async token() {
        return await this.authService.token();
    }
}
