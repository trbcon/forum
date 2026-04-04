import { IsString } from "class-validator"

export class CreateCommentDto {
    @IsString({ message: 'Некорректный формат текста' })
    text: string;
}
