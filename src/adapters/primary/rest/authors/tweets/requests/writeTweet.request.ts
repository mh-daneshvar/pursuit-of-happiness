import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { TweetCategory } from '@Domain/sharedKernel/entities/types/tweetCategory.enum';

class InheritedPermissions {
  @IsOptional()
  @IsBoolean()
  view?: boolean;

  @IsOptional()
  @IsBoolean()
  edit?: boolean;
}

class ViewEditPermissions {
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @ArrayUnique()
  users?: number[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @ArrayUnique()
  groups?: number[];
}

class Permissions {
  @IsOptional()
  @ValidateNested()
  @Type(() => InheritedPermissions)
  inherited?: InheritedPermissions;

  @IsOptional()
  @ValidateNested()
  @Type(() => ViewEditPermissions)
  view?: ViewEditPermissions;

  @IsOptional()
  @ValidateNested()
  @Type(() => ViewEditPermissions)
  edit?: ViewEditPermissions;
}

export class WriteTweetRequest {
  @IsOptional()
  @IsUUID()
  parent_id?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsString()
  @MinLength(1)
  content: string;

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsEnum(TweetCategory)
  category?: TweetCategory;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  hashtags?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => Permissions)
  permissions?: Permissions;
}
