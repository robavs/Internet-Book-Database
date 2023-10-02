import { IsEmail, IsEnum, IsOptional, IsString, Length } from "class-validator";
import { Role } from "src/models/enums";
import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(["email"])
export abstract class User {
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

    @Column({ name: "email" })
    @IsEmail()
    email: string

    @Column()
    @IsString()
    @Length(3, 30)
    password: string

    @Column()
    @IsEnum(Role)
    role: Role

    @Column({ nullable: true })
    hashedRt: string | null
}