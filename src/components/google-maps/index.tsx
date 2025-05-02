"use client";

import {
  APIProvider,
  AdvancedMarker,
  Map,
  Pin,
} from "@vis.gl/react-google-maps";
import Image from "next/image";
import { useMemo } from "react";

import google_pin from "./assets/google-pin.png";
import { coordinates } from "./data";

import { useConfig } from "@/contexts/config-context";

export default function GoogleMap() {
  const center = useMemo(() => coordinates, []);
  const { APP_NAME } = useConfig();

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
      <Map
        defaultCenter={center}
        defaultZoom={16}
        gestureHandling={"greedy"}
        mapId={String(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)}
        className="h-[50svh] w-full *:!bg-transparent [&_iframe+div]:rounded-lg [&_iframe+div]:!border-[#F1F3F4]"
      >
        <AdvancedMarker position={center} title={APP_NAME}>
          <Pin
            background={"#6DBE44"}
            glyphColor={"#4BB157"}
            borderColor={"#4BB157"}
            scale={1.5}
          >
            <Image src={google_pin} alt="" />
          </Pin>
        </AdvancedMarker>
      </Map>
    </APIProvider>
  );
}
