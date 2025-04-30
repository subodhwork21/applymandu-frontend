import Header from "@/components/header";
import Hero from "@/components/hero";
import LatestJobs from "@/components/latest-jobs";
import HighlightedJobs from "@/components/highlighted-jobs";
import PopularClosingJobs from "@/components/popular-closing-jobs";
import CTASection from "@/components/cta-cection";
import Footer from "@/components/footer";
export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <main>
        <Hero />
        <LatestJobs />
        <HighlightedJobs />
        <PopularClosingJobs />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
