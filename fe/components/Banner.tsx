'use client';

import { useEffect, useState } from 'react';

export default function Banner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <section
            id="home"
            className="relative h-[500px] flex items-center justify-center overflow-hidden"
        >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 opacity-90">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920')] bg-cover bg-center mix-blend-overlay opacity-40"></div>
            </div>

            {/* Animated shapes */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

            {/* Content */}
            <div
                className={`relative z-10 text-center px-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                    }`}
            >
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-4 tracking-wider drop-shadow-2xl">
                    JUST DO IT<span className="text-yellow-300">.</span>
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-white font-medium mb-6 drop-shadow-lg">
                    Khám phá bộ sưu tập Nike mới nhất
                </p>
                <button className="btn-primary text-base px-10 py-3 shadow-2xl hover:shadow-white/20">
                    Mua sắm ngay
                </button>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
            </div>
        </section>
    );
}
