"use client";
import useNetworkStatus from "@/hooks/networkStatus";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { GetTokenCookies } from "@/lib/tokenCookies";
import { useUpdateLocationMutation } from "@/services/unitApi";
import {
  setIsUpdating,
  setMarkers,
  setOpenModal,
  setPinMaps,
} from "@/services/unitService";
import { MarkerTypes } from "@/types";
import { locationNameSchema } from "@/validator/unit";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TailSpin } from "react-loader-spinner";
import AlertDialogLocation from "./AlertDialogLocation";
import RetrievingLocation from "./RetrievingLocation";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { toast } from "./ui/use-toast";

const ChangeLocationCard = () => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [savingLocation, setSavingLocation] = useState<boolean>(false);
  const [locationLoading, setLocationLoading] = useState<boolean>(false);
  const [unitData, setUnitData] = useState({
    id: "",
    dateTime: "",
    lat: "",
    long: "",
    alt: "",
    locationName: "",
  });
  const isOpen = useAppSelector((state) => state.units.openModal);
  const selectedUnit = useAppSelector((state) => state.units.selectedUnit);
  const { id, name, type, egi, locationName } = useAppSelector(
    (state) => state.units.selectedUnit
  );
  const markers = useAppSelector((state) => state.units.markers);
  const units = useAppSelector((state) => state.units.units);
  const pinMaps = useAppSelector((state) => state.units.pinMaps);
  const dispatch = useAppDispatch();
  const { isOnline } = useNetworkStatus();
  const [updateLocation, { isLoading, error, data }] =
    useUpdateLocationMutation();
  const form = useForm<Pick<MarkerTypes, "locationName">>({
    resolver: zodResolver(locationNameSchema),
  });

  async function onSubmit() {
    setSavingLocation(true);
    const body = {
      long: pinMaps ? markers[0].longitude.toString() : unitData.long,
      lat: pinMaps ? markers[0].latitude.toString() : unitData.lat,
      alt: unitData.alt ?? "unknown",
      location: form.getValues("locationName")!,
      dateTime: unitData.dateTime,
    };

    if (!isOnline) {
      const pendingUpdate = localStorage.getItem("updatePending");
      const storedData = pendingUpdate ? JSON.parse(pendingUpdate) : [];
      storedData.push({
        id: unitData.id,
        ...body,
        accessToken: "",
      });
      localStorage.setItem("updatePending", JSON.stringify(storedData));
      dispatch(setOpenModal(false));
      dispatch(setIsUpdating(false));
      dispatch(setPinMaps(false));
      toast({
        title: "No Connection",
        description: "Update will stored and uploaded when connection is alive",
        variant: "default",
      });
      setSavingLocation(false);
      const location = {
        latitude: Number(markers[0].latitude),
        longitude: Number(markers[0].longitude),
        label: selectedUnit.name,
        locationName: markers[0].locationName,
      };
      dispatch(setMarkers([location]));
      return;
    }
    const res = await GetTokenCookies();

    if (!res.data) {
      toast({
        title: "Unauthorized",
        description: "Please login to update location",
        variant: "destructive",
      });
      return;
    }
    if (res.data) {
      updateLocation({
        id: unitData.id,
        ...body,
        accessToken: res.data.accessToken,
      });
    }
  }
  const useGPSLocation = () => {
    setLocationLoading(true);
    dispatch(setIsUpdating(true));
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            label: name,
          };
          setLocationLoading(false);
          dispatch(setMarkers([location]));
          setUnitData({
            lat: position.coords.latitude.toString(),
            long: position.coords.longitude.toString(),
            alt: position.coords.altitude?.toString() ?? "100",
            id,
            locationName: name,
            dateTime: new Date().toISOString(),
          });
        },
        (error) => {
          toast({
            title: "Your location cannot be determined",
            description: "Please enable geolocation on your browser.",
            variant: "destructive",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    }
  };
  const pinOnMap = () => {
    const unit = units.filter((unit) => unit.id === id)[0];
    if (!unit.locations?.length) {
      toast({
        title: "Not Available",
        description:
          "For initial location please add location by your GPS location first",
        variant: "destructive",
      });
      dispatch(setOpenModal(false));
      return;
    }
    dispatch(setIsUpdating(true));
    dispatch(setPinMaps(true));
    toast({
      title: "Pin on Map",
      description: "Pin on map to update location",
      variant: "default",
    });
    dispatch(
      setMarkers([
        {
          latitude: Number(unit.locations![unit.locations!.length - 1].lat),
          longitude: Number(unit.locations![unit.locations!.length - 1].long),
          label: unit.name,
        },
      ])
    );
    setUnitData({
      lat: unit.locations![unit.locations!.length - 1].lat.toString(),
      long: unit.locations![unit.locations!.length - 1].long.toString(),
      alt: unit.locations![unit.locations!.length - 1].alt.toString(),
      id,
      locationName: name,
      dateTime: new Date().toISOString(),
    });
  };

  useEffect(() => {
    if (isLoading) setSavingLocation(true);
    if (!isLoading) setSavingLocation(false);
  }, [isLoading]);
  useEffect(() => {
    form.setValue("locationName", locationName);
  }, [form, locationName]);
  useEffect(() => {
    if (isOpen) {
      setDialogOpen(true);
    }
  }, [isOpen]);
  useEffect(() => {
    if (data) {
      toast({
        title: "Location updated",
        description: "Location updated successfully",
      });
      dispatch(setOpenModal(false));
      dispatch(setIsUpdating(false));
      setSavingLocation(false);
    }
  }, [data, dispatch]);
  useEffect(() => {
    if (error) {
      const body = {
        long: pinMaps ? markers[0].longitude.toString() : unitData.long,
        lat: pinMaps ? markers[0].latitude.toString() : unitData.lat,
        alt: unitData.alt ?? "unknown",
        location: form.getValues("locationName")!,
        dateTime: unitData.dateTime,
      };
      const pendingUpdate = localStorage.getItem("updatePending");
      const storedData = pendingUpdate ? JSON.parse(pendingUpdate) : [];
      storedData.push({
        id: unitData.id,
        ...body,
        accessToken: "",
      });
      localStorage.setItem("updatePending", JSON.stringify(storedData));
      toast({
        title: "Failed to update location",
        description: "Don't worry! we'll keep these data and try again later",
        variant: "default",
      });
      setSavingLocation(false);
    }
  }, [
    error,
    form,
    markers,
    pinMaps,
    unitData.alt,
    unitData.dateTime,
    unitData.id,
    unitData.lat,
    unitData.long,
  ]);

  return (
    <motion.div
      animate={
        isOpen
          ? {
              y: 0,
              opacity: 1,
              filter: "blur(0px)",
              display: "block",
              height: "fit-content",
            }
          : {
              y: 100,
              opacity: 0,
              filter: "blur(10px)",
              display: "none",
              height: 0,
            }
      }
      className="p-4 rounded-t-md bg-white dark:bg-slate-950 absolute bottom-0 w-full"
    >
      <div>
        <Form {...form}>
          <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <h1 className="text-center font-semibold text-lg">{name}</h1>
            <Separator />
            <div className="flex items-center space-x-2 h-6">
              <p className="w-1/3 text-sm">Type</p>
              <Separator orientation="vertical" />
              <p className="text-sm font-semibold">{type}</p>
            </div>
            <div className="flex items-center space-x-2 h-6">
              <p className="w-1/3 text-sm">EGI</p>
              <Separator orientation="vertical" />
              <p className="text-sm font-semibold">{egi}</p>
            </div>
            <div className="flex items-center space-x-2 h-7 mt-4">
              <p className="w-1/3 text-sm">Location</p>
              <Separator orientation="vertical" />
              <FormField
                control={form.control}
                name="locationName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Location Name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex pt-4 justify-center">
              <Button
                type="submit"
                disabled={savingLocation}
                className="flex gap-2"
              >
                {savingLocation && (
                  <TailSpin height="20" width="20" color="#000" />
                )}
                Save Location
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <AlertDialogLocation
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        useGPSLocation={useGPSLocation}
        pinOnMap={pinOnMap}
      />
      <RetrievingLocation isOpen={locationLoading} />
    </motion.div>
  );
};

export default ChangeLocationCard;
