import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany } from "typeorm";
import { Review } from "./review.entity";
import { Genre } from "./genre.entity";
import { Author } from "./author.entity";
import { IsInt, IsString, Length, Min } from "class-validator";

@Entity()
export class Book {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @IsString()
    @Length(1, 100)
    name: string

    @IsString()
    @Column()
    image: string

    @Column({ name: "publication_date" })
    publicationDate: Date

    @Column({ name: "number_of_pages" })
    @IsInt()
    @Min(1)
    numberOfPages: number

    @Column({ type: "float", default: 0 })
    rating: number

    @Column({ type: "integer", default: 0 })
    numberOfReviews: number

    @OneToMany(() => Review, review => review.book)
    reviews: Review[]

    @ManyToMany(() => Genre, genre => genre.books, {
        cascade: true
    })
    genres: Genre[]

    @ManyToMany(() => Author, author => author.books)
    authors: Author[]
}