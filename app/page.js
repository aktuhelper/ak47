import AdBanner from "./_HomePage_Components/AdBanner";
import FAQSection from "./_HomePage_Components/Faq";
import FeaturesHighlight from "./_HomePage_Components/FeatureHighLight";
import HeroSection from "./_HomePage_Components/Hero";
import ServicesSection from "./_HomePage_Components/Services";
import StatisticsSection from "./_HomePage_Components/Statics";



export default function Home() {
  return (
    <div>

      <HeroSection />
      <div className="my-6">
        <AdBanner slot="5734157535" />
      </div>

      <ServicesSection />
      <StatisticsSection />
      <FeaturesHighlight />
      <FAQSection />

    </div>
  );
}
