'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ProductCardProps {
    id: number;
    name: string;
    price: string;
    image: string;
    delay?: number;
}

export default function ProductCard({ id, name, price, image, delay = 0 }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link href={`/products/${id}`}>
            <div
                className="card-hover bg-white rounded-2xl shadow-lg p-5 flex flex-col items-center animate-fadeIn cursor-pointer"
                style={{ animationDelay: `${delay}ms` }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Product Image */}
                <div className="relative w-full h-40 mb-4 overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200">
                    <Image
                        src={image}
                        alt={name}
                        fill
                        className={`object-contain p-3 transition-transform duration-500 ${isHovered ? 'scale-110 rotate-6' : 'scale-100 rotate-0'
                            }`}
                    />

                    {/* Hover overlay */}
                    <div
                        className={`absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
                            }`}
                    ></div>
                </div>

                {/* Product Info */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
                    {name}
                </h3>
                <p className="text-xl font-black gradient-text mb-4">
                    {price}
                </p>

                {/* Buy Button */}
                <button
                    className={`w-full btn-primary py-2.5 text-sm transition-all duration-300 ${isHovered ? 'scale-105' : 'scale-100'
                        }`}
                >
                    Xem chi tiết
                </button>

                {/* Decorative element */}
                <div
                    className={`absolute top-3 right-3 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center transition-all duration-300 ${isHovered ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                        }`}
                >
                    <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M9 5l7 7-7 7"></path>
                    </svg>
                </div>
            </div>
        </Link>
    );
}
