import { PartialType } from "@nestjs/mapped-types";
import { CreateAuthorDto } from "./CreateAuthorDto";

export class UpdateAuthorDto extends PartialType(CreateAuthorDto) { }