import CustomerReviews from '@/components/review';

export default function ReviewsPage() {
    return (
        <main className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        What Our Customers Say
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Read genuine reviews from our verified customers and see why they trust us
                    </p>
                </div>
            </section>

            {/* Reviews Component */}
            <CustomerReviews />

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Share Your Experience
                    </h2>
                    <p className="text-lg mb-8 opacity-90">
                        Your feedback helps us improve and helps others make informed decisions
                    </p>
                    <button className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                        Write a Review
                    </button>
                </div>
            </section>
        </main>
    );
}
