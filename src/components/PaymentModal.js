import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';

export default function PaymentModal({ amount, onClose, onPaymentComplete }) {
    const [step, setStep] = useState('select'); // select, upi, success
    const [verifying, setVerifying] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);

    // UPI ID for Arshi Sales
    const upiId = "krishkoyani02@okhdfcbank";
    const payeeName = "Arshi Sales";

    // UPI URL format: upi://pay?pa=<upi_id>&pn=<name>&am=<amount>&cu=INR
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;

    const handleUPIConfirm = (txId) => {
        setVerifying(true);
        // Simulate verification delay
        setTimeout(() => {
            setVerifying(false);
            setStep('success');
            setTimeout(() => {
                onPaymentComplete('UPI', txId);
            }, 2000);
        }, 1500);
    };

    const handleCODConfirm = () => {
        setStep('success');
        setTimeout(() => {
            onPaymentComplete('COD');
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-gray-900/20 flex items-center justify-center z-50 backdrop-blur-md transition-all duration-500">
            <div className="bg-white p-8 rounded-3xl max-w-md w-full text-center shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 transform transition-all animate-reveal relative overflow-hidden">

                {/* Decorative sheen */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50"></div>

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-display font-bold text-brand-black tracking-tight">
                        {step === 'select' ? 'Secure Checkout' : step === 'upi' ? 'Scan & Pay' : 'Order Placed'}
                    </h2>
                    {step !== 'success' && (
                        <button onClick={onClose} className="text-gray-400 hover:text-brand-black transition-colors text-2xl p-2 rounded-full hover:bg-gray-50">&times;</button>
                    )}
                </div>

                {/* Step 1: Select Payment Method */}
                {step === 'select' && (
                    <div className="flex flex-col gap-4">
                        <div className="bg-gray-50 p-4 rounded-2xl mb-2">
                            <p className="text-gray-500 text-sm uppercase tracking-widest font-semibold mb-1">Total to Pay</p>
                            <span className="font-display font-bold text-brand-black text-4xl">₹{amount}</span>
                        </div>

                        <button
                            onClick={() => { setPaymentMethod('UPI'); setStep('upi'); }}
                            className="group flex items-center justify-between p-5 border border-gray-100 rounded-2xl hover:border-[#d4af37] hover:shadow-lg transition-all duration-300 bg-white"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-3xl bg-gray-50 p-3 rounded-full group-hover:bg-[#d4af37]/10 transition-colors">📱</span>
                                <div className="text-left">
                                    <p className="font-bold text-brand-black text-lg group-hover:text-[#d4af37] transition-colors">UPI Payment</p>
                                    <p className="text-xs text-gray-500 font-medium">Google Pay, PhonePe, Paytm</p>
                                </div>
                            </div>
                            <span className="text-gray-300 group-hover:text-[#d4af37] transition-colors text-xl">→</span>
                        </button>

                        <button
                            onClick={() => { setPaymentMethod('COD'); handleCODConfirm(); }}
                            className="group flex items-center justify-between p-5 border border-gray-100 rounded-2xl hover:border-brand-black hover:shadow-lg transition-all duration-300 bg-white"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-3xl bg-gray-50 p-3 rounded-full group-hover:bg-brand-black/10 transition-colors">💵</span>
                                <div className="text-left">
                                    <p className="font-bold text-brand-black text-lg group-hover:text-brand-black transition-colors">Cash on Delivery</p>
                                    <p className="text-xs text-gray-500 font-medium">Pay securely at your doorstep</p>
                                </div>
                            </div>
                            <span className="text-gray-300 group-hover:text-brand-black transition-colors text-xl">→</span>
                        </button>
                    </div>
                )}

                {/* Step 2: UPI Payment */}
                {step === 'upi' && (
                    <>
                        <p className="mb-8 text-gray-600 font-light">
                            Scan to pay <span className="font-bold text-brand-black">₹{amount}</span>
                        </p>

                        <div className="flex justify-center mb-8 p-6 bg-white rounded-3xl border border-gray-100 shadow-inner inline-block">
                            <QRCodeSVG value={upiUrl} size={200} level="H" />
                        </div>

                        <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl mb-6 text-sm text-gray-600 flex flex-col items-center">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[#d4af37] font-bold">UPI ID:</span>
                                <code className="bg-white px-2 py-0.5 rounded border border-gray-200 select-all">{upiId}</code>
                            </div>
                            <p className="text-xs opacity-70">Merchant: {payeeName}</p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <input
                                type="text"
                                placeholder="Enter Transaction ID / UTR"
                                className="border border-gray-200 bg-gray-50 p-4 rounded-xl w-full mb-2 outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all text-center font-medium placeholder-gray-400"
                                id="transactionIdInput"
                            />
                            <button
                                onClick={() => {
                                    const txId = document.getElementById('transactionIdInput').value;
                                    if (!txId) {
                                        alert('Please enter the Transaction ID to verify.');
                                        return;
                                    }
                                    handleUPIConfirm(txId);
                                }}
                                disabled={verifying}
                                className={`font-bold py-4 px-6 rounded-full transition-all flex items-center justify-center gap-2 shadow-lg ${verifying
                                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                                    : 'bg-brand-black hover:bg-[#d4af37] text-white hover:text-white hover:shadow-[#d4af37]/20 transform hover:-translate-y-0.5'
                                    }`}
                            >
                                {verifying ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Verifying...
                                    </>
                                ) : (
                                    "Is Payment Completed ?"
                                )}
                            </button>
                            {!verifying && (
                                <button
                                    onClick={() => setStep('select')}
                                    className="text-gray-400 hover:text-brand-black text-xs font-semibold uppercase tracking-widest mt-2 transition-colors"
                                >
                                    Choose Different Method
                                </button>
                            )}
                        </div>
                    </>
                )}

                {/* Step 3: Success */}
                {step === 'success' && (
                    <div className="py-12 flex flex-col items-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-5xl mb-6 animate-bounce shadow-lg shadow-green-100">
                            ✅
                        </div>
                        <h2 className="text-3xl font-display font-bold text-brand-black mb-3">Order Placed!</h2>
                        <p className="text-gray-500 max-w-xs mx-auto leading-relaxed">
                            {paymentMethod === 'COD' ? 'Thank you. You can cash on delivery.' : 'Payment verified successfully.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
