import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) { }



    async create(createProductDto: CreateProductDto): Promise<Product> {
        const product = this.productRepository.create(createProductDto);
        return await this.productRepository.save(product);
    }

    async findAll(): Promise<Product[]> {
        return await this.productRepository.find({
            order: { id: 'ASC' },
        });
    }

    async findOne(id: number): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }

    async update(
        id: number,
        updateProductDto: UpdateProductDto,
    ): Promise<Product> {
        const product = await this.findOne(id);
        Object.assign(product, updateProductDto);
        return await this.productRepository.save(product);
    }

    async remove(id: number): Promise<void> {
        const product = await this.findOne(id);
        await this.productRepository.remove(product);
    }

    async findByCategory(category: string): Promise<Product[]> {
        return await this.productRepository.find({
            where: { category: Like(`%${category}%`) },
            order: { id: 'ASC' },
        });
    }

    async search(query: string): Promise<Product[]> {
        return await this.productRepository
            .createQueryBuilder('product')
            .where('product.name LIKE :query', { query: `%${query}%` })
            .orWhere('product.description LIKE :query', { query: `%${query}%` })
            .orWhere('product.category LIKE :query', { query: `%${query}%` })
            .orderBy('product.id', 'ASC')
            .getMany();
    }
}
