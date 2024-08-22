"use client";
import { useAppSelector } from "@/hooks/reduxHooks";
import { MarkerTypes, UnitTypes } from "@/types";
import { GoogleMap, Marker, OverlayView } from "@react-google-maps/api";
import { SetStateAction, useCallback, useEffect, useState } from "react";
import CardUnit from "./CardUnit";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export const defaultMapsContainerStyle = {
  width: "100%",
  height: "100vh",
  borderRadius: "15px",
};

interface MapsProps {
  markers: MarkerTypes[];
}

const Maps = ({ markers }: MapsProps) => {
  const [maps, setMaps] = useState<google.maps.Map | null>(null);
  const units = useAppSelector((state) => state.units.units);

  const onLoad = useCallback(
    (maps: SetStateAction<google.maps.Map | null>) => setMaps(maps),
    []
  );

  const findUnit = (
    arr: UnitTypes[],
    lat: number,
    long: number
  ): UnitTypes | undefined => {
    const unit = arr.find((unit) => {
      if (unit.locations) {
        const found = unit.locations.filter(
          (coord) => Number(coord.lat) === lat && Number(coord.long) === long
        );
        if (found) return found;
      }
    });
    return unit;
  };

  useEffect(() => {
    if (maps && markers) {
      const bounds = new window.google.maps.LatLngBounds();
      markers.map((marker) => {
        bounds.extend({
          lat: marker.latitude,
          lng: marker.longitude,
        });
      });
      maps.fitBounds(bounds);
    }
  }, [maps, markers]);

  console.log("🚀 ~ Maps ~ markers:", markers);

  return (
    <div>
      <GoogleMap
        mapContainerStyle={defaultMapsContainerStyle}
        zoom={10}
        onLoad={onLoad}
      >
        {markers &&
          markers.map((marker, index) => {
            const unitData = findUnit(units, marker.latitude, marker.longitude);
            if (marker.label === "My Position") {
              return (
                <Marker
                  key={index}
                  label={marker.label}
                  position={{ lat: marker.latitude, lng: marker.longitude }}
                  animation={google.maps.Animation.BOUNCE}
                  icon={{
                    url: "/car.png",
                    scaledSize: {
                      width: 40,
                      height: 40,
                      equals: () => true,
                    },
                  }}
                />
              );
            }
            return (
              <Marker
                key={index}
                position={{ lat: marker.latitude, lng: marker.longitude }}
                animation={google.maps.Animation.DROP}
                icon={{
                  url: "/marker.png",
                  scaledSize: {
                    width: 40,
                    height: 40,
                    equals: () => true,
                  },
                }}
              >
                <Popover>
                  <OverlayView
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    position={{ lat: marker.latitude, lng: marker.longitude }}
                  >
                    <PopoverTrigger asChild>
                      <div className="p-2 bg-white rounded-sm w-max -translate-x-1/2 left-1/2 -translate-y-[235%] cursor-pointer">
                        <p>{marker.label}</p>
                      </div>
                    </PopoverTrigger>
                  </OverlayView>
                  <PopoverContent>
                    <CardUnit
                      egi={unitData ? unitData.egi : "Unit not found"}
                      name={unitData ? unitData.name : "Unit not found"}
                      type={unitData ? unitData.type : "Unit not found"}
                      locationName={marker.locationName!}
                    />
                  </PopoverContent>
                </Popover>
              </Marker>
            );
          })}
      </GoogleMap>
    </div>
  );
};

export default Maps;
