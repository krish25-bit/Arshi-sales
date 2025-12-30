import { useState } from 'react';
import Layout from '../components/Layout';
import { useCart } from '../context/CartContext';
import PaymentModal from '../components/PaymentModal';
import Link from 'next/link';

export default function Cart() {
    const { cart, removeFromCart, getCartTotal, clearCart, updateQuantity } = useCart();
    const [showPayment, setShowPayment] = useState(false);

    const handleCheckoutClick = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert('Please login to checkout.');
            window.location.href = '/login';
            return;
        }
        if (cart.length === 0) {
            alert('Your cart is empty.');
            return;
        }
        setShowPayment(true);
    };

    const processOrder = async (method, transactionId = null) => {
        const user = JSON.parse(localStorage.getItem('user'));

        try {
            const res = await fetch('/api/orders/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    customerDetails: { name: user.name, email: user.email },
                    items: cart,
                    total: getCartTotal(),
                    paymentMethod: method,
                    transactionId
                }),
            });

            if (res.ok) {
                clearCart();
                setShowPayment(false);
                // alert('Order placed successfully!'); // Modal handles success UI
                window.location.href = '/profile'; // Redirect to profile to see order
            } else {
                alert('Failed to place order.');
            }
        } catch (error) {
            console.error('Order error:', error);
            alert('Something went wrong.');
        }
    };

    return (
        <Layout title="Shopping Cart - Arshi Sales">
            {showPayment && (
                <PaymentModal
                    amount={getCartTotal()}
                    onClose={() => setShowPayment(false)}
                    onPaymentComplete={processOrder}
                />
            )}

            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Shopping Cart</h1>

                {cart.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-xl text-gray-600 mb-4">Your cart is empty.</p>
                        <Link href="/" className="text-yellow-600 font-bold hover:underline">Continue Shopping</Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="p-6">
                            {cart.map(item => (
                                <div key={item.id} className="flex items-center justify-between border-b py-4 last:border-0">
                                    <div className="flex items-center">
                                        <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center mr-4">
                                            <span className="text-2xl">📦</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{item.name}</h3>
                                            <div className="flex items-center mt-1">
                                                <span className="text-gray-500 text-sm mr-2">Quantity:</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded-l text-xs"
                                                >
                                                    -
                                                </button>
                                                <span className="bg-gray-100 text-gray-800 font-semibold py-1 px-3 text-sm border-t border-b border-gray-200">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded-r text-xs"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="font-bold text-lg">₹{item.price * item.quantity}</span>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-500 hover:text-red-700 font-medium"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-gray-50 p-6 flex justify-between items-center">
                            <div>
                                <p className="text-gray-600">Total Amount</p>
                                <p className="text-3xl font-bold text-green-600">₹{getCartTotal()}</p>
                            </div>
                            <button
                                onClick={handleCheckoutClick}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg shadow transition"
                            >
                                Checkout Now
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
