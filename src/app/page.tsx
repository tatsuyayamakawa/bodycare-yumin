import Access from "@/components/features/access";
import CustomerVoice from "@/components/features/customer-voice";
import Faq from "@/components/features/faq";
import FlowChart from "@/components/features/flow-chart";
import Price from "@/components/features/price";
import Profile from "@/components/features/profile";
import TreatmentPolicy from "@/components/features/treatment-policy";
import Cta from "@/components/home/cta";
import Empathy from "@/components/home/empathy";
import Hero from "@/components/home/hero";

export default function Home() {
  return (
    <>
      <Hero />
      <Cta />
      <Empathy />
      <CustomerVoice />
      <TreatmentPolicy />
      <FlowChart />
      <Profile />
      <Price />
      <Faq />
      <Access />
    </>
  );
}
