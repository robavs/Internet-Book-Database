import { Controller } from '@nestjs/common';
import { Moderator } from 'src/entities/moderator.entity';
import { ModeratorService } from './moderator.service';
import { AuthControler } from 'src/auth/auth.controller';

@Controller('moderator')
export class ModeratorController extends AuthControler<Moderator> {
    constructor(private readonly moderatorSerivce: ModeratorService) {
        super(moderatorSerivce)
    }
}
