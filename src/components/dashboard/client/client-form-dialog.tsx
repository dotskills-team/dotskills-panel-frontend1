/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientSchema } from "@/features/clients/schemas/client.schema";
import { CLIENT_TYPE_OPTIONS } from "@/features/clients/constants/client.constant";
import type { IClient } from "@/types/clients";
import type { CreateClientValues } from "@/features/clients/schemas/client.schema";
import { Loader2 } from "lucide-react";

interface ClientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: IClient;
  onSubmit: (data: CreateClientValues) => Promise<void>;
  isSubmitting?: boolean;
}

const EMPTY_VALUES: CreateClientValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  alternatePhone: "",
  companyName: "",
  companyWebsite: "",
  industry: "",
  companySize: "",
  taxId: "",
  clientType: CLIENT_TYPE_OPTIONS[0].value,
  country: "",
  state: "",
  city: "",
  zipCode: "",
  address: "",
  estimatedValue: undefined,
  budget: undefined,
  timeline: "",
  requirementTitle: "",
  requirementDescription: "",
  tags: [],
  labels: [],
  technologies: [],
  services: [],
};

const clientToFormValues = (client: IClient): CreateClientValues => ({
  firstName: client.firstName || client.leadId?.firstName || "",
  lastName: client.lastName || client.leadId?.lastName || "",
  email: client.email || client.leadId?.email || "",
  phone: client.phone || client.leadId?.phone || "",
  alternatePhone: client.alternatePhone ?? "",
  companyName: client.companyName ?? "",
  companyWebsite: client.companyWebsite ?? "",
  industry: client.industry ?? "",
  companySize: client.companySize ?? "",
  taxId: client.taxId ?? "",
  clientType: client.clientType,
  country: client.country ?? "",
  state: client.state ?? "",
  city: client.city ?? "",
  zipCode: client.zipCode ?? "",
  address: client.address ?? "",
  estimatedValue: client.estimatedValue,
  budget: client.budget,
  timeline: client.timeline ?? "",
  requirementTitle: client.requirementTitle ?? "",
  requirementDescription: client.requirementDescription ?? "",
  tags: client.tags ?? [],
  labels: client.labels ?? [],
  technologies: client.technologies ?? [],
  services: client.services ?? [],
});

export function ClientFormDialog({
  open,
  onOpenChange,
  client,
  onSubmit,
  isSubmitting,
}: ClientFormDialogProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateClientValues>({
    resolver: zodResolver(createClientSchema as any),
    defaultValues: client ? clientToFormValues(client) : EMPTY_VALUES,
  });

  useEffect(() => {
    if (open) {
      reset(client ? clientToFormValues(client) : EMPTY_VALUES);
    }
  }, [open, client, reset]);

  const watchedClientType = watch("clientType");

  const handleFormSubmit = async (data: CreateClientValues) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {client ? "Edit Client" : "Create New Client"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Identity */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="client-firstName">First Name</Label>
              <Input
                id="client-firstName"
                placeholder="John"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="client-lastName">Last Name</Label>
              <Input
                id="client-lastName"
                placeholder="Doe"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="client-email">Email</Label>
              <Input
                id="client-email"
                placeholder="john@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="client-phone">Phone</Label>
              <Input
                id="client-phone"
                placeholder="+1 (555) 000-0000"
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="client-alternatePhone">Alternate Phone</Label>
              <Input
                id="client-alternatePhone"
                placeholder="+1 (555) 111-2222"
                {...register("alternatePhone")}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Client Type</Label>
              <Select
                value={watchedClientType}
                onValueChange={(v) =>
                  setValue(
                    "clientType",
                    v as CreateClientValues["clientType"],
                    {
                      shouldValidate: true,
                    },
                  )
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {CLIENT_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.clientType && (
                <p className="text-sm text-destructive">
                  {errors.clientType.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Company */}
          <div className="space-y-3 border-t pt-4">
            <p className="text-sm font-medium text-foreground">Company</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="client-companyName">Company Name</Label>
                <Input
                  id="client-companyName"
                  placeholder="Your Company"
                  {...register("companyName")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="client-industry">Industry</Label>
                <Input
                  id="client-industry"
                  placeholder="Technology"
                  {...register("industry")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="client-companyWebsite">Website</Label>
                <Input
                  id="client-companyWebsite"
                  placeholder="https://example.com"
                  {...register("companyWebsite")}
                />
                {errors.companyWebsite && (
                  <p className="text-sm text-destructive">
                    {errors.companyWebsite.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="client-companySize">Company Size</Label>
                <Input
                  id="client-companySize"
                  placeholder="50 - 200"
                  {...register("companySize")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="client-taxId">Tax ID</Label>
                <Input
                  id="client-taxId"
                  placeholder="Optional"
                  {...register("taxId")}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3 border-t pt-4">
            <p className="text-sm font-medium text-foreground">Location</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="client-country">Country</Label>
                <Input id="client-country" {...register("country")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="client-state">State</Label>
                <Input id="client-state" {...register("state")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="client-city">City</Label>
                <Input id="client-city" {...register("city")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="client-zipCode">Zip Code</Label>
                <Input id="client-zipCode" {...register("zipCode")} />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="client-address">Address</Label>
                <Input id="client-address" {...register("address")} />
              </div>
            </div>
          </div>

          {/* Deal / requirement */}
          <div className="space-y-3 border-t pt-4">
            <p className="text-sm font-medium text-foreground">Deal details</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="client-estimatedValue">
                  Estimated Value (৳)
                </Label>
                <Input
                  id="client-estimatedValue"
                  type="number"
                  min={0}
                  {...register("estimatedValue")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="client-budget">Budget (৳)</Label>
                <Input
                  id="client-budget"
                  type="number"
                  min={0}
                  {...register("budget")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="client-timeline">Timeline</Label>
                <Input
                  id="client-timeline"
                  placeholder="3-6 months"
                  {...register("timeline")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="client-requirementTitle">
                  Requirement Title
                </Label>
                <Input
                  id="client-requirementTitle"
                  placeholder="Enterprise rollout"
                  {...register("requirementTitle")}
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="client-requirementDescription">
                  Requirement Description
                </Label>
                <Textarea
                  id="client-requirementDescription"
                  rows={3}
                  {...register("requirementDescription")}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 bg-indigo-600 text-white transition-transform duration-200 hover:scale-[1.02] hover:bg-indigo-700"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {client ? "Update Client" : "Create Client"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
