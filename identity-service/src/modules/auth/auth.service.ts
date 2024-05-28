import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    async login() {
        return 'Login';
    }

    async logout() {
        return 'Logout';
    }

    async user() {
        return 'Get authenticated user';
    }

    async token() {
        return 'Generate a new access token';
    }
}
