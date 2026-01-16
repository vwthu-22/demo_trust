'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-black/95 backdrop-blur-md shadow-lg py-2'
                : 'bg-black py-3'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2 animate-slideInLeft">
                    <div className="relative w-9 h-9">
                        <Image
                            src="https://1000logos.net/wp-content/uploads/2017/03/Nike-Logo.png"
                            alt="Nike Logo"
                            fill
                            sizes="36px"
                            className="object-contain"
                            priority
                        />
                    </div>
                    <span className="text-white text-lg font-bold tracking-wide hidden sm:block">
                        NAISU
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex items-center gap-6 animate-slideInRight">
                    <a
                        href="#home"
                        className="text-white font-semibold text-sm hover:text-gray-300 transition-colors relative group"
                    >
                        Trang chủ
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                    </a>
                    <a
                        href="#products"
                        className="text-white font-semibold text-sm hover:text-gray-300 transition-colors relative group"
                    >
                        Sản phẩm
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                    </a>
                    <a
                        href="#contact"
                        className="text-white font-semibold text-sm hover:text-gray-300 transition-colors relative group"
                    >
                        Liên hệ
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                    </a>
                </nav>
            </div>
        </header>
    );
}
