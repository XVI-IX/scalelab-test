import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export interface order_items {
  itemId: number;
  quantity: number;
  price: number;
}

export class OrderDto {
  order_items: order_items[];

  @IsNumber()
  @IsNotEmpty()
  total_price: number;

  @IsString()
  @IsNotEmpty()
  delivery_location: string;
}
