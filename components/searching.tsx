"use client";
import { WorkerProfessions } from "@/types/worker";
import { zodSearching, zodSearchingType } from "@/zod/searching";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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


export const Searching = () => {
  const form = useForm<zodSearchingType>({
    resolver: zodResolver(zodSearching),
    defaultValues: {
      workNeededProfession: WorkerProfessions.OTHER,
      workNeededDescription: "",
      custLocation: {
        latitude: 0,
        longitude: 0,
      },
    },
  });

  const onSubmit = (data: zodSearchingType) => {
    console.log(data);
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
        <Field>
          <FieldLabel>Your Location</FieldLabel>
          <Input type="text" placeholder="Choose your location" />
          <FieldError
            errors={
              form.formState.errors.custLocation?.message
                ? [{ message: form.formState.errors.custLocation?.message }]
                : undefined
            }
          ></FieldError>
        </Field>

        <Field>
          <FieldLabel>Profession Needed</FieldLabel>
          <Select>
            <SelectTrigger className="w-[180px]">
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
          <FieldError
            errors={
              form.formState.errors.workNeededProfession?.message
                ? [{ message: form.formState.errors.workNeededProfession?.message }]
                : undefined
              }
            ></FieldError>
        </Field>
        <Field>
          <FieldLabel>Description</FieldLabel>
          <Textarea placeholder="Describe the work needed" rows={4} />
          <FieldError
            errors={
              form.formState.errors.workNeededDescription?.message
                ? [{ message: form.formState.errors.workNeededDescription?.message }]
                : undefined
              }
            ></FieldError>
        </Field>
        <Button type="submit" variant="outline">Find Professionals</Button>
      </form>
    </div>
  );
}
