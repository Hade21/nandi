"use client";
import Loading from "@/app/loading";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { useGetUnitsQuery } from "@/services/unitApi";
import { setMarkers, setUnits } from "@/services/unitService";
import { MarkerTypes } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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

  useEffect(() => {
    if (searchQuery) {
      const unit = data?.data.filter((unit) => unit.id === searchQuery);
      const location = [
        {
          latitude: Number(unit![0].locations![0].lat),
          longitude: Number(unit![0].locations![0].long),
          label: unit![0].name,
          locationName: unit![0].locations![0].location,
        },
      ];
      dispatch(setMarkers(location));
    } else {
      const locations: MarkerTypes[] = [];
      data?.data.forEach((unit) => {
        locations.push({
          latitude: Number(unit.locations![0].lat),
          longitude: Number(unit.locations![0].long),
          label: unit.name,
          locationName: unit.locations![0].location,
        });
      });
      dispatch(setMarkers(locations));
    }
  }, [data?.data, dispatch, searchQuery]);
  useEffect(() => {
    if (data) {
      dispatch(setUnits(data.data));
      const unitMarkers: MarkerTypes[] = data.data.map((unit) => {
        return {
          latitude: Number(unit.locations![0].lat),
          longitude: Number(unit.locations![0].long),
          label: unit.name,
          locationName: unit.locations![0].location,
        };
      });
      dispatch(setMarkers(unitMarkers));
    }
  }, [data, dispatch]);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          label: "Current Location",
        };
        dispatch(setMarkers([location]));
      });
    } else {
      toast({
        title: "Your location cannot be determined",
        description: "Please enable geolocation on your browser.",
        variant: "destructive",
      });
    }
    return () => {
      navigator.geolocation.clearWatch(0);
    };
  }, [dispatch]);

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
      <div className="search z-10 absolute w-1/3 top-2.5 left-1/2 -translate-x-1/2">
        <SearchBox />
      </div>
      <div className="theme absolute top-2.5 right-16 z-10">
        <ThemeSwitcher />
      </div>
      {markers && <Maps markers={markers} />}
    </div>
  );
};

export default MapsDataProvider;
