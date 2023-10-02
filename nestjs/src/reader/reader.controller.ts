import { Controller, Delete, Param, ParseIntPipe } from '@nestjs/common';
import { Reader } from 'src/entities/reader.entity';
import { ReaderService } from './reader.service';
import { Role } from 'src/models/enums';
import { Roles } from 'src/custom/decorators';
import { AuthControler } from 'src/auth/auth.controller';

@Controller('reader')
export class ReaderController extends AuthControler<Reader>{
    constructor(private readerService: ReaderService) {
        super(readerService)
    }

    @Roles(Role.Moderator, Role.Reader)
    @Delete("/delete/:id")
    async delete(@Param("id", ParseIntPipe) id: number) {
        await this.readerService.delete(id)
    }
}
