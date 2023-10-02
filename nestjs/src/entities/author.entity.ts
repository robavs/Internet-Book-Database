import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { IsString, Length } from "class-validator";
import { Book } from "./book.entity";

@Entity()
export class Author {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: "first_name" })
    @IsString()
    @Length(3, 20)
    firstName: string

    @Column({ name: "last_name" })
    @IsString()
    @Length(3, 20)
    lastName: string

    @Column()
    @IsString()
    @Length(50, 2000)
    biography: string

    @Column()
    @IsString()
    @Length(1, 30)
    country: string

    @Column({ type: "float", default: 0 })
    rating: number

    @Column({ type: "integer", default: 0 })
    numberOfReviews: number

    @IsString()
    @Column()
    image: string

    @ManyToMany(() => Book, book => book.authors)
    @JoinTable({ name: "books_authors" })
    books: Book[]
}