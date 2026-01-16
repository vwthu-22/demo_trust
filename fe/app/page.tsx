import Header from '@/components/Header';
import Banner from '@/components/Banner';
import Products from '@/components/Products';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Banner />
      <Products />
      <Footer />
    </main>
  );
}
