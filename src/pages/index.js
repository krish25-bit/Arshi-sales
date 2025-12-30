import { useState } from 'react';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import PaymentModal from '../components/PaymentModal';
import Toast from '../components/Toast';
import { useCart } from '../context/CartContext';
import dbConnect from '../lib/db';
import Product from '../models/Product';

export default function Home({ products }) {
  const { addToCart } = useCart();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (product) => {
    addToCart(product);
    setToastMessage(`${product.name} added to cart successfully!`);
  };

  const handleBuyClick = (product) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('Please login to purchase items.');
      window.location.href = '/login';
      return;
    }
    setSelectedProduct(product);
    setShowPaymentModal(true);
  };

  const handleOrderComplete = async (paymentMethod, transactionId = null) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !selectedProduct) return;

    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          customerDetails: { name: user.name, email: user.email },
          items: [selectedProduct],
          total: selectedProduct.price,
          paymentMethod: paymentMethod,
          transactionId
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setShowPaymentModal(false);
        setSelectedProduct(null);
        window.location.href = '/profile';
      } else {
        alert('Failed to place order.');
        setShowPaymentModal(false);
      }
    } catch (error) {
      console.error('Order error:', error);
      alert('Something went wrong.');
      setShowPaymentModal(false);
    }
  };

  return (
    <Layout title="Arshi Sales - Premium Tobacco Collection">
      <Toast message={toastMessage} onClose={() => setToastMessage('')} />

      {/* Hero Section - Refined Light Theme */}
      <div className="relative w-full min-h-[85vh] bg-background overflow-hidden flex items-center">
        {/* Subtle Gradient Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow/10 via-background to-background"></div>
        <div className="absolute right-0 top-0 w-1/3 h-full bg-surface skew-x-12 transform origin-bottom-right opacity-50"></div>

        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Content */}
          <div className="text-left py-12">
            <span className="text-yellow font-bold tracking-[0.2em] uppercase text-sm md:text-base mb-4 block animate-fade-in-up">
              Authentic Quality • Est. 2025
            </span>
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-display text-navy mb-6 leading-none tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Experience <br />
              <span className="italic text-gray-400 font-light">True Luxury</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg font-medium leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Discover our exclusive collection of premium traditional blends.
              The perfection you deserve.
            </p>
            <div className="flex gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <a href="#products"
                className="bg-navy text-white font-bold py-4 px-10 rounded-full hover:bg-yellow hover:text-navy transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1">
                Shop Collection
              </a>
              <a href="/about"
                className="bg-transparent border-2 border-navy text-navy font-bold py-4 px-10 rounded-full hover:bg-surface hover:text-navy transition-all duration-300">
                Our Legacy
              </a>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-[50vh] md:h-[70vh] w-full flex items-center justify-center animate-reveal">
            <div className="relative w-full h-full max-w-lg">
              <div className="absolute inset-0 bg-yellow/20 rounded-full blur-3xl transform scale-90"></div>
              <div className="w-full h-full bg-cover bg-center rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700"
                style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-navy py-16 -mt-10 relative z-20 rounded-t-[3rem] shadow-[0_-20px_40px_rgba(0,0,0,0.1)]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-display text-white mb-8">
            Find Your Perfect Blend
          </h2>
          <div className="relative w-full max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search our collection..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-16 py-5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder-gray-400 focus:bg-white focus:text-navy focus:placeholder-gray-500 outline-none transition-all duration-300 text-lg"
            />
            <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-2xl">🔍</span>
          </div>
        </div>
      </div>

      {/* Stats/Features Strip */}
      <div className="bg-navy pb-20 pt-10">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-12">
          <div className="text-center">
            <div className="text-3xl text-yellow mb-2 font-display">100%</div>
            <div className="text-gray-400 text-sm uppercase tracking-wider">Authentic</div>
          </div>
          <div className="text-center">
            <div className="text-3xl text-yellow mb-2 font-display">24/7</div>
            <div className="text-gray-400 text-sm uppercase tracking-wider">Support</div>
          </div>
          <div className="text-center">
            <div className="text-3xl text-yellow mb-2 font-display">Fast</div>
            <div className="text-gray-400 text-sm uppercase tracking-wider">Delivery</div>
          </div>
          <div className="text-center">
            <div className="text-3xl text-yellow mb-2 font-display">Secure</div>
            <div className="text-gray-400 text-sm uppercase tracking-wider">Payment</div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div id="products" className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-12 border-b border-gray-100 pb-6">
            <div>
              <span className="text-yellow font-bold uppercase tracking-widest text-sm mb-2 block">Our Collection</span>
              <h2 className="text-4xl lg:text-5xl font-display text-navy">Premium Selection</h2>
            </div>
            <a href="#products" className="hidden md:block text-navy font-bold hover:text-yellow transition-colors">View All Products →</a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <div key={product.id} className={`animate-fade-in-up`} style={{ animationDelay: `${index * 100}ms` }}>
                  <ProductCard
                    product={product}
                    onBuy={handleBuyClick}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <div className="text-6xl mb-4">🍂</div>
                <h3 className="text-2xl font-bold text-navy mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your search terms</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* About Section - Split Layout */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2">
        <div className="bg-navy p-12 lg:p-24 flex flex-col justify-center">
          <span className="text-yellow font-bold uppercase tracking-widest text-sm mb-4">Our Legacy</span>
          <h2 className="text-4xl lg:text-5xl font-display text-white mb-6">Tradition Meets Excellence</h2>
          <p className="text-gray-300 leading-loose mb-8 text-lg font-light">
            Founded in 2025, Arshi Sales has established itself as a premier destination for tobacco connoisseurs.
            We source only the finest leaves, ensuring that every product represents the pinnacle of quality and taste.
          </p>
          <a href="/about" className="inline-block text-white border-b-2 border-yellow pb-1 font-bold hover:text-yellow transition-colors self-start">
            Read Our Story
          </a>
        </div>
        <div className="bg-gray-200 min-h-[400px] bg-[url('/images/about-bg.jpg')] bg-cover bg-center">
          {/* If image missing, gray background remains. Ideally we add an image later. */}
        </div>
      </div>

      {showPaymentModal && selectedProduct && (
        <PaymentModal
          amount={selectedProduct.price}
          onClose={() => setShowPaymentModal(false)}
          onPaymentComplete={handleOrderComplete}
        />
      )}
    </Layout>
  );
}



export async function getServerSideProps() {
  await dbConnect();
  const products = await Product.find().sort({ id: 1 }).lean();

  // Convert _id to string for serialization
  const serializedProducts = products.map(p => ({
    ...p,
    _id: p._id.toString(),
  }));

  return {
    props: {
      products: serializedProducts,
    },
  };
}
