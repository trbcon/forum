import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";


export class RegisterRequest {
    @IsString({ message: "Имя должно быть строкой" })
    @MaxLength(50, { message:"Имя не должно привышать 50 символов" })
    @MinLength(6, { message: "Имя не должно быть меньше 6 символов символов" })
    username: string;

    @IsString({ message: "Почта должна быть строкой" })
    @IsEmail({}, { message: "Некорректный формат почты" })
    email: string;

    @MinLength(6, { message: "Минимальная длина пароля - 6 символов"})
    @MaxLength(64, { message:"Максимальная длина пароля - 32 символа" })
    @IsNotEmpty({ message: "Пароль не должен быть пустым" })
    @IsString({ message: "Пароль должен быть строкой" })
    password: string;
}