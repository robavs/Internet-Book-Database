import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthControler } from './auth.controller';
import { AuthService } from './auth.service';
import { AtStrategy, RtStrategy } from './strategy';
import { PassportModule } from "@nestjs/passport"
import { jwtConstants } from './constants';
import { Repository } from 'typeorm';

@Module({
    imports: [
        PassportModule, JwtModule.register({
            secret: jwtConstants.ACCESS_TOKEN_KEY,
            signOptions: { expiresIn: '1d' },
        })],
    controllers: [AuthControler],
    providers: [AuthService, AtStrategy, RtStrategy, Repository]
})
export class AuthModule { }
