"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/app/loading";
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindow,
} from "@react-google-maps/api";
import { MapInterface } from "../utiles/google-maps-styles";

const googleMapOptions = {
  styles: MapInterface,
};

function Map({ googleMapsApiKey }: MapProps) {
  const containerStyle = { height: "50vh", width: "100%" };

  const center = useMemo(
    () => ({ lat: 38.267174119220755, lng: 140.29310681349253 }),
    []
  );

  const [selectedMarker, setSelectedMarker] = useState<Coordinates | null>(
    center
  );

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

  if (loadError) return <div>地図を読み込み中です。</div>;

  return (
    <>
      {isLoaded ? (
        <GoogleMap
          options={googleMapOptions}
          zoom={15}
          center={center}
          mapContainerStyle={containerStyle}
          onLoad={() => createOffsetSize()}
        >
          <MarkerF
            position={center}
            onClick={() => {
              setSelectedMarker(center);
            }}
            icon={"https://maps.google.com/mapfiles/kml/pal3/icon56.png"}
          />
          {selectedMarker && (
            <InfoWindow
              onCloseClick={() => {
                setSelectedMarker(null);
              }}
              position={center}
              options={infoWindowOptions}
            >
              <Link href="https://goo.gl/maps/GJBU6sFQGz2it5g1A">
                <Image
                  width={150}
                  height={18}
                  src={"/images/logo.png"}
                  alt="Logo"
                />
              </Link>
            </InfoWindow>
          )}
        </GoogleMap>
      ) : (
        <Loading />
      )}
    </>
  );
}

const GoogleMaps = () => {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (googleMapsApiKey === undefined) {
    return <div>地図を表示できませんでした。</div>;
  }
  return <Map googleMapsApiKey={googleMapsApiKey} />;
};

export default GoogleMaps;
