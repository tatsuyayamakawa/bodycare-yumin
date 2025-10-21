import type { Coordinates, GoogleMapsStyles } from "./types";

export const coordinates: Coordinates = {
  lat: 38.267174119220755,
  lng: 140.29310681349253,
} as const;

export const googleMapsStyles: GoogleMapsStyles = {
  container: {
    base: "w-full h-[300px] md:h-[400px]",
  },
  map: {
    base: "w-full h-full",
  },
} as const;
