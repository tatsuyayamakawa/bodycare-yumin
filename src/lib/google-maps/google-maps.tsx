/*global google*/

'use client';

import { useMemo, useState } from 'react';

import { Typography } from '@material-tailwind/react';
import { GoogleMap, useLoadScript, MarkerF, InfoWindow } from '@react-google-maps/api';
import Image from 'next/image';

import logoImage from 'public/logo.png';

import { data } from '../../constants/data';
import { mapStyles } from '../../lib/google-maps/google-maps-styles';
import { ExternalLink } from '../../ui/external-link';

export type Coordinates = {
  lat: number;
  lng: number;
};

export type MapKey = {
  googleMapsApiKey: string;
};

const googleMapOptions = {
  // Loading styles
  styles: mapStyles,
  // Default UI
  disableDefaultUI: true,
  // Fullscreen
  fullscreenControl: true,
  // Pegman
  streetViewControl: true,
};

const Map = ({ googleMapsApiKey }: MapKey) => {
  // Size to draw Google Map
  const containerStyle = { height: '50vh', width: '100%' };

  // center coordinates of the map
  const center = useMemo(() => ({ lat: 38.267174119220755, lng: 140.29310681349253 }), []);

  const [selectedMarker, setSelectedMarker] = useState<Coordinates | null>(center);

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
      <div className="flex h-[50vh] items-center justify-center">
        <Typography variant="paragraph" className="font-notojp text-base font-normal">
          地図の読み込みに失敗しました。
        </Typography>
      </div>
    );

  return (
    <>
      {isLoaded && (
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
              <ExternalLink url={data.google.map} ariaLabel="手もみ整体 癒眠 Googleマップへ">
                <Image width={150} height={18} src={logoImage} alt={data.info.title} />
              </ExternalLink>
            </InfoWindow>
          )}
        </GoogleMap>
      )}
    </>
  );
};

export const GoogleMaps = () => {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (googleMapsApiKey === undefined) {
    console.log('');
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Typography variant="paragraph" className="font-notojp text-base font-normal">
          地図を表示できませんでした。
        </Typography>
      </div>
    );
  }
  return <Map googleMapsApiKey={googleMapsApiKey} />;
};
