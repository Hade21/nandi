"use client";
import Loading from "@/app/loading";
import useNetworkStatus from "@/hooks/networkStatus";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { GetTokenCookies } from "@/lib/tokenCookies";
import {
  useGetUnitsQuery,
  useUpdateLocationMutation,
} from "@/services/unitApi";
import {
  setMarkers,
  setOpenModal,
  setSelectedUnit,
} from "@/services/unitService";
import { MarkerTypes } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Maps from "./Maps";
import SearchBox from "./SearchBox";
import ThemeSwitcher from "./ThemeSwitcher";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

interface UnitData {
  id: string;
  long: string;
  lat: string;
  alt: string;
  location: string;
  dateTime: string;
  accessToken: string;
}

const MapsDataProvider = () => {
  const { isLoading, data, error } = useGetUnitsQuery();
  const [updateLocation] = useUpdateLocationMutation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isOnline } = useNetworkStatus();
  const markers = useAppSelector((state) => state.units.markers);
  const searchQuery = useAppSelector((state) => state.units.searchQuery);
  const isUpdating = useAppSelector((state) => state.units.isUpdating);
  const [location, setLocation] = useState<MarkerTypes | undefined>(undefined);

  useEffect(() => {
    const update = async (data: UnitData[]) => {
      const token = await GetTokenCookies();
      if (!token.data) {
        toast({
          title: "There is pending update exist",
          description:
            "Please login and stay connected to continue updating location",
          variant: "default",
          action: (
            <Button
              onClick={() => {
                router.push("/login");
              }}
            >
              Login
            </Button>
          ),
        });
        return;
      }
      if (token.data) {
        if (data.length > 0) {
          toast({
            title: "There is pending update exist",
            description:
              "Make sure you've logged in and your connection is alive",
            variant: "default",
          });
          data.forEach((unit: UnitData) => {
            updateLocation({
              ...unit,
              accessToken: token.data.accessToken,
            });
          });
        }
        localStorage.removeItem("updatePending");
        return;
      }
    };

    const pendingUpdate = localStorage.getItem("updatePending");
    const storedData = pendingUpdate ? JSON.parse(pendingUpdate) : [];
    if (storedData.length > 0) {
      update(storedData);
    }
  }, [router, updateLocation, isOnline]);
  useEffect(() => {
    if (searchQuery && data) {
      const unit = data?.data.filter((units) => {
        return units.id === searchQuery;
      });
      const latestLocation = unit![0].locations!.slice(-1)[0];
      if (!latestLocation) {
        toast({
          title: "Location not found",
          description: "Please set location",
        });
        dispatch(setOpenModal(true));
        const selectedUnit: any = {
          selectedUnit: {
            id: unit![0].id ?? "",
            egi: unit![0].egi ?? "",
            name: unit![0].name ?? "",
            type: unit![0].type ?? "",
            locationName: "",
            timeStamp: "",
          },
        };
        dispatch(setSelectedUnit(selectedUnit));
        return;
      }
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
    } else if (data && data.data.length > 0) {
      const locations: MarkerTypes[] = [];
      if (data?.data.length > 0) {
        data?.data.forEach((unit, index) => {
          if (
            data.data[index].locations &&
            data.data[index]!.locations.length > 0
          ) {
            locations.push({
              latitude: Number(unit.locations![unit.locations!.length - 1].lat),
              longitude: Number(
                unit.locations![unit.locations!.length - 1].long
              ),
              label: unit.name,
              locationName:
                unit.locations![unit.locations!.length - 1].location,
              timeStamp: unit.locations![unit.locations!.length - 1].dateTime,
            });
          }
        });
      }
      dispatch(setMarkers(locations));
    }
  }, [data, dispatch, searchQuery]);
  useEffect(() => {
    if (!isUpdating) {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          (position) => {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              label: "Current Location",
              heading: position.coords.heading,
            };

            setLocation(location);
          },
          (error) => {},
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
