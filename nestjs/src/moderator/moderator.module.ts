import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Moderator } from 'src/entities/moderator.entity';
import { User } from 'src/entities/user.entity';
import { ModeratorService } from './moderator.service';
import { ModeratorController } from './moderator.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [AuthModule, TypeOrmModule.forFeature([Moderator, User])],
    providers: [ModeratorService],
    controllers: [ModeratorController]
})
export class ModeratorModule { }
