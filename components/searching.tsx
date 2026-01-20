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
import { useEffect, useState } from "react";

export const Searching = ({
  setBookingDetails,
  bookingDetails,
  setMapLoaded,
}: {
  setBookingDetails: (data: zodSearchingType) => void;
  bookingDetails: zodSearchingType | null;
  setMapLoaded: (loaded: boolean) => void;
}) => {
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number | undefined;
    longitude: number | undefined;
  }>({ latitude: undefined, longitude: undefined });

  const form = useForm<zodSearchingType>({
    resolver: zodResolver(zodSearching),
    defaultValues: {
      workNeededProfession: WorkerProfessions.OTHER,
      workNeededDescription: "",
      custLocation: {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      },
    },
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setCurrentLocation(newLocation);
          // Update form with location when obtained
          form.setValue("custLocation", {
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
          });
        },
        (error) => {
          console.log("Error on getting customer location", error);
        }
      );
    }
  }, [form]);

  const onSubmit = (data: zodSearchingType) => {
    // console.log(data);
    setBookingDetails(data);
    setMapLoaded(true);
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
        {/* <Field>
          <FieldLabel>Your Location</FieldLabel>
          <Input className="bg-foreground/10" type="text" placeholder="Choose your location" />
          <FieldError
            errors={
              form.formState.errors.custLocation?.message
                ? [{ message: form.formState.errors.custLocation?.message }]
                : undefined
            }
          ></FieldError>
        </Field> */}

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
        <Button type="submit" variant="default" className="cursor-pointer">
          Find Professionals
        </Button>
      </form>
    </div>
  );
};
