// import {
//   ArrayMinSize,
//   IsArray,
//   IsDate,
//   IsEnum,
//   IsInt,
//   IsNumber,
//   IsOptional,
//   IsString,
//   Max,
//   Min,
//   ValidateNested,
// } from 'class-validator';
// import { Type } from 'class-transformer';
// import { DeliveryType } from '@Domain/reviews/entities/deliveryType.enum';
// import { ToUpperCase } from '@Common/utils/decorators.request';
//
// class DeliveryRating {
//   @IsInt()
//   @Min(1)
//   @Max(5)
//   readonly rating: number;
//
//   @IsString()
//   @IsOptional()
//   readonly comment: string;
//
//   @IsArray()
//   @IsOptional()
//   @IsNumber({}, { each: true })
//   readonly options: number[];
// }
//
// class OrderRating {
//   @IsInt()
//   @Min(1)
//   @Max(5)
//   readonly rating: number;
//
//   @IsString()
//   @IsOptional()
//   readonly comment: string;
//
//   @IsArray()
//   @IsOptional()
//   @IsNumber({}, { each: true })
//   readonly options: number[];
// }
//
// class ItemRating {
//   @IsInt()
//   readonly product_id: number;
//
//   @IsInt()
//   @Min(1)
//   @Max(5)
//   readonly rating: number;
//
//   @IsString()
//   @IsOptional()
//   readonly comment: string;
//
//   @IsArray()
//   @IsOptional()
//   @IsNumber({}, { each: true })
//   readonly options: number[];
// }
//
// export class WriteReviewRequest {
//   @IsInt()
//   readonly order_id: number;
//
//   @IsDate()
//   @Type(() => Date)
//   @IsOptional()
//   order_created_at: Date;
//
//   @IsInt()
//   readonly vendor_id: number;
//
//   @ToUpperCase()
//   @IsEnum(DeliveryType, {
//     message:
//       'delivery type must be a valid value (' +
//       Object.values(DeliveryType) +
//       ')',
//   })
//   delivery_type: DeliveryType;
//
//   @IsString()
//   readonly writer_name: string;
//
//   @ValidateNested()
//   @Type(() => DeliveryRating)
//   readonly delivery_rating: DeliveryRating;
//
//   @ValidateNested()
//   @Type(() => OrderRating)
//   readonly order_rating: OrderRating;
//
//   @IsArray()
//   @IsOptional()
//   @ArrayMinSize(0)
//   @ValidateNested({ each: true })
//   @Type(() => ItemRating)
//   readonly order_items_rating: ItemRating[];
// }
