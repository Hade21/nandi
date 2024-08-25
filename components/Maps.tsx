"use client";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { setOpenModal, setSelectedUnit } from "@/services/unitService";
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
  const selectedUnit = useAppSelector((state) => state.units.selectedUnit);
  const dispatch = useAppDispatch();

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
      return unit.locations?.some((location) => {
        return Number(location.lat) === lat && Number(location.long) === long;
      });
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

  return (
    <div>
      <GoogleMap
        mapContainerStyle={defaultMapsContainerStyle}
        zoom={10}
        onLoad={onLoad}
      >
        {markers &&
          markers.map((marker, index) => {
            let unitData = findUnit(units, marker.latitude, marker.longitude);
            if (marker.label === "Current Location") {
              return (
                <Marker
                  key={index}
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
                >
                  <OverlayView
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                    position={{ lat: marker.latitude, lng: marker.longitude }}
                  >
                    <div className="p-2 bg-white rounded-sm w-max -translate-x-1/2 left-1/2 translate-y-2 cursor-pointer hover:bg-opacity-60">
                      <p>{marker.label}</p>
                    </div>
                  </OverlayView>
                </Marker>
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
                      <div
                        className="p-2 bg-white rounded-sm w-max -translate-x-1/2 left-1/2 -translate-y-[235%] cursor-pointer hover:bg-opacity-60"
                        onClick={() => {
                          const unit = {
                            selectedUnit: {
                              id: unitData!.id ?? "",
                              egi: unitData!.egi ?? "",
                              name: unitData!.name ?? "",
                              type: unitData!.type ?? "",
                              locationName: marker.locationName!,
                            },
                          };
                          dispatch(setSelectedUnit(unit));
                        }}
                      >
                        <p>{marker.label}</p>
                      </div>
                    </PopoverTrigger>
                  </OverlayView>
                  <PopoverContent>
                    <CardUnit
                      egi={selectedUnit.egi}
                      name={selectedUnit.name}
                      type={selectedUnit.type}
                      locationName={selectedUnit.locationName!}
                      onClick={() => dispatch(setOpenModal(true))}
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
