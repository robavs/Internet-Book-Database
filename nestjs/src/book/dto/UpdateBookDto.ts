import { PartialType } from "@nestjs/mapped-types";
import { CreateBookDto } from "./CreateBookDto";

export class UpdateBookDto extends PartialType(CreateBookDto) { }