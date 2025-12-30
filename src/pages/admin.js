import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

import OrderDetailsModal from '../components/admin/OrderDetailsModal';
import UserDetailsModal from '../components/admin/UserDetailsModal';

export default function AdminDashboard() {
    const [data, setData] = useState({ users: [], orders: [], products: [] });
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    // Assuming useSession and useRouter are imported elsewhere or will be added by the user
    // const { data: session } = useSession();
    // const router = useRouter();
    useEffect(() => {
        // Auth Check
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'admin') {
            window.location.href = '/login';
            return;
        }

        fetchData();
    }, []);

    const fetchData = () => {
        fetch('/api/admin/get-all?t=' + Date.now())
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    };

    const handleStatusUpdate = async (orderId, newStatus, type = 'status') => {
        try {
            const body = { orderId };
            if (type === 'status') body.status = newStatus;
            if (type === 'payment') body.paymentStatus = newStatus;

            const res = await fetch('/api/admin/update-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                alert('Order updated!');
                fetchData(); // Refresh data
            } else {
                alert('Failed to update order.');
            }
        } catch (error) {
            console.error('Update error:', error);
        }
    };

    const handleDeleteAll = async () => {
        if (!confirm('ARE YOU SURE? This will delete ALL order history permanently!')) return;
        if (!confirm('Really? This cannot be undone.')) return;

        try {
            const res = await fetch('/api/admin/delete-all-orders', { method: 'DELETE' });
            if (res.ok) {
                alert('All orders deleted.');
                fetchData();
            } else {
                alert('Failed to delete orders.');
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Something went wrong.');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const res = await fetch('/api/admin/delete-product', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });

            if (res.ok) {
                alert('Product deleted.');
                fetchData();
            } else {
                alert('Failed to delete product.');
            }
        } catch (error) {
            console.error(error);
            alert('Error deleting product');
        }
    };

    if (loading) return (
        <Layout>
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow"></div>
            </div>
        </Layout>
    );

    return (
        <Layout title="Admin Dashboard - Arshi Sales">
            <div className="min-h-screen bg-background pb-20">
                {/* Header Stats Strip */}
                <div className="bg-navy pt-10 pb-20 rounded-b-[3rem] shadow-xl mb-[-4rem] relative z-10">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                            <div>
                                <h1 className="text-4xl font-display text-white mb-2">Dashboard</h1>
                                <p className="text-gray-400">Welcome back, Admin</p>
                            </div>
                            <button
                                onClick={handleDeleteAll}
                                className="mt-4 md:mt-0 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/50 font-bold py-3 px-6 rounded-full transition-all duration-300 backdrop-blur-md"
                            >
                                ⚠️ Reset All Data
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Stat Card 1 */}
                            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-white shadow-lg">
                                <div className="text-yellow text-sm font-bold uppercase tracking-wider mb-1">Total Revenue</div>
                                <div className="text-4xl font-display mb-2">
                                    ₹{data.orders.reduce((sum, order) => order.paymentStatus === 'paid' ? sum + order.total : sum, 0).toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-400">Cash in hand (Paid Orders)</div>
                            </div>

                            {/* Stat Card 2 */}
                            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-white shadow-lg">
                                <div className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-1">Pending Sales</div>
                                <div className="text-4xl font-display mb-2">
                                    ₹{data.orders.reduce((sum, order) => order.paymentStatus === 'paid' ? sum : sum + (order.subtotal || 0), 0).toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-400">Potential revenue</div>
                            </div>

                            {/* Stat Card 3 */}
                            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
                                <div className="absolute right-0 top-0 w-24 h-24 bg-red-500/20 blur-3xl rounded-full -mr-10 -mt-10"></div>
                                <div className="text-red-400 text-sm font-bold uppercase tracking-wider mb-1">Outstanding Dues</div>
                                <div className="text-4xl font-display mb-2">
                                    {(() => {
                                        let totalDues = 0;
                                        data.users.forEach(user => {
                                            const userOrders = data.orders.filter(o => o.userId === user.id);
                                            let balance = 0;
                                            userOrders.forEach(order => {
                                                const debit = (order.subtotal !== undefined && order.subtotal !== null) ? order.subtotal : order.total;
                                                balance -= debit;
                                                if (order.paymentStatus === 'paid') balance += order.total;
                                            });
                                            if (balance < 0) totalDues += Math.abs(balance);
                                        });
                                        return `₹${totalDues.toLocaleString()}`;
                                    })()}
                                </div>
                                <div className="text-xs text-gray-400">Total Pending Payments</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-6 pt-20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* LEFT COLUMN: Actions & Users */}
                        <div className="space-y-8">
                            {/* Add Product */}
                            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                                <h2 className="text-2xl font-display text-navy mb-6">Add Product</h2>
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.target);
                                    const payload = {
                                        name: formData.get('name'),
                                        price: formData.get('price'),
                                        image: formData.get('image'),
                                        description: formData.get('description'),
                                        category: formData.get('category')
                                    };

                                    if (!payload.name || !payload.price) return alert('Name and Price are required');

                                    try {
                                        const res = await fetch('/api/admin/add-product', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify(payload)
                                        });
                                        if (res.ok) {
                                            alert('Product added successfully!');
                                            e.target.reset();
                                            fetchData();
                                        } else {
                                            const err = await res.json();
                                            alert('Failed: ' + err.message);
                                        }
                                    } catch (error) {
                                        console.error(error);
                                        alert('Error adding product');
                                    }
                                }} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Category</label>
                                        <select name="category" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-yellow focus:ring-1 focus:ring-yellow transition-all">
                                            <option value="Tobacco">Tobacco</option>
                                            <option value="Bidi">Bidi</option>
                                            <option value="Pan Masala">Pan Masala</option>
                                            <option value="Accessories">Accessories</option>
                                            <option value="Others">Others</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Name</label>
                                        <input type="text" name="name" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-yellow focus:ring-1 focus:ring-yellow transition-all" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Price (₹)</label>
                                            <input type="number" name="price" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-yellow transition-all" required />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Image URL</label>
                                            <input type="text" name="image" placeholder="/images/..." className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-yellow transition-all" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Description</label>
                                        <input type="text" name="description" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-yellow transition-all" />
                                    </div>
                                    <button type="submit" className="w-full bg-navy text-white font-bold py-3 rounded-lg hover:bg-yellow hover:text-navy transition-all duration-300 shadow-lg">
                                        + Add Product
                                    </button>
                                </form>
                            </div>

                            {/* Registered Users */}
                            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                                <h2 className="text-2xl font-display text-navy mb-6">Users ({data.users.length})</h2>
                                <div className="max-h-96 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                    {data.users.map(user => (
                                        <div
                                            key={user.id}
                                            className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-4 cursor-pointer hover:bg-blue-50/50 hover:border-yellow transition-all"
                                            onClick={() => setSelectedUser(user)}
                                        >
                                            <div className="h-10 w-10 rounded-full bg-navy text-yellow flex items-center justify-center font-bold text-lg">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-navy text-sm">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* CENTER/RIGHT COLUMN: Orders & Ledger */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Manual Ledger */}
                            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                                <h2 className="text-2xl font-display text-navy mb-6">Quick Ledger Entry</h2>
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.target);
                                    const payload = {
                                        userId: formData.get('userId'),
                                        type: formData.get('type'),
                                        amount: formData.get('amount'),
                                        description: formData.get('description')
                                    };

                                    if (!payload.userId) return alert('Please select a user');

                                    try {
                                        const res = await fetch('/api/admin/manual-transaction', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify(payload)
                                        });
                                        if (res.ok) {
                                            alert('Transaction added!');
                                            e.target.reset();
                                            fetchData();
                                        } else {
                                            alert('Failed to add transaction');
                                        }
                                    } catch (err) {
                                        console.error(err);
                                        alert('Error occurred');
                                    }
                                }} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                    <div className="md:col-span-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">User</label>
                                        <select name="userId" className="w-full bg-gray-50 border-gray-200 rounded-lg p-3 text-sm">
                                            <option value="">Select User</option>
                                            {data.users.map(u => (
                                                <option key={u.id} value={u.id}>{u.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Action</label>
                                        <select name="type" className="w-full bg-gray-50 border-gray-200 rounded-lg p-3 text-sm">
                                            <option value="credit">Credit (+)</option>
                                            <option value="debit">Debit (-)</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Amount</label>
                                        <input type="number" name="amount" placeholder="0" className="w-full bg-gray-50 border-gray-200 rounded-lg p-3 text-sm" required />
                                    </div>
                                    <div className="md:col-span-1">
                                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-sm transition-all shadow">
                                            Update Ledger
                                        </button>
                                    </div>
                                    <div className="md:col-span-4 mt-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Description</label>
                                        <input type="text" name="description" placeholder="Reason (e.g. Previous Balance, Cash Payment)" className="w-full bg-gray-50 border-gray-200 rounded-lg p-3 text-sm" required />
                                    </div>
                                </form>
                            </div>

                            {/* Recent Orders Table */}
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                                <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                                    <h2 className="text-2xl font-display text-navy">Recent Orders</h2>
                                    <span className="bg-yellow/20 text-yellow-800 px-4 py-1 rounded-full text-xs font-bold uppercase">{data.orders.length} Orders</span>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                            <tr>
                                                <th className="p-6 font-bold">Order ID</th>
                                                <th className="p-6 font-bold">Customer</th>
                                                <th className="p-6 font-bold">Total</th>
                                                <th className="p-6 font-bold">Status</th>
                                                <th className="p-6 font-bold">Payment</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {data.orders.slice().reverse().map(order => (
                                                <tr
                                                    key={order.id}
                                                    className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                                                    onClick={() => setSelectedOrder(order)}
                                                >
                                                    <td className="p-6">
                                                        <span className="font-mono text-sm font-bold text-navy">#{order.id.slice(-4)}</span>
                                                        <div className="text-xs text-gray-400 mt-1">
                                                            {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                            <span className="block text-[10px] uppercase tracking-wide opacity-70">
                                                                {new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'short' })} • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <div className="font-bold text-navy">{order.customerDetails?.name || 'Unknown'}</div>
                                                        <div className="text-xs text-gray-500">{order.items.length} items</div>
                                                    </td>
                                                    <td className="p-6">
                                                        <div className="font-bold text-navy text-lg">
                                                            ₹{(order.finalTotal !== undefined && order.finalTotal !== null) ? order.finalTotal : order.total}
                                                        </div>
                                                        {order.previousPendingAmount > 0 && (
                                                            <div className="text-xs text-red-500 font-medium">+ dues</div>
                                                        )}
                                                    </td>
                                                    <td className="p-6">
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => handleStatusUpdate(order.id, e.target.value, 'status')}
                                                            className="bg-gray-100 border-none text-xs font-bold rounded-lg py-2 px-3 focus:ring-1 focus:ring-yellow cursor-pointer"
                                                        >
                                                            <option value="pending">⏳ Pending</option>
                                                            <option value="shipped">🚚 Shipped</option>
                                                            <option value="delivered">✅ Delivered</option>
                                                            <option value="cancelled">❌ Cancelled</option>
                                                        </select>
                                                    </td>
                                                    <td className="p-6">
                                                        <select
                                                            value={order.paymentStatus || 'pending'}
                                                            onChange={(e) => handleStatusUpdate(order.id, e.target.value, 'payment')}
                                                            className={`border-none text-xs font-bold rounded-lg py-2 px-3 cursor-pointer ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                                                                order.paymentStatus === 'verification_pending' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                                                }`}
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="verification_pending">Verify UPI</option>
                                                            <option value="paid">Paid</option>
                                                            <option value="failed">Failed</option>
                                                        </select>
                                                        {order.transactionId && (
                                                            <div className="mt-2 text-xs font-mono text-blue-500 bg-blue-50 px-2 py-1 rounded inline-block">
                                                                {order.transactionId}
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Products List (Compact) */}
                            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                                <h2 className="text-2xl font-display text-navy mb-6">Product Inventory</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {data.products?.map(product => (
                                        <div key={product.id} className="group relative border border-gray-200 rounded-xl p-4 flex gap-4 items-center hover:border-yellow transition-colors bg-white">
                                            <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                                {product.image ? (
                                                    <img src={product.image} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 bg-gray-200">No Img</div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-navy truncate">{product.name}</h4>
                                                <p className="text-yellow font-bold">₹{product.price}</p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors"
                                                title="Delete Product"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onUpdate={fetchData}
                />
            )}

            {selectedUser && (
                <UserDetailsModal
                    user={selectedUser}
                    orders={data.orders}
                    onClose={() => setSelectedUser(null)}
                    onOrderClick={(order) => setSelectedOrder(order)}
                />
            )}
        </Layout>
    );
}
