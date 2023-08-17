import { ScrollAnimator } from 'react-animate-observer';

import profileImage from 'public/images/profile.jpg';
import { ImageWrapper } from 'src/components/elements/image/ImageWrapper';
import { fadeDownAnimation } from 'src/constants/motion';

export const Profile = () => {
  const heading2 = '整体師';
  const heading3 = '山川達也';
  const heading4 = '東洋カイロプラクティック専門学院卒';

  return (
    <section>
      <div className="mx-auto mb-[6.25rem] mt-0 flex flex-col items-center gap-20 lg:mt-[6.25rem] lg:max-w-[53.875rem] lg:flex-row">
        <ScrollAnimator start={{ opacity: 0 }} end={{ opacity: 1 }} className="mx-auto mt-20 lg:mt-0 lg:w-full">
          <figure className={`lg:[mask-image:url("../../public/images/shape-8s.svg")] lg:[mask-position:center] lg:[mask-repeat:no-repeat] lg:[mask-size:135%]`}>
            <ImageWrapper width="400" height="400" src={profileImage} alt="山川 達也 ポートレート" className="h-auto" />
          </figure>
        </ScrollAnimator>
        <div className="mx-5">
          <h2 className="mb-5 font-notojp text-2xl font-medium text-accent lg:text-3xl">
            {heading2.split(' ').map((word, index) => {
              return (
                <ScrollAnimator key={index} start={{ opacity: 0 }} end={{ opacity: 1 }} className="inline-block">
                  {word.split('').map((character, index) => (
                    <ScrollAnimator
                      key={index}
                      start={{ opacity: 0 }}
                      end={{ opacity: 1 }}
                      transition={{
                        transitionDelay: 0.25 + index * 0.1,
                        transitionDuration: 0.4,
                        transitionTimingFunction: 'ease-in-out',
                      }}
                      className="inline-block"
                    >
                      {character}
                    </ScrollAnimator>
                  ))}
                </ScrollAnimator>
              );
            })}
          </h2>
          <h3 className="mb-10 font-zenmincho text-4xl font-bold text-primary lg:text-5xl">
            {heading3.split(' ').map((word, index) => {
              return (
                <ScrollAnimator key={index} start={{ opacity: 0 }} end={{ opacity: 1 }} className="inline-block">
                  {word.split('').map((character, index) => (
                    <ScrollAnimator
                      key={index}
                      start={{ opacity: 0 }}
                      end={{ opacity: 1 }}
                      transition={{
                        transitionDelay: 0.25 + index * 0.1,
                        transitionDuration: 0.4,
                        transitionTimingFunction: 'ease-in-out',
                      }}
                      className="inline-block"
                    >
                      {character}
                    </ScrollAnimator>
                  ))}
                </ScrollAnimator>
              );
            })}
          </h3>
          <h4 className="mb-5 font-notojp text-xl font-medium text-primary lg:text-2xl">
            {heading4.split(' ').map((word, index) => {
              return (
                <ScrollAnimator key={index} start={{ opacity: 0 }} end={{ opacity: 1 }} className="inline-block">
                  {word.split('').map((character, index) => (
                    <ScrollAnimator
                      key={index}
                      start={{ opacity: 0 }}
                      end={{ opacity: 1 }}
                      transition={{
                        transitionDelay: 0.25 + index * 0.025,
                        transitionDuration: 0.4,
                        transitionTimingFunction: 'ease-in-out',
                      }}
                      className="inline-block"
                    >
                      {character}
                    </ScrollAnimator>
                  ))}
                </ScrollAnimator>
              );
            })}
          </h4>
          <ScrollAnimator
            {...fadeDownAnimation}
            className="[&>p]:py-4 [&>p]:font-notojp [&>p]:text-base [&>p]:font-normal [&>p]:not-italic [&>p]:leading-relaxed [&>p]:tracking-wide [&>p]:text-gray-75 lg:[&>p]:tracking-widest"
          >
            <p>当店は一軒家の一室で施術を行っているとても小さな整体サロンです。</p>
            <p>東洋整体術（東洋カイロプラクティック）はカイロプラクティックと整体に中国の推拿の技術を取り入れて発展した独自技術です。</p>
            <p>手もみ中心に要望をお聞きしながらおひとりおひとりに合った施術をさせていただきますので、どなたでも安心してお受けいただけます。</p>
          </ScrollAnimator>
        </div>
      </div>
    </section>
  );
};
