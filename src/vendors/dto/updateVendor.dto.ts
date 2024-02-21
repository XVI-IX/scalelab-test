import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class UpdateVendorDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  phone_number?: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  business_address?: string;
}
