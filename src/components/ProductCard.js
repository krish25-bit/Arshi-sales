import Link from 'next/link';

import { useState } from 'react';

export default function ProductCard({ product, onBuy, onAddToCart }) {
    const [imageError, setImageError] = useState(false);

    return (
        <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-[0_10px_40px_-10px_rgba(31,31,31,0.2)] transition-all duration-500 border border-gray-100 hover:border-yellow/50">
            {/* Image Container */}
            <div className="relative h-48 md:h-64 overflow-hidden bg-gray-100">
                {!imageError && product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-navy via-gray-800 to-black text-yellow p-6 relative overflow-hidden">
                        {/* Abstract Pattern overlay */}
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

                        {/* Stylish Placeholder Icon (Leaf/Logo) */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mb-3 drop-shadow-lg opacity-90 text-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span className="text-xs font-bold tracking-[0.3em] uppercase text-white/80 border-t border-white/20 pt-2 mt-1">Arshi Premium</span>
                    </div>
                )}

                {/* Overlay with Actions */}
                <div className="absolute inset-0 flex items-center justify-center gap-3 transition-opacity duration-300 backdrop-blur-none
                    opacity-100 bg-black/10 md:bg-navy/60 md:opacity-0 md:group-hover:opacity-100 md:backdrop-blur-[2px]">
                    <button
                        onClick={() => onBuy(product)}
                        className="bg-yellow text-navy font-bold py-2.5 px-6 rounded-full transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-300 hover:bg-white hover:text-navy shadow-xl hover:shadow-2xl hover:-translate-y-1"
                    >
                        Buy Now
                    </button>
                    <button
                        onClick={() => onAddToCart(product)}
                        className="bg-white/20 text-white p-2.5 rounded-full transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-all duration-300 delay-75 hover:bg-white hover:text-navy shadow-lg backdrop-blur-md border border-white/50"
                        title="Add to Cart"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="mb-3">
                    <h3 className="text-lg font-bold text-navy font-display tracking-tight group-hover:text-yellow transition-colors duration-300 truncate">
                        {product.name}
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-brand-orange uppercase tracking-wider font-semibold">Premium Series</p>
                        <span className="text-navy font-bold text-lg">
                            ₹{product.price}
                        </span>
                    </div>
                </div>

                <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed min-h-[2.5em]">
                    {product.description}
                </p>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> In Stock
                    </span>
                    <span>Free Shipping</span>
                </div>
            </div>
        </div>
    );
}
