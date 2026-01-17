import Header from '@/components/Header';
import Banner from '@/components/Banner';
import Products from '@/components/Products';
import Footer from '@/components/Footer';
import Reviews from '@/components/review';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Banner />
      <Products />
      <Reviews />
      <Footer />
    </main>
  );
}
