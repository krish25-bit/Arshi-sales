import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import PaymentModal from '../components/PaymentModal';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPayment, setShowPayment] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Phone update state
    const [showChangePhone, setShowChangePhone] = useState(false);
    const [newPhone, setNewPhone] = useState('');


    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
            window.location.href = '/login';
            return;
        }
        setUser(storedUser);
        fetchOrders(storedUser.id);
    }, []);

    const fetchOrders = (userId) => {
        fetch(`/api/orders/my-orders?userId=${userId}`)
            .then(res => res.json())
            .then(data => {
                setOrders(data.orders);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const handlePayClick = (order) => {
        setSelectedOrder(order);
        setShowPayment(true);
    };

    const handlePaymentComplete = async (method, transactionId = null) => {
        try {
            const res = await fetch('/api/user/pay-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    orderId: selectedOrder.id,
                    paymentMethod: method,
                    transactionId
                }),
            });

            if (res.ok) {
                alert('Payment Successful! Dues cleared.');
                setShowPayment(false);
                fetchOrders(user.id); // Refresh data
            } else {
                alert('Payment failed.');
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert('Something went wrong.');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert("New passwords don't match!");
            return;
        }

        try {
            const res = await fetch('/api/user/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword
                }),
            });

            const data = await res.json();

            if (res.ok) {
                alert('Password updated successfully!');
                setShowChangePassword(false);
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                alert(data.message || 'Failed to update password');
            }
        } catch (error) {
            console.error('Change password error:', error);
            alert('Something went wrong.');
        }
    };

    const handleChangePhone = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/user/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    phone: newPhone
                }),
            });

            const data = await res.json();

            if (res.ok) {
                alert('Phone number updated successfully!');
                setShowChangePhone(false);
                // Update local user state and localStorage
                const updatedUser = { ...user, phone: newPhone };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                // Optional: Dispatch event if needed
            } else {
                alert(data.message || 'Failed to update phone');
            }
        } catch (error) {
            console.error('Update phone error:', error);
            alert('Something went wrong.');
        }
    };

    if (loading) return <Layout><div className="text-center mt-20">Loading Profile...</div></Layout>;

    return (
        <Layout title="My Profile - Arshi Sales">
            {showPayment && selectedOrder && (
                <PaymentModal
                    amount={(() => {
                        // Calculate outstanding balance
                        let balance = 0;
                        orders.forEach(order => {
                            // Use finalTotal if available, else fallback to subtotal/total logic
                            // But actually, simpler: The debit for this transaction is finalTotal || total.
                            // However, legacy logic prioritized subtotal. Let's prioritize finalTotal -> subtotal -> total.
                            const debit = (order.finalTotal !== undefined && order.finalTotal !== null)
                                ? order.finalTotal
                                : ((order.subtotal !== undefined && order.subtotal !== null) ? order.subtotal : order.total);

                            balance -= debit;
                            if (order.paymentStatus === 'paid') {
                                // If paid, we credit back the full amount of the order (finalTotal || total)
                                const credit = (order.finalTotal !== undefined && order.finalTotal !== null) ? order.finalTotal : order.total;
                                balance += credit;
                            }
                        });
                        const outstanding = Math.abs(balance);
                        // If outstanding is less than order total, pay outstanding.
                        const currentOrderTotal = (selectedOrder.finalTotal !== undefined && selectedOrder.finalTotal !== null) ? selectedOrder.finalTotal : selectedOrder.total;
                        return outstanding < currentOrderTotal ? outstanding : currentOrderTotal;
                    })()}
                    onClose={() => setShowPayment(false)}
                    onPaymentComplete={handlePaymentComplete}
                />
            )}

            {showChangePassword && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Change Password</h2>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                                <input
                                    type="password"
                                    required
                                    className="mt-1 block w-full border rounded-md p-2"
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">New Password</label>
                                <input
                                    type="password"
                                    required
                                    className="mt-1 block w-full border rounded-md p-2"
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                <input
                                    type="password"
                                    required
                                    className="mt-1 block w-full border rounded-md p-2"
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowChangePassword(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showChangePhone && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">Change Phone Number</h2>
                        <form onSubmit={handleChangePhone} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">New Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    className="mt-1 block w-full border rounded-md p-2"
                                    value={newPhone}
                                    placeholder="+91 98765 43210"
                                    onChange={(e) => setNewPhone(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowChangePhone(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-yellow text-navy font-bold rounded hover:bg-yellow/80"
                                >
                                    Update Phone
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">My Profile</h1>

                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">Account Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Name</label>
                            <p className="text-lg font-semibold">{user.name}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Email</label>
                            <p className="text-lg font-semibold">{user.email}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500">Phone</label>
                            <div className="flex items-center gap-2">
                                <p className="text-lg font-semibold">{user.phone || 'N/A'}</p>
                                <button
                                    onClick={() => { setNewPhone(user.phone || ''); setShowChangePhone(true); }}
                                    className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-blue-600 font-bold"
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 border-t pt-4">
                        <button
                            onClick={() => setShowChangePassword(true)}
                            className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                        >
                            Change Password
                        </button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">My Wallet</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-green-50 p-4 rounded border border-green-200">
                            <p className="text-sm text-green-800 font-bold">Total Spent</p>
                            <p className="text-3xl font-bold text-green-600">
                                ₹{orders.reduce((sum, order) => order.paymentStatus === 'paid' ? sum + order.total : sum, 0)}
                            </p>
                            <p className="text-xs text-green-700 mt-1">Lifetime purchases</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded border border-blue-200">
                            <p className="text-sm text-blue-800 font-bold">Wallet Balance</p>
                            <p className="text-3xl font-bold text-blue-600">
                                {(() => {
                                    let balance = 0;
                                    orders.forEach(order => {
                                        const debit = (order.finalTotal !== undefined && order.finalTotal !== null)
                                            ? order.finalTotal
                                            : ((order.subtotal !== undefined && order.subtotal !== null) ? order.subtotal : order.total);

                                        balance -= debit;

                                        if (order.paymentStatus === 'paid') {
                                            const credit = (order.finalTotal !== undefined && order.finalTotal !== null) ? order.finalTotal : order.total;
                                            balance += credit;
                                        }
                                    });

                                    if (balance > 0) return <span className="text-green-600">+₹{balance} (Credit)</span>;
                                    if (balance < 0) return <span className="text-red-600">-₹{Math.abs(balance)} (Due)</span>;
                                    return <span className="text-gray-600">₹0</span>;
                                })()}
                            </p>
                            <p className="text-xs text-blue-700 mt-1">Net payable/receivable</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2">My Passbook (Ledger)</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-3 border">Date</th>
                                    <th className="p-3 border">Description</th>
                                    <th className="p-3 border text-right">Debit (-)</th>
                                    <th className="p-3 border text-right">Credit (+)</th>
                                    <th className="p-3 border text-right">Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(() => {
                                    let balance = 0;
                                    const transactions = [];

                                    // Create transactions from orders
                                    // Sort by date ascending to calculate running balance correctly
                                    const sortedOrders = [...orders].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

                                    sortedOrders.forEach(order => {
                                        // 1. Debit: Purchase
                                        const debitAmount = (order.finalTotal !== undefined && order.finalTotal !== null)
                                            ? order.finalTotal
                                            : ((order.subtotal !== undefined && order.subtotal !== null) ? order.subtotal : order.total);

                                        balance -= debitAmount;
                                        // Only show debit entry if there is a debit amount (Manual Credit has 0 debit)
                                        if (debitAmount > 0) {
                                            transactions.push({
                                                id: order.id + '_debit',
                                                date: order.createdAt,
                                                desc: order.type === 'manual' ? (order.items[0]?.name || 'Manual Debit') : `Order #${order.id.slice(-4)} Purchase`,
                                                debit: debitAmount,
                                                credit: 0,
                                                balance: balance
                                            });
                                        }

                                        // 2. Credit: Payment
                                        if (order.paymentStatus === 'paid') {
                                            const creditAmount = (order.finalTotal !== undefined && order.finalTotal !== null) ? order.finalTotal : order.total;
                                            balance += creditAmount;
                                            transactions.push({
                                                id: order.id + '_credit',
                                                date: order.createdAt,
                                                desc: order.type === 'manual' ? (order.items[0]?.name || 'Manual Credit') : `Payment for Order #${order.id.slice(-4)}`,
                                                debit: 0,
                                                credit: creditAmount,
                                                balance: balance
                                            });
                                        }
                                    });

                                    // Show newest first
                                    return transactions.reverse().map(tx => (
                                        <tr key={tx.id} className="border-b hover:bg-gray-50">
                                            <td className="p-3 border text-sm">{new Date(tx.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                                            <td className="p-3 border text-sm">{tx.desc}</td>
                                            <td className="p-3 border text-right text-red-600">{tx.debit > 0 ? `₹${tx.debit}` : '-'}</td>
                                            <td className="p-3 border text-right text-green-600">{tx.credit > 0 ? `₹${tx.credit}` : '-'}</td>
                                            <td className={`p-3 border text-right font-bold ${tx.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                {tx.balance < 0 ? `-₹${Math.abs(tx.balance)}` : `₹${tx.balance}`}
                                            </td>
                                        </tr>
                                    ));
                                })()}
                            </tbody>
                        </table>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-6 text-gray-800">Order History</h2>

                {orders.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">You haven't placed any orders yet.</p>
                        <a href="/#products" className="inline-block mt-4 text-yellow-600 hover:text-yellow-700 font-bold">Start Shopping &rarr;</a>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
                                <div className="bg-gray-50 px-6 py-4 border-b flex flex-col md:flex-row justify-between items-center">
                                    <div>
                                        <span className="font-bold text-gray-700">Order #{order.id.slice(-4)}</span>
                                        <span className="text-sm text-gray-500 ml-2">
                                            {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <div className="mt-2 md:mt-0 flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                        {order.paymentStatus === 'pending' && (
                                            <button
                                                onClick={() => handlePayClick(order)}
                                                className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1 px-3 rounded shadow animate-pulse"
                                            >
                                                Pay Now
                                            </button>
                                        )}
                                        {order.paymentStatus === 'carried_forward' && (
                                            <span className="text-xs text-gray-500 italic border px-2 py-1 rounded bg-gray-100">
                                                Consolidated in later order
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between mb-4">
                                        <div className="flex-1">
                                            <h4 className="font-semibold mb-2">Items</h4>
                                            <ul className="space-y-1">
                                                {order.items.map((item, idx) => (
                                                    <li key={idx} className="text-sm text-gray-600">
                                                        {item.name} - ₹{(item.updatedPrice !== undefined && item.updatedPrice !== null) ? item.updatedPrice : item.price}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="mt-4 md:mt-0 md:text-right">
                                            <p className="text-sm text-gray-500">Payment Status: <span className={`font-bold ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-500'}`}>{order.paymentStatus || 'Pending'}</span></p>
                                            <p className="text-2xl font-bold text-gray-800 mt-2">
                                                ₹{(order.finalTotal !== undefined && order.finalTotal !== null) ? order.finalTotal : order.total}
                                            </p>

                                            {/* Dynamic Outstanding Display */}
                                            {order.paymentStatus !== 'paid' && (
                                                (() => {
                                                    let balance = 0;
                                                    orders.forEach(o => {
                                                        const debit = (o.finalTotal !== undefined && o.finalTotal !== null)
                                                            ? o.finalTotal
                                                            : ((o.subtotal !== undefined && o.subtotal !== null) ? o.subtotal : o.total);
                                                        balance -= debit;
                                                        if (o.paymentStatus === 'paid') {
                                                            const credit = (o.finalTotal !== undefined && o.finalTotal !== null) ? o.finalTotal : o.total;
                                                            balance += credit;
                                                        }
                                                    });
                                                    const globalOutstanding = Math.abs(balance);
                                                    const currentOrderTotal = (order.finalTotal !== undefined && order.finalTotal !== null) ? order.finalTotal : order.total;

                                                    // Only show if global outstanding is LESS than this order total (meaning part was paid)
                                                    if (globalOutstanding < currentOrderTotal && balance < 0) {
                                                        return (
                                                            <p className="text-sm font-bold text-green-600 mt-1">
                                                                (Outstanding: ₹{globalOutstanding})
                                                            </p>
                                                        );
                                                    }
                                                    return null;
                                                })()
                                            )}

                                            {order.previousPendingAmount > 0 && (
                                                <p className="text-xs text-red-500 mt-1">Includes ₹{order.previousPendingAmount} past dues</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
