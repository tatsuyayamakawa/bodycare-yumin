/*global google*/

'use client';

import { useMemo, useState } from 'react';

import { GoogleMap, useLoadScript, MarkerF, InfoWindow } from '@react-google-maps/api';
import Image from 'next/image';

import logoImage from 'public/images/logo.png';
import Loading from 'src/app/loading';
import { data } from 'src/constants/data';
import { mapStyles } from 'src/libs/google-maps/google-maps-styles';

import type { CoordinatesProps, MapKeyProps } from 'src/@types/global';

const googleMapOptions = {
  // 外部スタイルの読み込み
  styles: mapStyles,
  // デフォルトUIの表示 / 非表示
  disableDefaultUI: true,
  // フルスクリーンの表示 / 非表示
  fullscreenControl: true,
  // ペグマンの表示 / 非表示
  streetViewControl: true,
};

const Map = ({ googleMapsApiKey }: MapKeyProps) => {
  // Google Mapを描画するサイズ
  const containerStyle = { height: '50vh', width: '100%' };

  // マップの中央座標
  const center = useMemo(() => ({ lat: 38.267174119220755, lng: 140.29310681349253 }), []);

  const [selectedMarker, setSelectedMarker] = useState<CoordinatesProps | null>(center);

  const [size, setSize] = useState<undefined | google.maps.Size>(undefined);

  const infoWindowOptions = {
    pixelOffset: size,
  };

  const createOffsetSize = () => {
    return setSize(new window.google.maps.Size(0, -30));
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
  });

  if (loadError)
    return (
      <div className="h-[50vh]">
        <Loading />
      </div>
    );

  return (
    <>
      {isLoaded ? (
        <GoogleMap options={googleMapOptions} zoom={15} center={center} mapContainerStyle={containerStyle} onLoad={() => createOffsetSize()}>
          <MarkerF
            position={center}
            onClick={() => {
              setSelectedMarker(center);
            }}
            icon={'https://maps.google.com/mapfiles/kml/pal3/icon56.png'}
          />
          {selectedMarker && (
            <InfoWindow
              position={center}
              onCloseClick={() => {
                setSelectedMarker(null);
              }}
              options={infoWindowOptions}
            >
              <a href="https://goo.gl/maps/GJBU6sFQGz2it5g1A" target="_blank" aria-label="手もみ整体 癒眠 Googleマップへ">
                <Image width={150} height={18} src={logoImage} alt={data.info.title} />
              </a>
            </InfoWindow>
          )}
        </GoogleMap>
      ) : (
        <div className="flex h-[50vh] items-center justify-center">
          <Loading />
        </div>
      )}
    </>
  );
};

export const GoogleMaps = () => {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (googleMapsApiKey === undefined) {
    return <div>地図を表示できませんでした。</div>;
  }
  return <Map googleMapsApiKey={googleMapsApiKey} />;
};
