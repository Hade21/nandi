"use client";
import Loading from "@/app/loading";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { useGetUnitsQuery } from "@/services/unitApi";
import { setMarkers, setUnits } from "@/services/unitService";
import { MarkerTypes, UnitTypes } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Maps from "./Maps";
import SearchBox from "./SearchBox";
import ThemeSwitcher from "./ThemeSwitcher";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

const MapsDataProvider = () => {
  const { isLoading, data, error } = useGetUnitsQuery();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const markers = useAppSelector((state) => state.units.markers);
  const searchQuery = useAppSelector((state) => state.units.searchQuery);
  const isUpdating = useAppSelector((state) => state.units.isUpdating);
  const [location, setLocation] = useState<MarkerTypes | undefined>(undefined);

  useEffect(() => {
    if (searchQuery) {
      const unit = data?.data.filter((units) => {
        return units.id === searchQuery;
      });
      const latestLocation = unit![0].locations!.slice(-1)[0];
      const location = [
        {
          latitude: Number(latestLocation!.lat),
          longitude: Number(latestLocation!.long),
          label: unit![0].name,
          locationName: latestLocation!.location,
          timeStamp: latestLocation!.dateTime,
        },
      ];
      dispatch(setMarkers(location));
    } else if (data?.data && data.data.length > 0) {
      const locations: MarkerTypes[] = [];
      if (data?.data.length > 0) {
        data?.data.forEach((unit) => {
          locations.push({
            latitude: Number(unit.locations![unit.locations!.length - 1].lat),
            longitude: Number(unit.locations![unit.locations!.length - 1].long),
            label: unit.name,
            locationName: unit.locations![unit.locations!.length - 1].location,
            timeStamp: unit.locations![unit.locations!.length - 1].dateTime,
          });
        });
      }
      dispatch(setMarkers(locations));
    }
  }, [data?.data, dispatch, searchQuery]);
  useEffect(() => {
    if (data?.data && data?.data.length > 0) {
      dispatch(setUnits(data.data));
      if (data.data[0].locations && data.data[0]!.locations.length > 0) {
        console.log(data.data);
        const unitMarkers: MarkerTypes[] = data.data.map((unit: UnitTypes) => {
          return {
            latitude: Number(unit.locations![unit.locations!.length - 1].lat),
            longitude: Number(unit.locations![unit.locations!.length - 1].long),
            label: unit.name,
            locationName: unit.locations![unit.locations!.length - 1].location,
            timeStamp: unit.locations![unit.locations!.length - 1].dateTime,
          };
        });
        dispatch(setMarkers(unitMarkers));
      }
    }
  }, [data, dispatch]);
  useEffect(() => {
    if (!isUpdating) {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              label: "Current Location",
            };
            setLocation(location);
          },
          (error) => {
            console.log(error);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000,
          }
        );
      } else {
        toast({
          title: "Your location cannot be determined",
          description: "Please enable geolocation on your browser.",
          variant: "destructive",
        });
      }
    }
    return () => {
      navigator.geolocation.clearWatch(0);
    };
  }, [isUpdating, location]);

  if (isLoading) return <Loading />;

  if (error)
    return (
      <div className="w-full h-full flex justify-center items-center gap-3 min-h-screen flex-col">
        <h1 className="text-xl font-bold">Error loading data</h1>
        <h2>Please check your internet connection and try again</h2>
        <Button variant="secondary" onClick={() => router.refresh()}>
          Refresh
        </Button>
      </div>
    );

  return (
    <div className="relative">
      <div className="search z-10 absolute w-1/3 sm:top-2.5 sm:left-1/2 sm:-translate-x-1/2 top-14 left-2 min-w-48">
        <SearchBox />
      </div>
      <div className="theme absolute top-2.5 right-16 z-10">
        <ThemeSwitcher />
      </div>
      {markers && <Maps markers={markers} myLocation={location} />}
    </div>
  );
};

export default MapsDataProvider;
