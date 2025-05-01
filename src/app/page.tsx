import Cta from "@/components/cta";
import CustomerVoice from "@/components/customer-voice";
import Empathy from "@/components/empathy";
import Hero from "@/components/hero";
import TreatmentPolicy from "@/components/treatment-policy";

export default function Home() {
  return (
    <>
      <Hero />
      <Cta />
      <Empathy />
      <CustomerVoice />
      <TreatmentPolicy />
    </>
  );
}
