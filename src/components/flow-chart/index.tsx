import Section from "../section";

import FlowChartContent from "./components/flow-chart-content";
import FlowChartIllustrations from "./components/flow-chart-illustrations";

export default function FlowChart() {
  return (
    <Section arrow bgColor padding>
      <FlowChartContent />
      <FlowChartIllustrations />
    </Section>
  );
}
