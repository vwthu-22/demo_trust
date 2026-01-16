export class Product {
    id: number;
    name: string;
    price: string;
    image: string;
    description?: string;
    category?: string;
    sizes?: string[];
    colors?: string[];
    stock?: number;
    createdAt: Date;
    updatedAt: Date;
}
