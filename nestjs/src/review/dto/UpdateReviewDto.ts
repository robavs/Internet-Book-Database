import { PartialType } from "@nestjs/mapped-types";
import { CreateReviewDto } from "./CreateReviewDto";

export class UpdateReviewDto extends PartialType(CreateReviewDto) { }