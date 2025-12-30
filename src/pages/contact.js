import Layout from '../components/Layout';

export default function Contact() {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for contacting us! We will get back to you soon.');
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-4xl font-bold mb-6 text-gray-800">Contact Us</h1>
                <p className="mb-8 text-gray-600">Have questions? We'd love to hear from you.</p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                        <input type="text" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input type="email" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Message</label>
                        <textarea className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 h-32" required></textarea>
                    </div>
                    <button type="submit" className="bg-yellow-500 text-white font-bold py-2 px-6 rounded hover:bg-yellow-600 transition">
                        Send Message
                    </button>
                </form>

                <div className="mt-10 border-t pt-6">
                    <h3 className="text-xl font-bold mb-2">Visit Us</h3>
                    <p className="text-gray-600">123 Market Street, City Center<br />New Delhi, India 110001</p>
                    <p className="text-gray-600 mt-2">Email: support@arshisales.com<br />Phone: +91 98765 43210</p>
                </div>
            </div>
        </Layout>
    );
}
