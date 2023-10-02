import { Author } from "src/entities/author.entity";
import { Book } from "src/entities/book.entity";
import { Genre } from "src/entities/genre.entity";
import { Moderator } from "src/entities/moderator.entity";
import { Reader } from "src/entities/reader.entity";
import { Review } from "src/entities/review.entity";
import { User } from "src/entities/user.entity";
import { DataSourceOptions } from "typeorm";

export const typeOrmConfig: DataSourceOptions = {
    type: "postgres",
    host: 'localhost',
    port: 5434,
    username: "postgres",
    password: "123",
    entities: [User, Reader, Author, Book, Review, Genre, Moderator],
    synchronize: true,
    database: "bookreviews"
}