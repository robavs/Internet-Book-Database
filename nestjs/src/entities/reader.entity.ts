import { Entity, OneToMany } from "typeorm";
import { User } from "./user.entity";
import { Review } from "./review.entity";

@Entity()
export class Reader extends User {
    @OneToMany(() => Review, review => review.reader)
    reviews: Review[]
}