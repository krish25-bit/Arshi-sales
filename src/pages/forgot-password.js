import { useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';

export default function ForgotPassword() {
    const [mode, setMode] = useState('mobile'); // 'email' or 'mobile'
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // OTP Flow States
    const [step, setStep] = useState(1); // 1: Send OTP, 2: Verify & Reset
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage(data.message);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage(data.message);
                setStep(2);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to send OTP. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await fetch('/api/auth/reset-password-mobile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, otp, newPassword }),
            });

            const data = await res.json();
            if (res.ok) {
                alert('Password reset successful! You can now login.');
                router.push('/login');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('Failed to reset password. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Forgot Password - Arshi Sales">
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
                <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

                {/* Tabs */}
                <div className="flex mb-6 border-b">
                    <button
                        className={`flex-1 py-2 text-center font-bold ${mode === 'mobile' ? 'border-b-2 border-yellow text-navy' : 'text-gray-400'}`}
                        onClick={() => { setMode('mobile'); setMessage(''); setError(''); setStep(1); }}
                    >
                        Mobile OTP
                    </button>
                    <button
                        className={`flex-1 py-2 text-center font-bold ${mode === 'email' ? 'border-b-2 border-yellow text-navy' : 'text-gray-400'}`}
                        onClick={() => { setMode('email'); setMessage(''); setError(''); }}
                    >
                        Email Link
                    </button>
                </div>

                {message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-sm">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                {mode === 'email' ? (
                    <form onSubmit={handleEmailSubmit}>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow"
                                required
                                placeholder="Enter your registered email"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full bg-navy text-white font-bold py-3 px-4 rounded hover:bg-black transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                ) : (
                    // MOBILE OTP MODE
                    <>
                        {step === 1 ? (
                            <form onSubmit={handleSendOtp}>
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Mobile Number</label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow"
                                        required
                                        placeholder="Enter your registered phone"
                                    />
                                    <p className="text-xs text-gray-500 mt-2">We will send a 6-digit OTP to this number.</p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full bg-navy text-white font-bold py-3 px-4 rounded hover:bg-black transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? 'Sending OTP...' : 'Send OTP'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Enter OTP</label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow tracking-widest text-center text-xl font-mono"
                                        required
                                        placeholder="000000"
                                        maxLength={6}
                                    />
                                </div>
                                <div className="mb-6">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow"
                                        required
                                        placeholder="New strong password"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full bg-navy text-white font-bold py-3 px-4 rounded hover:bg-black transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {loading ? 'Reseting...' : 'Reset Password'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full text-center mt-4 text-sm text-gray-500 hover:text-navy"
                                >
                                    Incorrect Number? Back
                                </button>
                            </form>
                        )}
                    </>
                )}

                <div className="mt-8 text-center pt-4 border-t">
                    <Link href="/login" className="text-sm text-blue-600 hover:underline font-semibold">
                        Back to Login
                    </Link>
                </div>
            </div>
        </Layout>
    );
}
