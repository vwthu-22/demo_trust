'use client';

import ProductCard from './ProductCard';

const products = [
    {
        id: 1,
        name: 'Nike Air Max 270',
        price: '3.500.000₫',
        image: 'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,q_auto:eco/2b0b6e2c-2e2e-4e2e-8e2e-2e2e2e2e2e2e/air-max-270-shoes-KkLcGR.png',
    },
    {
        id: 2,
        name: 'Nike Air Force 1',
        price: '2.900.000₫',
        image: 'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,q_auto:eco/1b2b6e2c-2e2e-4e2e-8e2e-2e2e2e2e2e2e/air-force-1-07-shoes-WrLlWX.png',
    },
    {
        id: 3,
        name: 'Nike Dunk Low',
        price: '3.200.000₫',
        image: 'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,q_auto:eco/3b0b6e2c-2e2e-4e2e-8e2e-2e2e2e2e2e2e/dunk-low-shoes-7MmlFJ.png',
    },
    {
        id: 4,
        name: 'Nike React Infinity',
        price: '4.100.000₫',
        image: 'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,q_auto:eco/i1-8d7a8350-0b5c-4d4e-8e2e-2e2e2e2e2e2e/react-infinity-run-flyknit-3-running-shoe-5MmlFJ.png',
    },
    {
        id: 5,
        name: 'Nike Blazer Mid',
        price: '3.800.000₫',
        image: 'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,q_auto:eco/i1-5e7a8350-0b5c-4d4e-8e2e-2e2e2e2e2e2e/blazer-mid-77-vintage-shoe-nw30B2.png',
    },
    {
        id: 6,
        name: 'Nike Pegasus 40',
        price: '3.600.000₫',
        image: 'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,q_auto:eco/i1-6e7a8350-0b5c-4d4e-8e2e-2e2e2e2e2e2e/pegasus-40-running-shoe-5MmlFJ.png',
    },
];

export default function Products() {
    return (
        <section id="products" className="py-16 px-6 bg-gradient-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-6 animate-fadeIn">
                    <h2 className="text-2xl md:text-3xl font-black mb-2 gradient-text">
                        Sản phẩm nổi bật
                    </h2>
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
