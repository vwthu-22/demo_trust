import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsArray,
    IsNumber,
    Min,
} from 'class-validator';

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    price: string;

    @IsNotEmpty()
    @IsString()
    image: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    sizes?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    colors?: string[];

    @IsOptional()
    @IsNumber()
    @Min(0)
    stock?: number;
}
