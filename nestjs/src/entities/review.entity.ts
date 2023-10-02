import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Reader } from "./reader.entity";
import { Book } from "./book.entity";
import { IsInt, IsString, Length, Max, Min } from "class-validator";

// Custom many to many tabela jer jedan Reader moze da ostavi samo jedan review za jednu knjigu
@Entity()
export class Review {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    readerId: number

    @Column()
    bookId: number

    @Column()
    @IsInt()
    @Min(1)
    @Max(10)
    rating: number

    @Column()
    @IsString()
    @Length(5, 500)
    comment: string

    @Column({ name: "created_at", default: () => "NOW()" })
    createdAt: Date

    @Column({ name: "updated_at", default: () => "NOW()" })
    updatedAt: Date

    @ManyToOne(() => Reader, reader => reader.reviews)
    reader: Reader

    @ManyToOne(() => Book, book => book.reviews)
    book: Book
}