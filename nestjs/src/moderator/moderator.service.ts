import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Moderator } from 'src/entities/moderator.entity';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';

@Injectable()
export class ModeratorService extends AuthService<Moderator>{
    constructor(@InjectRepository(Moderator) private readonly moderatorRepository: Repository<Moderator>) {
        super(moderatorRepository)
    }
}