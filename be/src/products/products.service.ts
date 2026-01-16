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

    async seed() {
        // Clear existing data (optional, be careful in production!)
        // await this.productRepository.clear();

        const count = await this.productRepository.count();
        if (count > 0) return { message: 'Database already has data' };

        const products = [
            {
                name: 'Nike Air Max 270',
                price: '3.500.000₫',
                image: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/401cfc12-9de2-41ff-9084-1f99f68e9b03/W+ZOOM+GP+CHALLENGE+PRO+HC.png',
                description: 'Nike Air Max 270 mang đến sự thoải mái tối đa với đơn vị Air lớn nhất từ trước đến nay.',
                category: 'Lifestyle',
                sizes: ['38', '39', '40', '41', '42', '43', '44'],
                colors: ['Đen/Trắng', 'Xanh Navy', 'Xám'],
                stock: 50,
            },
            {
                name: 'Nike Air Force 1',
                price: '2.900.000₫',
                image: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/4ba01291-b9d5-48c0-913f-84f9a7e46f43/W+ZOOM+GP+CHALLENGE+PRO+HC.png',
                description: 'Biểu tượng bất diệt của văn hóa sneaker. Nike Air Force 1 với thiết kế cổ điển.',
                category: 'Lifestyle',
                sizes: ['38', '39', '40', '41', '42', '43', '44', '45'],
                colors: ['Trắng', 'Đen', 'Trắng/Đen'],
                stock: 75,
            },
            {
                name: 'Nike Dunk Low',
                price: '3.200.000₫',
                image: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/7b8e2ad4-1ff2-4d51-9ee2-edd41d25874b/W+ZOOM+GP+CHALLENGE+PRO+HC.png',
                description: 'Nike Dunk Low trở lại với phong cách retro đầy cuốn hút.',
                category: 'Lifestyle',
                sizes: ['38', '39', '40', '41', '42', '43'],
                colors: ['Panda', 'Xanh/Trắng', 'Đỏ/Trắng'],
                stock: 40,
            },
            {
                name: 'Nike React Infinity',
                price: '4.100.000₫',
                image: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/4ddcc507-ad90-448e-b5d6-c426c1dcb893/W+ZOOM+VAPOR+12+HC+PRM.png',
                description: 'Được thiết kế để giảm chấn thương khi chạy bộ. Nike React Infinity với công nghệ đệm React foam.',
                category: 'Running',
                sizes: ['39', '40', '41', '42', '43', '44'],
                colors: ['Đen/Trắng', 'Xanh Dương', 'Cam'],
                stock: 30,
            },
            {
                name: 'Nike Blazer Mid',
                price: '3.800.000₫',
                image: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/f094af40-f82f-4fb9-a246-e031bf6fc411/WMNS+AIR+FORCE+1+%2707.png',
                description: 'Phong cách vintage kết hợp với sự thoải mái hiện đại. Nike Blazer Mid 77 mang đến vẻ ngoài cổ điển.',
                category: 'Lifestyle',
                sizes: ['38', '39', '40', '41', '42', '43', '44'],
                colors: ['Trắng/Đen', 'Xanh Mint', 'Hồng'],
                stock: 45,
            },
            {
                name: 'Nike Pegasus 40',
                price: '3.600.000₫',
                image: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/02f8959e-927a-40c0-8ed6-366574f302d0/WMNS+AIR+FORCE+1+%2707.png',
                description: 'Đôi giày chạy bộ đáng tin cậy nhất của Nike. Pegasus 40 với công nghệ đệm Air Zoom và React foam.',
                category: 'Running',
                sizes: ['39', '40', '41', '42', '43', '44', '45'],
                colors: ['Đen', 'Xanh Navy', 'Đen/Trắng'],
                stock: 60,
            },
        ];

        await this.productRepository.save(products);
        return { message: 'Seeded 6 products successfully' };
    }
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
