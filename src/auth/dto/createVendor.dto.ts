import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CreateVendorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  @IsNotEmpty()
  business_address: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
