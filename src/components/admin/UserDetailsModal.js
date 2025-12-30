import { useState } from 'react';

export default function UserDetailsModal({ user, orders, onClose, onOrderClick }) {
    // Filter orders for this user
    const userOrders = orders.filter(o => o.userId === user.id);

    // Calculate stats
    const totalOrders = userOrders.length;
    const totalSpent = userOrders.reduce((sum, o) => {
        // Use finalTotal if available, else total
        const actualTotal = (o.finalTotal !== undefined && o.finalTotal !== null) ? o.finalTotal : o.total;
        return sum + (o.paymentStatus === 'paid' ? actualTotal : 0);
    }, 0);

    // Calculate Dues
    let dues = 0;
    userOrders.forEach(order => {
        const debit = (order.finalTotal !== undefined && order.finalTotal !== null) ? order.finalTotal : order.total;
        let balance = -debit;
        if (order.paymentStatus === 'paid') balance += debit; // If paid, balance is 0. If not, -debit. 
        // Wait, current logic in admin.js for stats was slightly different, trying to match "Ledger" style?
        // Let's stick to simple: Pending Payment orders count as dues?
        if (order.paymentStatus !== 'paid' && order.status !== 'cancelled') {
            dues += debit;
        }
    });


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100 animate-fade-in-up">

                {/* Header Profile */}
                <div className="bg-navy p-8 flex items-center gap-6 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-yellow/10 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl"></div>

                    <div className="w-20 h-20 rounded-full bg-yellow text-navy flex items-center justify-center font-display text-4xl shadow-lg relative z-10">
                        {user.name.charAt(0)}
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-display text-white">{user.name}</h2>
                        <p className="text-white/60">{user.email}</p>
                        <p className="text-white/40 text-sm">{user.phone || 'No phone'}</p>
                        <div className="flex gap-2 mt-2">
                            <span className="px-2 py-0.5 rounded bg-white/10 text-xs text-white uppercase tracking-wider">{user.role || 'User'}</span>
                            <span className="px-2 py-0.5 rounded bg-white/10 text-xs text-white uppercase tracking-wider">ID: {user.id}</span>
                        </div>
                    </div>

                    <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <div className="p-8">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="p-4 bg-gray-50 rounded-xl text-center border border-gray-100">
                            <div className="text-2xl font-bold text-navy">{totalOrders}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Orders</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl text-center border border-gray-100">
                            <div className="text-2xl font-bold text-green-600">₹{totalSpent.toLocaleString()}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Paid</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl text-center border border-gray-100">
                            <div className="text-2xl font-bold text-red-500">₹{dues.toLocaleString()}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide">Dues</div>
                        </div>
                    </div>

                    {/* Order History */}
                    <h3 className="text-lg font-display text-navy mb-4 border-b border-gray-100 pb-2">Order History</h3>
                    {userOrders.length === 0 ? (
                        <p className="text-gray-400 italic">No orders yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {userOrders.slice().reverse().map(order => (
                                <div
                                    key={order.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-yellow transition-colors cursor-pointer hover:bg-gray-50"
                                    onClick={() => onOrderClick(order)}
                                >
                                    <div className="mb-2 sm:mb-0">
                                        <div className="font-bold text-navy flex items-center gap-2">
                                            #{order.id.slice(-4)}
                                            {order.type === 'manual' && <span className="text-[10px] bg-gray-200 px-1 rounded text-gray-600">MANUAL</span>}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">{order.items?.length || 0} items</div>
                                    </div>

                                    <div className="text-right flex items-center gap-4">
                                        <div className={`text-xs px-2 py-1 rounded font-bold uppercase ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow/20 text-yellow-800'
                                            }`}>
                                            {order.status}
                                        </div>
                                        <div>
                                            <div className="font-bold text-navy">
                                                ₹{(order.finalTotal !== undefined && order.finalTotal !== null) ? order.finalTotal : order.total}
                                            </div>
                                            <div className={`text-xs font-bold ${order.paymentStatus === 'paid' ? 'text-green-500' : 'text-red-500'}`}>
                                                {order.paymentStatus}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
