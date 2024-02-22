import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { TransferRecipient } from 'src/payments/recipient.entity';

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

  bank_details?: TransferRecipient;
}
