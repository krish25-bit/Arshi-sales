import { useState, useEffect } from 'react';

export default function OrderDetailsModal({ order, onClose, onUpdate }) {
    const [items, setItems] = useState(order.items || []);
    const [discount, setDiscount] = useState(order.manualDiscount || 0);

    // Calculate total dynamically on frontend to show instant feedback
    const calculateTotal = () => {
        const subtotal = items.reduce((sum, item) => {
            const price = (item.updatedPrice !== undefined && item.updatedPrice !== null && item.updatedPrice !== '')
                ? Number(item.updatedPrice)
                : item.price;
            return sum + (price * (item.quantity || 1));
        }, 0);
        return subtotal - discount;
    };

    const [total, setTotal] = useState(calculateTotal());

    useEffect(() => {
        setTotal(calculateTotal());
    }, [items, discount]);

    const handleItemPriceChange = (index, newPrice) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], updatedPrice: newPrice };
        setItems(newItems);
    };

    const handleSave = async () => {
        try {
            const res = await fetch('/api/admin/update-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: order.id,
                    manualDiscount: discount,
                    items: items,
                    finalTotal: total
                })
            });
            if (res.ok) {
                alert('Invoice updated successfully!');
                onUpdate();
                onClose();
            } else {
                alert('Failed to update');
            }
        } catch (err) {
            alert('Error updating order');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 print:p-0 print:bg-white print:absolute print:inset-0">
            <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up print:max-h-none print:shadow-none print:w-full">

                {/* Invoice Header */}
                <div className="p-8 border-b-2 border-navy flex justify-between items-start print:border-black">
                    <div>
                        <h1 className="text-4xl font-display text-navy tracking-tight print:text-black">INVOICE</h1>
                        <p className="text-gray-500 font-medium">#{order.id}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-bold text-navy print:text-black">ARSHI SALES</h2>
                        <p className="text-sm text-gray-500">Premium Tobacco Collection</p>
                        <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                <div className="p-8 print:p-8">
                    {/* Bill To */}
                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Bill To</h3>
                        <p className="text-xl font-bold text-navy print:text-black">{order.customerDetails?.name}</p>
                        <p className="text-gray-600">{order.customerDetails?.email}</p>
                        {/* <p className="text-gray-600">+91 98765 43210</p> */}
                    </div>

                    {/* Line Items */}
                    <table className="w-full text-left mb-8">
                        <thead>
                            <tr className="border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wide">
                                <th className="py-3">Item</th>
                                <th className="py-3 text-center">Qty</th>
                                <th className="py-3 text-right">Unit Price</th>
                                <th className="py-3 text-right">Edit Price</th>
                                <th className="py-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {items.map((item, idx) => {
                                const currentPrice = (item.updatedPrice !== undefined && item.updatedPrice !== null && item.updatedPrice !== '')
                                    ? Number(item.updatedPrice)
                                    : item.price;
                                return (
                                    <tr key={idx} className="group">
                                        <td className="py-4">
                                            <p className="font-bold text-navy print:text-black">{item.name}</p>
                                            <p className="text-xs text-gray-400">{item.categoryId}</p>
                                        </td>
                                        <td className="py-4 text-center font-medium">{item.quantity || 1}</td>
                                        <td className="py-4 text-right text-gray-400 line-through decoration-red-400 decoration-1 text-sm">
                                            {item.pricesUpdated ? `₹${item.price}` : ''}
                                            {/* Logic to show original only if changed? simpler to just show price inputs */}
                                        </td>
                                        <td className="py-4 text-right">
                                            <input
                                                type="number"
                                                className="w-24 text-right bg-gray-50 border border-gray-200 rounded p-1 font-bold text-navy focus:border-yellow focus:outline-none focus:ring-1 focus:ring-yellow print:hidden"
                                                placeholder={item.price}
                                                value={item.updatedPrice !== undefined ? item.updatedPrice : ''}
                                                onChange={(e) => handleItemPriceChange(idx, e.target.value)}
                                            />
                                            <span className="hidden print:inline font-bold">₹{currentPrice}</span>
                                        </td>
                                        <td className="py-4 text-right font-bold text-navy print:text-black">
                                            ₹{currentPrice * (item.quantity || 1)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {/* Totals */}
                    <div className="flex justify-end">
                        <div className="w-64 space-y-3">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{items.reduce((acc, i) => acc + ((i.updatedPrice || i.price) * (i.quantity || 1)), 0)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 items-center">
                                <span>Discount</span>
                                <div className="flex items-center gap-1">
                                    <span className="text-gray-400">- ₹</span>
                                    <input
                                        type="number"
                                        className="w-20 text-right bg-gray-50 border border-gray-200 rounded p-1 font-medium focus:border-yellow focus:outline-none print:hidden border-b"
                                        value={discount}
                                        onChange={(e) => setDiscount(Number(e.target.value))}
                                    />
                                    <span className="hidden print:inline">{discount}</span>
                                </div>
                            </div>
                            <div className="pt-4 border-t-2 border-navy flex justify-between items-center text-xl font-bold text-navy print:text-black print:border-black">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="bg-gray-50 p-6 flex justify-between items-center print:hidden border-t border-gray-100">
                    <button onClick={onClose} className="px-6 py-2 text-gray-500 font-bold hover:text-navy transition-colors">Close</button>
                    <div className="flex gap-4">
                        <button onClick={handlePrint} className="px-6 py-2 bg-white border border-gray-200 text-navy font-bold rounded-lg shadow-sm hover:shadow-md transition-all">
                            Print / PDF
                        </button>
                        <button onClick={handleSave} className="px-8 py-3 bg-navy text-white font-bold rounded-lg hover:bg-yellow hover:text-navy transition-all shadow-lg">
                            Save Invoice
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
