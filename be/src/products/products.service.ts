import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
    private products: Product[] = [
        {
            id: 1,
            name: 'Nike Air Max 270',
            price: '3.500.000₫',
            image:
                'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,q_auto:eco/2b0b6e2c-2e2e-4e2e-8e2e-2e2e2e2e2e2e/air-max-270-shoes-KkLcGR.png',
            description:
                'Nike Air Max 270 mang đến sự thoải mái tối đa với đơn vị Air lớn nhất từ trước đến nay. Thiết kế hiện đại kết hợp với công nghệ đệm khí tiên tiến, mang lại trải nghiệm đi bộ như đi trên mây.',
            category: 'Lifestyle',
            sizes: ['38', '39', '40', '41', '42', '43', '44'],
            colors: ['Đen/Trắng', 'Xanh Navy', 'Xám'],
            stock: 50,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 2,
            name: 'Nike Air Force 1',
            price: '2.900.000₫',
            image:
                'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,q_auto:eco/1b2b6e2c-2e2e-4e2e-8e2e-2e2e2e2e2e2e/air-force-1-07-shoes-WrLlWX.png',
            description:
                'Biểu tượng bất diệt của văn hóa sneaker. Nike Air Force 1 với thiết kế cổ điển, đế cao su bền bỉ và phong cách vượt thời gian. Một đôi giày không thể thiếu trong tủ giày của mọi sneakerhead.',
            category: 'Lifestyle',
            sizes: ['38', '39', '40', '41', '42', '43', '44', '45'],
            colors: ['Trắng', 'Đen', 'Trắng/Đen'],
            stock: 75,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 3,
            name: 'Nike Dunk Low',
            price: '3.200.000₫',
            image:
                'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,q_auto:eco/3b0b6e2c-2e2e-4e2e-8e2e-2e2e2e2e2e2e/dunk-low-shoes-7MmlFJ.png',
            description:
                'Nike Dunk Low trở lại với phong cách retro đầy cuốn hút. Từ sân bóng rổ đến đường phố, đôi giày này đã trở thành biểu tượng văn hóa với thiết kế đơn giản nhưng đầy ấn tượng.',
            category: 'Lifestyle',
            sizes: ['38', '39', '40', '41', '42', '43'],
            colors: ['Panda', 'Xanh/Trắng', 'Đỏ/Trắng'],
            stock: 40,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 4,
            name: 'Nike React Infinity',
            price: '4.100.000₫',
            image:
                'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,q_auto:eco/i1-8d7a8350-0b5c-4d4e-8e2e-2e2e2e2e2e2e/react-infinity-run-flyknit-3-running-shoe-5MmlFJ.png',
            description:
                'Được thiết kế để giảm chấn thương khi chạy bộ. Nike React Infinity với công nghệ đệm React foam mang lại sự êm ái và phản hồi tuyệt vời, giúp bạn chạy xa hơn, lâu hơn mà không lo đau chân.',
            category: 'Running',
            sizes: ['39', '40', '41', '42', '43', '44'],
            colors: ['Đen/Trắng', 'Xanh Dương', 'Cam'],
            stock: 30,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 5,
            name: 'Nike Blazer Mid',
            price: '3.800.000₫',
            image:
                'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,q_auto:eco/i1-5e7a8350-0b5c-4d4e-8e2e-2e2e2e2e2e2e/blazer-mid-77-vintage-shoe-nw30B2.png',
            description:
                'Phong cách vintage kết hợp với sự thoải mái hiện đại. Nike Blazer Mid 77 mang đến vẻ ngoài cổ điển với chất liệu da cao cấp và thiết kế cổ giày vừa phải, hoàn hảo cho phong cách streetwear.',
            category: 'Lifestyle',
            sizes: ['38', '39', '40', '41', '42', '43', '44'],
            colors: ['Trắng/Đen', 'Xanh Mint', 'Hồng'],
            stock: 45,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            id: 6,
            name: 'Nike Pegasus 40',
            price: '3.600.000₫',
            image:
                'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,q_auto:eco/i1-6e7a8350-0b5c-4d4e-8e2e-2e2e2e2e2e2e/pegasus-40-running-shoe-5MmlFJ.png',
            description:
                'Đôi giày chạy bộ đáng tin cậy nhất của Nike. Pegasus 40 với công nghệ đệm Air Zoom và React foam, mang lại sự cân bằng hoàn hảo giữa độ êm và độ nảy, phù hợp cho mọi cự ly chạy.',
            category: 'Running',
            sizes: ['39', '40', '41', '42', '43', '44', '45'],
            colors: ['Đen', 'Xanh Navy', 'Xám/Cam'],
            stock: 60,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    ];
    private currentId = 7;

    create(createProductDto: CreateProductDto): Product {
        const product: Product = {
            id: this.currentId++,
            ...createProductDto,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.products.push(product);
        return product;
    }

    findAll(): Product[] {
        return this.products;
    }

    findOne(id: number): Product {
        const product = this.products.find((p) => p.id === id);
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }

    update(id: number, updateProductDto: UpdateProductDto): Product {
        const product = this.findOne(id);
        Object.assign(product, updateProductDto);
        product.updatedAt = new Date();
        return product;
    }

    remove(id: number): void {
        const index = this.products.findIndex((p) => p.id === id);
        if (index === -1) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        this.products.splice(index, 1);
    }

    findByCategory(category: string): Product[] {
        return this.products.filter(
            (p) => p.category?.toLowerCase() === category.toLowerCase(),
        );
    }

    search(query: string): Product[] {
        const lowerQuery = query.toLowerCase();
        return this.products.filter(
            (p) =>
                p.name.toLowerCase().includes(lowerQuery) ||
                p.description?.toLowerCase().includes(lowerQuery) ||
                p.category?.toLowerCase().includes(lowerQuery),
        );
    }
}
