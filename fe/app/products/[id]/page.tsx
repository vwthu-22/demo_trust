'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

interface Product {
    id: number;
    name: string;
    price: string;
    image: string;
    description?: string;
    category?: string;
    sizes?: string[];
    colors?: string[];
    stock?: number;
}

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:3001/products/${params.id}`);
                if (!response.ok) {
                    throw new Error('Product not found');
                }
                const data = await response.json();
                setProduct(data);
                if (data.sizes && data.sizes.length > 0) {
                    setSelectedSize(data.sizes[0]);
                }
                if (data.colors && data.colors.length > 0) {
                    setSelectedColor(data.colors[0]);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchProduct();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
                <button
                    onClick={() => router.push('/')}
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                    Quay lại trang chủ
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            {/* Back Button */}
            <div className="max-w-7xl mx-auto px-6 pt-8">
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors group"
                >
                    <svg
                        className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Quay lại
                </button>
            </div>

            {/* Product Detail */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden group">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                            priority
                        />
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col gap-6">
                        {/* Category */}
                        {product.category && (
                            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                {product.category}
                            </span>
                        )}

                        {/* Name & Price */}
                        <div>
                            <h1 className="text-4xl md:text-3xl font-black mb-4 gradient-text">
                                {product.name}
                            </h1>
                            <p className="text-2xl text-black">{product.price}</p>
                        </div>

                        {/* Description */}
                        {product.description && (
                            <p className="text-gray-600 leading-relaxed text-md">
                                {product.description}
                            </p>
                        )}

                        {/* Size Selection */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div>
                                <h3 className="font-bold mb-3 text-lg">Chọn size:</h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-6 py-3 rounded-lg border-2 font-semibold transition-all ${selectedSize === size
                                                    ? 'border-black bg-black text-white'
                                                    : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Color Selection */}
                        {product.colors && product.colors.length > 0 && (
                            <div>
                                <h3 className="font-bold mb-3 text-lg">Chọn màu:</h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`px-6 py-3 rounded-lg border-2 font-semibold transition-all ${selectedColor === color
                                                    ? 'border-black bg-black text-white'
                                                    : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div>
                            <h3 className="font-bold mb-3 text-lg">Số lượng:</h3>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-gray-400 font-bold text-xl transition-colors"
                                >
                                    −
                                </button>
                                <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-12 h-12 rounded-lg border-2 border-gray-300 hover:border-gray-400 font-bold text-xl transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Stock Info */}
                        {product.stock !== undefined && (
                            <div className="flex items-center gap-2">
                                <div
                                    className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                                        }`}
                                ></div>
                                <span className="text-sm font-semibold">
                                    {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
                                </span>
                            </div>
                        )}

                        {/* Add to Cart Button */}
                        <button
                            disabled={!product.stock || product.stock === 0}
                            className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {product.stock && product.stock > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                        </button>

                        {/* Buy Now Button */}
                        <button
                            disabled={!product.stock || product.stock === 0}
                            className="w-full py-4 border-2 border-black text-black rounded-xl font-bold text-lg hover:bg-black hover:text-white transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            Mua ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
