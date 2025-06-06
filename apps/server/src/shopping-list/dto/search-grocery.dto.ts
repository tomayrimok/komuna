import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GroceryItem {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  formattedPrice: string;

  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsString()
  priceForUnit: '/יח׳' | '/ק״ג';
}

export class SearchGroceryResponse {
  @ApiProperty({ type: GroceryItem, isArray: true })
  items: GroceryItem[];
}
