import Layout from '../components/Layout';

export default function About() {
    return (
        <Layout>
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-4xl font-bold mb-6 text-gray-800">About Arshi Sales</h1>
                <p className="text-lg text-gray-600 mb-4">
                    Welcome to Arshi Sales, your number one source for all things Tobacco, Babu, and Bidi. We're dedicated to providing you the very best of quality products, with an emphasis on authenticity, customer service, and uniqueness.
                </p>
                <p className="text-lg text-gray-600 mb-4">
                    Founded in 2024, Arshi Sales has come a long way from its beginnings. When we first started out, our passion for "quality products for everyone" drove us to start our own business.
                </p>
                <p className="text-lg text-gray-600 mb-4">
                    We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
                </p>
                <p className="text-lg font-bold text-gray-800 mt-8">
                    Sincerely,<br />
                    The Arshi Sales Team
                </p>
            </div>
        </Layout>
    );
}
