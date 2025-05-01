import Cta from "@/components/cta";
import CustomerVoice from "@/components/customer-voice";
import Empathy from "@/components/empathy";
import FlowChart from "@/components/flow-chart";
import Hero from "@/components/hero";
import Price from "@/components/price";
import Profile from "@/components/profile";
import TreatmentPolicy from "@/components/treatment-policy";

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
    </>
  );
}
