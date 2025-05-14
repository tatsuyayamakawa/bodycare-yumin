import { images } from "../assets";
import type { FlowChartData, FlowChartStyles } from "../types";

export const flowChartData: FlowChartData = {
  sections: [
    {
      title: "コリの根本原因",
      subtitle: "とは？",
      image: images.flow_image_01,
      content: [
        "コリの原因が筋肉内に存在する酸素不足や乳酸であることをご存知でしょうか。",
        "筋肉が疲れて酸欠状態になると、乳酸が生成されます。これにより体全体がだるく感じられます。",
        "疲労が蓄積すると筋肉は硬くなり、血流が悪くなるため、乳酸などの疲労物質が滞ります。",
        "この酸素欠乏状態が続くと、周囲の細胞から疼痛物質が分泌され、痛みを感じるようになります。",
        "痛みが出るまで症状が進行するのは、体からの最終的な警告と言えます。",
      ],
      imagePosition: "left",
      reverse: false,
    },
    {
      title: "効率良くコリを",
      subtitle: "ほぐすには？",
      image: images.flow_image_02,
      content: [
        "筋肉は大きく「深層筋」と「浅層筋」に分類できます。",
        "深層筋は骨と骨を繋ぐ役割を持ち、骨格のバランスを保つための筋肉です。一方、浅層筋は皮膚の直下に位置し、深層筋を覆い保護します。",
        "人間の体を動かす際には、深層筋が先に動き始め、それに続いて浅層筋が動きます。つまり、「深層筋」に不具合があれば「浅層筋」の動きも悪くなるということです。",
        "当サロンでは、マッサージではなかなか届かないコリの根本原因となる深層筋をほぐしていきます。",
      ],
      imagePosition: "right",
      reverse: true,
    },
    {
      title: "深層筋整体の",
      subtitle: "メリットとは？",
      image: images.flow_image_03,
      content: [
        "深層筋をほぐすと、体液、リンパ液、血液の循環が改善し、自然治癒力が活性化して体の疲れが内側から回復します。",
        "この自然治癒力を最大限に引き出し、お客様自身で健康な体を取り戻せるように促すのが整体療術方針です。",
        "お客様の多くが、施術後すぐに体の何らかの変化を感じています。それは体の軽さや体温の変化などさまざまですが、深層筋整体の効果を証明しています。",
        "マッサージや治療院では満足できない方は、ぜひ本格的な整体をご体験ください。",
      ],
      imagePosition: "left",
      reverse: false,
    },
  ],
} as const;

export const flowChartStyles: FlowChartStyles = {
  container: {
    base: "",
  },
  content: {
    base: "",
  },
  illustrations: {
    base: "",
  },
} as const;
