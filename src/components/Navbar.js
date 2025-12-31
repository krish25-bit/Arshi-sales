import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/router';

export default function Navbar() {
    const [user, setUser] = useState(null);
    const { getCartCount } = useCart();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/login';
    };

    const isHome = router.pathname === '/';
    const isTransparent = isHome && !scrolled;

    // Define navClass based on isTransparent state -> Always Navy for corporate look, or transparent on hero
    // Urmin uses solid Navy bar at top. Let's go with Sticky Navy Bar.
    const navClass = 'bg-navy shadow-lg py-4';

    return (
        <div className="fixed top-0 left-0 right-0 z-50 w-full">
            <nav className={`w-full px-6 md:px-12 flex items-center justify-between transition-all duration-300 ${scrolled ? 'py-3 bg-navy/95 backdrop-blur-md shadow-xl' : 'py-4 bg-navy'}`}>
                {/* Logo */}
                <Link href="/" className="group flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow rounded-lg flex items-center justify-center shadow-lg shadow-yellow/20">
                        <span className="text-navy font-bold text-xl">A</span>
                    </div>
                    <span className="text-2xl font-bold font-display tracking-wider text-white">
                        ARSHI<span className="text-yellow">.</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <div className="flex items-center gap-8">
                        <NavLink href="/">Home</NavLink>

                        {/* Categories Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center gap-1 text-sm font-bold text-white/80 hover:text-yellow uppercase tracking-wider transition-all duration-300">
                                Categories
                                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                            <div className="absolute top-full left-[-20px] pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                                <div className="bg-white rounded-xl shadow-2xl overflow-hidden min-w-[200px] border border-gray-100 p-2">
                                    <Link href="/#products" className="block px-4 py-2 text-navy hover:bg-yellow/10 hover:text-yellow font-bold rounded-lg transition-colors">
                                        All Products
                                    </Link>
                                    <div className="h-[1px] bg-gray-100 my-1"></div>
                                    <Link href="/category/tobacco" className="block px-4 py-2 text-gray-600 hover:bg-yellow/10 hover:text-navy font-medium rounded-lg transition-colors">Tobacco</Link>
                                    <Link href="/category/bidi" className="block px-4 py-2 text-gray-600 hover:bg-yellow/10 hover:text-navy font-medium rounded-lg transition-colors">Bidi</Link>
                                    <Link href="/category/pan-masala" className="block px-4 py-2 text-gray-600 hover:bg-yellow/10 hover:text-navy font-medium rounded-lg transition-colors">Pan Masala</Link>
                                    <Link href="/category/accessories" className="block px-4 py-2 text-gray-600 hover:bg-yellow/10 hover:text-navy font-medium rounded-lg transition-colors">Accessories</Link>
                                </div>
                            </div>
                        </div>

                        <NavLink href="/about">Our Legacy</NavLink>
                        <NavLink href="/contact">Concierge</NavLink>
                    </div>

                    <div className="w-[1px] h-8 bg-white/10 mx-2"></div>

                    <Link href="/cart" className="relative group text-white hover:text-yellow transition-colors">
                        <span className="text-xl">🛒</span>
                        {mounted && getCartCount() > 0 && (
                            <span className="absolute -top-2 -right-2 bg-yellow text-navy text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-bounce">
                                {getCartCount()}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-6">
                            {/* <span className="text-sm font-medium tracking-wide text-gray-300">Hello, {user.name.split(' ')[0]}</span> */}

                            <Link href="/profile" className="text-sm font-bold text-white hover:text-yellow uppercase tracking-wider transition-colors">
                                Profile
                            </Link>

                            {user.role === 'admin' && (
                                <Link href="/admin" className="text-sm font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wider transition-colors">
                                    Admin
                                </Link>
                            )}

                            <button onClick={handleLogout} className="text-sm font-bold text-red-500 hover:text-red-400 uppercase tracking-wider transition-colors">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" className="px-6 py-2 rounded-full bg-yellow hover:bg-white text-navy font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-yellow/50 transform hover:-translate-y-0.5">
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <div className="space-y-1.5">
                        <span className={`block w-6 h-0.5 bg-yellow transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`block w-4 h-0.5 bg-yellow transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : 'ml-auto'}`}></span>
                        <span className={`block w-6 h-0.5 bg-yellow transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </div>
                </button>
            </nav>

            {/* Mobile Menu Backdrop */}
            <div className={`
                fixed inset-0 z-40 bg-navy/95 backdrop-blur-xl transition-all duration-500 flex flex-col items-center justify-center space-y-8
                ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
            `}>
                <NavLinkMobile onClick={() => setIsMenuOpen(false)} href="/">Home</NavLinkMobile>
                <NavLinkMobile onClick={() => setIsMenuOpen(false)} href="/#products">Collection</NavLinkMobile>
                <NavLinkMobile onClick={() => setIsMenuOpen(false)} href="/cart">Your Cart ({getCartCount()})</NavLinkMobile>
                <NavLinkMobile onClick={() => setIsMenuOpen(false)} href="/about">Our Legacy</NavLinkMobile>
                <NavLinkMobile onClick={() => setIsMenuOpen(false)} href="/contact">Concierge</NavLinkMobile>
                {user ? (
                    <div className="flex flex-col items-center gap-4 mt-8">
                        <span className="text-yellow font-display text-xl">Hello, {user.name}</span>
                        <Link href="/profile" className="text-white hover:text-yellow uppercase tracking-widest text-sm">My Profile</Link>
                        <button onClick={handleLogout} className="text-red-500 uppercase tracking-widest text-sm">Logout</button>
                    </div>
                ) : (
                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className="px-8 py-3 rounded-full bg-yellow text-navy font-bold text-lg shadow-lg shadow-yellow/20">
                        Login Account
                    </Link>
                )}
            </div>
        </div>
    );
}

function NavLink({ href, children }) {
    return (
        <Link href={href} className="text-sm font-bold text-white/80 hover:text-yellow uppercase tracking-wider transition-all duration-300 relative group">
            {children}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow transition-all duration-300 group-hover:w-full"></span>
        </Link>
    );
}

// NavLink definition was removed in previous chunk replacement, so this step might be redundant if I check carefully.
// Wait, the previous chunk REPLACED the `NavLink` usage but did NOT replace the `NavLink` function definition at bottom of file?
// Actually, I did NOT include `NavLink` function definition in my previous replacement chunk's `TargetContent`.
// I only replaced `return (...)` block of Navbar component.
// So `NavLink` is still at the bottom. I should update it.
// Checking previous tool call... I did NOT include lines 148-155.
// So I need to update NavLink too.

function NavLinkMobile({ href, children, onClick }) {
    return (
        <Link href={href} onClick={onClick} className="text-2xl font-display font-bold text-white hover:text-yellow transition-colors duration-300 py-2">
            {children}
        </Link>
    );
}
