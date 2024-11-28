// import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
// import { Category } from '@Domain/reviews/entities/category.enum';
// import { InfluenceScope } from '@Domain/reviews/entities/influenceScope.enum';
// import { Transform } from 'class-transformer';
//
// export class GetOptionsRequest {
//   @IsOptional()
//   @IsString()
//   @Transform(({ value }) => Category[value?.toUpperCase()])
//   readonly category?: Category;
//
//   @IsOptional()
//   @IsString()
//   @Transform(({ value }) => InfluenceScope[value?.toUpperCase()])
//   readonly scope?: InfluenceScope;
//
//   @IsOptional()
//   @IsInt()
//   @Min(1)
//   @Max(5)
//   @Transform(({ value }) => parseInt(value, 10))
//   readonly rating?: number;
// }
