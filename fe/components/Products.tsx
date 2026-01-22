'use client';

import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

interface Product {
    id: number;
    name: string;
    price: string;
    image: string;
    description?: string;
    category?: string;
}

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'https://naisube.vercel.app'}/products`;

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            console.log('Fetching products from:', API_URL);
            try {
                const response = await fetch(API_URL);
                console.log('Response status:', response.status);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Received products data:', data);
                setProducts(Array.isArray(data) ? data : []);
            } catch (err: any) {
                console.error('Fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <section id="products" className="py-16 px-6 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-xl text-gray-700">Loading products...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="products" className="py-16 px-6 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-xl text-red-600">Error: {error}</p>
                    <p className="text-md text-gray-600">Please ensure the backend server is running at {API_URL}</p>
                </div>
            </section>
        );
    }

    return (
        <section id="products" className="py-16 px-6 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-6 animate-fadeIn">
                    <p className="text-xl md:text-2xl mb-2 gradient-text">
                        Sản phẩm nổi bật
                    </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product, index) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            image={product.image}
                            delay={index * 100}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
