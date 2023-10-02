import { User } from "./user.entity";
import { Entity } from "typeorm";

@Entity()
export class Moderator extends User { }