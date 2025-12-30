import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';

export default function Signup() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (res.ok) {
                alert('Account created successfully! Please login.');
                router.push('/login');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Signup error:', error);
        }
    };

    return (
        <Layout>
            <div className="max-w-md mx-auto glass-panel p-8 rounded-2xl mt-10 border border-navy/10 shadow-2xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-navy font-display mb-2">Join the Club</h2>
                    <p className="text-gray-500 text-sm">Create an account to start your journey</p>
                </div>

                <button
                    type="button"
                    onClick={() => signIn('google', { callbackUrl: '/' })}
                    className="w-full bg-white border border-gray-200 text-navy font-bold py-3.5 px-4 rounded-full hover:bg-gray-50 hover:shadow-md transition-all flex items-center justify-center mb-8"
                >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 4.61c1.61 0 3.09.56 4.23 1.64l3.18-3.18C17.46 1.05 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Sign up with Google
                </button>

                <div className="flex items-center mb-8">
                    <div className="flex-1 border-t border-gray-200"></div>
                    <div className="px-3 text-gray-400 text-xs uppercase tracking-wider">Or email</div>
                    <div className="flex-1 border-t border-gray-200"></div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-navy text-sm font-bold mb-2 ml-1">Full Name</label>
                        <input
                            type="text" name="name"
                            onChange={handleChange}
                            className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-navy focus:ring-1 focus:ring-navy outline-none transition-all bg-white text-navy placeholder-gray-400 shadow-inner"
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-navy text-sm font-bold mb-2 ml-1">Email</label>
                        <input
                            type="email" name="email"
                            onChange={handleChange}
                            className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-navy focus:ring-1 focus:ring-navy outline-none transition-all bg-white text-navy placeholder-gray-400 shadow-inner"
                            placeholder="john@example.com"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-navy text-sm font-bold mb-2 ml-1">Phone Number</label>
                        <input
                            type="tel" name="phone"
                            onChange={handleChange}
                            className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-navy focus:ring-1 focus:ring-navy outline-none transition-all bg-white text-navy placeholder-gray-400 shadow-inner"
                            placeholder="+91 98765 43210"
                        />
                    </div>
                    <div className="mb-8">
                        <label className="block text-navy text-sm font-bold mb-2 ml-1">Password</label>
                        <input
                            type="password" name="password"
                            onChange={handleChange}
                            className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-navy focus:ring-1 focus:ring-navy outline-none transition-all bg-white text-navy placeholder-gray-400 shadow-inner"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-navy text-white font-bold py-3.5 px-4 rounded-full hover:bg-yellow hover:text-navy transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl">
                        Create Account
                    </button>
                </form>
                <p className="mt-8 text-center text-sm text-gray-500">
                    Already have an account? <Link href="/login" className="text-navy font-bold hover:text-yellow transition-colors underline decoration-2 decoration-transparent hover:decoration-yellow underline-offset-4">Login here</Link>
                </p>
            </div>
        </Layout>
    );
}
