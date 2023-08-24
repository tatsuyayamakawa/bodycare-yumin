import Script from 'next/script';

export type OneSignalIdProps = {
  oneSignalId: string;
  oneSignalSafariId: string;
  oneSignalSubDomain: string;
};

export const OneSignal = ({ oneSignalId, oneSignalSafariId, oneSignalSubDomain }: OneSignalIdProps) => {
  return (
    <>
      <Script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></Script>
      <Script id="onesignal">
        {`
        window.OneSignalDeferred = window.OneSignalDeferred || [];
        OneSignalDeferred.push(function(OneSignal) {
          OneSignal.init({
            appId: ${oneSignalId},
            safari_web_id: ${oneSignalSafariId},
            notifyButton: {
              enable: true,
            },
            subdomainName: ${oneSignalSubDomain},
          });
        });
        `}
      </Script>
    </>
  );
};
