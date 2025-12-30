import Head from 'next/head';
import Navbar from './Navbar';

export default function Layout({ children, title = 'Arshi Sales - Premium Tobacco & Bidi Store', description = 'Buy high quality Tobacco, Babu, and Bidi online at Arshi Sales. Best prices and fast delivery.' }) {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground font-body selection:bg-gold selection:text-background bg-texture relative">
            <Head>
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Navbar />

            <main className="flex-grow pt-24 w-full">
                {children}
            </main>

            <footer className="bg-navy text-white pt-20 pb-10 mt-auto border-t-4 border-yellow">
                <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-yellow rounded-md flex items-center justify-center text-navy font-bold">A</div>
                            <h3 className="text-3xl font-bold font-display tracking-wide">ARSHI SALES</h3>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed max-w-md font-light">
                            Premium Tobacco & Bidi products delivered with excellence.
                            A legacy of quality and trust since 2025.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-yellow mb-6 uppercase tracking-wider">Quick Links</h4>
                        <ul className="space-y-3 text-gray-300 text-sm">
                            <li><a href="/" className="hover:text-yellow transition-colors block">Home</a></li>
                            <li><a href="/#products" className="hover:text-yellow transition-colors block">Collection</a></li>
                            <li><a href="/about" className="hover:text-yellow transition-colors block">Our Legacy</a></li>
                            <li><a href="/contact" className="hover:text-yellow transition-colors block">Concierge</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-yellow mb-6 uppercase tracking-wider">Contact</h4>
                        <div className="space-y-4 text-gray-300 text-sm font-light">
                            <p className="flex items-center gap-3"><span className="text-yellow">✉</span> support@arshisales.com</p>
                            <p className="flex items-center gap-3"><span className="text-yellow">📞</span> +91 98765 43210</p>
                            <p className="flex items-start gap-3"><span className="text-yellow mt-1">📍</span> 123 Premium Lane, Tobacco City</p>
                        </div>
                    </div>
                </div>
                <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-xs tracking-wider uppercase">
                    <p>&copy; {new Date().getFullYear()} Arshi Sales. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
