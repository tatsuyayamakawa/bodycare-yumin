import FlowChartContent from "./components/flow-chart-content";
import FlowChartIllustrations from "./components/flow-chart-illustrations";
import { flowChartStyles } from "./constants";

import Section from "@/components/common/section";

export default function FlowChart() {
  const { container } = flowChartStyles;

  return (
    <Section hasArrow hasBackground hasPadding>
      <div className={container.base}>
        <FlowChartContent />
        <FlowChartIllustrations />
      </div>
    </Section>
  );
}
