import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsString()
  @IsNumber()
  price?: number;

  @IsString()
  @IsNotEmpty()
  image_url?: string;
}
