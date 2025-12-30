import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import PaymentModal from '../../components/PaymentModal';
import Toast from '../../components/Toast';
import { useCart } from '../../context/CartContext';
import dbConnect from '../../lib/db';
import Product from '../../models/Product';
import Link from 'next/link';

export default function CategoryPage({ products, category }) {
    const { addToCart } = useCart();
    const router = useRouter();
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [toastMessage, setToastMessage] = useState('');

    // Capitalize category name for display
    const categoryTitle = category ? category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ') : 'Category';

    const handleAddToCart = (product) => {
        addToCart(product);
        setToastMessage(`${product.name} added to cart successfully!`);
    };

    const handleBuyClick = (product) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert('Please login to purchase items.');
            router.push('/login');
            return;
        }
        setSelectedProduct(product);
        setShowPaymentModal(true);
    };

    const handleOrderComplete = async (paymentMethod, transactionId = null) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !selectedProduct) return;

        try {
            const res = await fetch('/api/orders/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    customerDetails: { name: user.name, email: user.email },
                    items: [selectedProduct],
                    total: selectedProduct.price,
                    paymentMethod: paymentMethod,
                    transactionId
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setShowPaymentModal(false);
                setSelectedProduct(null);
                router.push('/profile');
            } else {
                alert('Failed to place order.');
                setShowPaymentModal(false);
            }
        } catch (error) {
            console.error('Order error:', error);
            alert('Something went wrong.');
            setShowPaymentModal(false);
        }
    };

    return (
        <Layout title={`${categoryTitle} - Arshi Sales`}>
            <Toast message={toastMessage} onClose={() => setToastMessage('')} />

            <div className="bg-navy py-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10"></div>
                <h1 className="text-5xl font-display text-white relative z-10 mb-2">{categoryTitle}</h1>
                <p className="text-yellow relative z-10 text-lg uppercase tracking-widest font-bold">Exclusive Collection</p>
            </div>

            <div className="min-h-screen bg-background relative">
                <div className="container mx-auto px-6 py-16">

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                        <Link href="/" className="hover:text-navy">Home</Link>
                        <span>/</span>
                        <span className="text-navy font-bold">{categoryTitle}</span>
                    </div>

                    {products.length === 0 ? (
                        <div className="text-center py-20">
                            <h2 className="text-2xl font-bold text-gray-400">No products found in this category.</h2>
                            <Link href="/" className="mt-4 inline-block text-navy font-bold hover:underline">Return to Home</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {products.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onAddToCart={handleAddToCart}
                                    onBuyNow={handleBuyClick}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showPaymentModal && selectedProduct && (
                <PaymentModal
                    product={selectedProduct}
                    onClose={() => setShowPaymentModal(false)}
                    onOrderComplete={handleOrderComplete}
                />
            )}
        </Layout>
    );
}

export async function getServerSideProps(context) {
    const { slug } = context.params;
    await dbConnect();

    // Search case-insensitive
    // Because slug is 'tobacco', but category in DB might be 'Tobacco'
    const products = await Product.find({
        category: { $regex: new RegExp(`^${slug}$`, 'i') }
    }).lean();

    return {
        props: {
            products: products.map(p => ({
                ...p,
                _id: p._id.toString(),
                createdAt: p.createdAt ? p.createdAt.toISOString() : null,
                updatedAt: p.updatedAt ? p.updatedAt.toISOString() : null,
            })),
            category: slug
        },
    };
}
