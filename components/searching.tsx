"use client";
import { WorkerProfessions } from "@/types/worker";
import { zodSearching, zodSearchingType } from "@/zod/searching";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Button } from "./ui/button";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "./ui/textarea";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { getPreciseLocation, COARSE_ACCURACY_THRESHOLD } from "@/helpers/getCurrentLocation";

export const Searching = ({
  setBookingDetails,
  setMapLoaded,
}: {
  setBookingDetails: (data: zodSearchingType) => void;
  setMapLoaded: (loaded: boolean) => void;
}) => {
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number | undefined;
    longitude: number | undefined;
  }>({ latitude: undefined, longitude: undefined });
  const [locationLoading, setLocationLoading] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [accuracyWarning, setAccuracyWarning] = useState<string | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [addressLoading, setAddressLoading] = useState<boolean>(false);

  const form = useForm<zodSearchingType>({
    resolver: zodResolver(zodSearching),
    defaultValues: {
      workNeededProfession: WorkerProfessions.OTHER,
      workNeededDescription: "",
      priceRange: 100,
      custLocation: {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      },
    },
  });

  // Function to reverse geocode coordinates to address
  const reverseGeocode = useCallback(async (latitude: number, longitude: number) => {
    try {
      setAddressLoading(true);
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.warn("Google Maps API key not found");
        return;
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );

      const data = await response.json();

      if (data.status === 'OK' && data.results && data.results.length > 0) {
        // Get the formatted address (first result is usually the most specific)
        const address = data.results[0].formatted_address;
        setCurrentAddress(address);
      } else {
        console.warn("Geocoding failed:", data.status);
        setCurrentAddress(null);
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      setCurrentAddress(null);
    } finally {
      setAddressLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchLocation = async () => {
      setLocationLoading(true);
      setAccuracyWarning(null);
      try {
        // Wait for GPS lock - minimum 2s so user sees "Locating..." (gives device time to warm up)
        const [coords] = await Promise.all([
          getPreciseLocation(),
          new Promise<void>((r) => setTimeout(r, 2000)),
        ]);
        
        console.log("coords: ", coords)
        const newLocation = { latitude: coords.latitude, longitude: coords.longitude };
        setCurrentLocation(newLocation);
        setLocationError(null);
        form.setValue("custLocation", newLocation);

        // Warn if accuracy is coarse (e.g. IP-based, indoor WiFi offset)
        if (coords.accuracy > COARSE_ACCURACY_THRESHOLD) {
          setAccuracyWarning(
            `Location accuracy is ~${Math.round(coords.accuracy)}m. For best results, try moving closer to a window or outdoors.`
          );
        } else {
          setAccuracyWarning(null);
        }

        await reverseGeocode(newLocation.latitude, newLocation.longitude);
      } catch (error) {
        console.log("Error on getting customer location", error);
        let errorMessage = "Unable to get your location. ";
        if (error instanceof Error && error.message === "Geolocation is not supported by your browser") {
          errorMessage = "Geolocation is not supported by your browser. Please use a modern browser or enable location services.";
        } else if (error && typeof error === "object" && "code" in error) {
          const geoError = error as GeolocationPositionError;
          switch (geoError.code) {
            case geoError.PERMISSION_DENIED:
              errorMessage += "Please allow location access in your browser settings. If accessing via IP address, try using HTTPS or localhost.";
              break;
            case geoError.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable.";
              break;
            case geoError.TIMEOUT:
              errorMessage += "Location request timed out. Please try again.";
              break;
            default:
              errorMessage += "An unknown error occurred. Please try again.";
              break;
          }
        }
        setLocationError(errorMessage);
        toast.error(errorMessage, { duration: 5000, position: 'top-center' });
      } finally {
        setLocationLoading(false);
      }
    };
    fetchLocation();
  }, [form, reverseGeocode]);

  // Also reverse geocode if default location is set on mount
  useEffect(() => {
    if (currentLocation.latitude && currentLocation.longitude && !locationLoading && !currentAddress && !addressLoading) {
      reverseGeocode(currentLocation.latitude, currentLocation.longitude);
    }
  }, [currentLocation.latitude, currentLocation.longitude, locationLoading, currentAddress, addressLoading, reverseGeocode]);

  const onSubmit = (data: zodSearchingType) => {
    // Check if location is available before submitting
    if (!data.custLocation.latitude || !data.custLocation.longitude) {
      toast.error("Please allow location access to find nearby professionals", {
        duration: 4000,
        position: 'top-center'
      });
      return;
    }

    // console.log("find professionals clicked");
    // console.log("Submitting with location:", data.custLocation);
    setBookingDetails(data);
    setMapLoaded(true);
    toast.success("Finding Professionals...", { duration: 3000, position: 'top-center' })
  };

  return (
    <div className="search-container flex items-center justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(onSubmit)(e);
        }}
        className="flex flex-col gap-4 w-[400px] h-auto"
      >
        {/* Location Status */}
        {locationLoading && (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="animate-spin">⏳</span>
            Locating... (using GPS for best accuracy)
          </div>
        )}
        {locationError && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {locationError}
          </div>
        )}
        {accuracyWarning && (
          <div className="text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-md flex items-start gap-2">
            <span>⚠</span>
            <span>{accuracyWarning}</span>
          </div>
        )}
        {!locationLoading && !locationError && currentLocation.latitude && currentLocation.longitude && (
          <div className="text-sm text-green-600 bg-green-50 dark:bg-green-950 p-3 rounded-md">
            {addressLoading ? (
              <div className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                Getting address...
              </div>
            ) : currentAddress ? (
              <div className="flex items-start gap-2">
                <span>✓</span>
                <span>Location: {currentAddress}</span>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <span>✓</span>
                <span>Location found: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}</span>
              </div>
            )}
          </div>
        )}

        <Field>
          <FieldLabel>Profession Needed</FieldLabel>
          <Controller
            name="workNeededProfession"
            control={form.control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value as WorkerProfessions);
                }}
              >
                <SelectTrigger className="w-[180px] bg-foreground/10">
                  <SelectValue placeholder="Select Profession" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Professions</SelectLabel>
                    <SelectItem value={WorkerProfessions.ELECTRICIAN}>
                      Electrician
                    </SelectItem>
                    <SelectItem value={WorkerProfessions.AC_TECHNICIAN}>
                      A/C Technician
                    </SelectItem>
                    <SelectItem value={WorkerProfessions.CARPENTER}>
                      Carpenter
                    </SelectItem>
                    <SelectItem value={WorkerProfessions.CLEANER}>
                      Cleaner
                    </SelectItem>
                    <SelectItem value={WorkerProfessions.LABOUR}>Labour</SelectItem>
                    <SelectItem value={WorkerProfessions.MASON}>Mason</SelectItem>
                    <SelectItem value={WorkerProfessions.PAINTER}>
                      Painter
                    </SelectItem>
                    <SelectItem value={WorkerProfessions.PIP_EFITTER}>
                      Pip Efitter
                    </SelectItem>
                    <SelectItem value={WorkerProfessions.PLUMBER}>
                      Plumber
                    </SelectItem>
                    <SelectItem value={WorkerProfessions.WELDER}>Welder</SelectItem>
                    <SelectItem value={WorkerProfessions.OTHER}>Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <FieldError
            errors={
              form.formState.errors.workNeededProfession?.message
                ? [
                  {
                    message:
                      form.formState.errors.workNeededProfession?.message,
                  },
                ]
                : undefined
            }
          ></FieldError>
        </Field>

        <Field>
          <FieldLabel>Price Range</FieldLabel>
          <Controller
            name="priceRange"
            control={form.control}
            render={({ field }) => (
              <Select
                value={field.value?.toString() ?? ''}
                onValueChange={(value) => {
                  field.onChange(Number(value));
                }}
              >
                <SelectTrigger className="w-[180px] bg-foreground/10">
                  <SelectValue placeholder="Select Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Price Range</SelectLabel>
                    <SelectItem value={"100"}>₹100</SelectItem>
                    <SelectItem value={"200"}>₹200</SelectItem>
                    <SelectItem value={"300"}>₹300</SelectItem>
                    <SelectItem value={"400"}>₹400</SelectItem>
                    <SelectItem value={"500"}>₹500</SelectItem>
                    <SelectItem value={"600"}>₹600</SelectItem>
                    <SelectItem value={"700"}>₹700</SelectItem>
                    <SelectItem value={"800"}>₹800</SelectItem>
                    <SelectItem value={"900"}>₹900</SelectItem>
                    <SelectItem value={"1000"}>₹1000</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          <FieldError
            errors={
              form.formState.errors.priceRange?.message
                ? [
                  {
                    message:
                      form.formState.errors.priceRange?.message,
                  },
                ]
                : undefined
            }
          ></FieldError>
        </Field>


        <Field>
          <FieldLabel>Description</FieldLabel>
          <Textarea
            className="bg-foreground/10"
            placeholder="Describe the work needed"
            rows={4}
            {...form.register("workNeededDescription")}
          />
          <FieldError
            errors={
              form.formState.errors.workNeededDescription?.message
                ? [
                  {
                    message:
                      form.formState.errors.workNeededDescription?.message,
                  },
                ]
                : undefined
            }
          ></FieldError>
        </Field>
        <Button
          type="submit"
          variant="default"
          className="cursor-pointer hover:bg-orange-600"
        // disabled={locationLoading || !currentLocation.latitude || !currentLocation.longitude}
        >
          {locationLoading ? "Getting Location..." : "Find Professionals"}
        </Button>
      </form>
    </div>
  );
};
