import { treatmentPolicyStyles } from "../constants";

export default function Intro() {
  const { intro } = treatmentPolicyStyles;
  const { title, subtitle, description } = intro;

  return (
    <div className={intro.base}>
      <h2 className={title.base}>
        <span className={title.line}>お悩みの症状に</span>
        <span className={title.line}>効果のある施術を行います</span>
      </h2>
      <h3 className={subtitle.base}>機械を使わない安心安全の整体です</h3>
      <div className={description.base}>
        <p>手もみ整体 癒眠は「手もみ専門」の整体サロンです。</p>
        <p>
          <span className="md:block">
            一軒家の一室でお客様同士が重ならないよう時間調整を行っており、
          </span>
          お客様一人ひとり充分な時間をかけた丁寧な施術を心がけております。
        </p>
        <p>
          <span className="md:block">
            手技矯正は希望者にのみ実施いたしますので、
          </span>
          ボキボキが苦手な方や整体が初めての方も安心してご利用ください。
        </p>
      </div>
    </div>
  );
}
