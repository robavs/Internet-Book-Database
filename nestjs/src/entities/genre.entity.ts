import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Book } from "./book.entity";
import { IsString, Length } from "class-validator";

@Entity()
@Unique(["name"])
export class Genre {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: "name" })
    @IsString()
    name: string

    @Column()
    @IsString()
    @Length(50, 2000)
    description: string

    @ManyToMany(() => Book, book => book.genres)
    @JoinTable({ name: "genres_books" })
    books: Book[]
}