import { IsString } from "class-validator"

export class CreateDto {
    @IsString({ message: 'Некорректый формат названия поста' })
    paragraph: string;

    @IsString({ message: 'Некорректный формат текста' })
    text: string;
}
