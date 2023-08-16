import Script from 'next/script';

export const LineConversion = () => {
  return (
    <>
      <Script id="line-conversion">
        {`
        _lt('send', 'cv', {
          type: 'Conversion'
        },['${process.env.NEXT_PUBLIC_LINETAG_ID}']);
        `}
      </Script>
    </>
  );
};
