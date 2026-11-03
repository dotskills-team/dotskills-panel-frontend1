"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CURRENCY_OPTIONS,
  PAID_BY_OPTIONS,
  STATUS_OPTIONS,
} from "@/features/domain-hosting/constants/domain-hosting.constant";
import {
  useCreateDomain,
  useUpdateDomain,
} from "@/features/domain-hosting/hooks/use-domain-hosting";
import {
  domainFormSchema,
  type DomainFormValues,
} from "@/features/domain-hosting/schemas/domain-hosting.schema";
import {
  buildDomainPayload,
  domainToFormValues,
} from "@/features/domain-hosting/utils/domain-hosting.payload";
import { getErrorMessage } from "@/utils/getErrorMessage";
import type { DomainRecord, ProjectOption } from "@/types/domain-hosting.types";

interface DomainFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Omit to create a new domain. */
  record?: DomainRecord | null;
  projects: ProjectOption[];
  projectsLoading: boolean;
}

/** Label + input wrapper that shows the validation message under the field. */
function Field({
  label,
  htmlFor,
  error,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className ?? "space-y-1.5"}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function DomainFormDialog({
  open,
  onOpenChange,
  record,
  projects,
  projectsLoading,
}: DomainFormDialogProps) {
  const isEdit = Boolean(record);
  const hasStoredPassword = Boolean(record?.credentials?.hasPassword);

  const form = useForm<DomainFormValues>({
    resolver: zodResolver(domainFormSchema),
    defaultValues: domainToFormValues(record),
  });

  const createMutation = useCreateDomain();
  const updateMutation = useUpdateDomain();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  // Reset the form each time the dialog opens, so stale values never carry over
  useEffect(() => {
    if (open) form.reset(domainToFormValues(record));
  }, [open, record, form]);

  const { errors } = form.formState;

  const onSubmit = async (values: DomainFormValues) => {
    const payload = buildDomainPayload(values);

    try {
      if (record) {
        await updateMutation.mutateAsync({ id: record._id, payload });
        toast.success("Domain updated successfully.");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Domain added successfully.");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to save the domain."));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit domain" : "Add domain"}</DialogTitle>
          <DialogDescription>
            Passwords are encrypted before they are stored and are never shown again in full.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* ------------------------------ Basic info ----------------------------- */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Basic info</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Client project *" htmlFor="project" error={errors.project?.message}>
                <Controller
                  control={form.control}
                  name="project"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange} disabled={projectsLoading}>
                      <SelectTrigger id="project" className="w-full">
                        <SelectValue placeholder={projectsLoading ? "Loading projects..." : "Select project"} />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project._id} value={project._id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              <Field label="Domain name *" htmlFor="domainName" error={errors.domainName?.message}>
                <Input id="domainName" placeholder="example.com" {...form.register("domainName")} />
              </Field>

              <Field label="Registrar" htmlFor="registrar" error={errors.registrar?.message}>
                <Input id="registrar" placeholder="Namecheap, GoDaddy..." {...form.register("registrar")} />
              </Field>

              <Field label="Registrar URL" htmlFor="registrarUrl" error={errors.registrarUrl?.message}>
                <Input id="registrarUrl" placeholder="https://" {...form.register("registrarUrl")} />
              </Field>

              <Field label="Status" htmlFor="status" error={errors.status?.message}>
                <Controller
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="status" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            </div>
          </section>

          {/* ---------------------------- Purchase & pricing ----------------------- */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Purchase & pricing</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Purchase date" htmlFor="purchaseDate" error={errors.purchaseDate?.message}>
                <Input id="purchaseDate" type="date" {...form.register("purchaseDate")} />
              </Field>

              <Field label="Expiry date *" htmlFor="expiryDate" error={errors.expiryDate?.message}>
                <Input id="expiryDate" type="date" {...form.register("expiryDate")} />
              </Field>

              <Field label="Currency" htmlFor="currency" error={errors.currency?.message}>
                <Controller
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="currency" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCY_OPTIONS.map((code) => (
                          <SelectItem key={code} value={code}>
                            {code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              <Field label="Purchase price" htmlFor="purchasePrice" error={errors.purchasePrice?.message}>
                <Input id="purchasePrice" inputMode="decimal" placeholder="0" {...form.register("purchasePrice")} />
              </Field>

              <Field label="Renewal price" htmlFor="renewalPrice" error={errors.renewalPrice?.message}>
                <Input id="renewalPrice" inputMode="decimal" placeholder="0" {...form.register("renewalPrice")} />
              </Field>

              <Field label="Paid by" htmlFor="paidBy" error={errors.paidBy?.message}>
                <Controller
                  control={form.control}
                  name="paidBy"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="paidBy" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PAID_BY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            </div>

            <div className="flex flex-wrap gap-6">
              <Controller
                control={form.control}
                name="autoRenew"
                render={({ field }) => (
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
                    Auto-renew enabled
                  </label>
                )}
              />
            </div>
          </section>

          {/* ---------------------------------- DNS -------------------------------- */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">DNS</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Nameservers" htmlFor="nameservers" error={errors.nameservers?.message}>
                <Textarea id="nameservers" rows={3} placeholder="One per line or comma-separated" {...form.register("nameservers")} />
              </Field>
              <Field label="DNS notes" htmlFor="dnsNotes" error={errors.dnsNotes?.message}>
                <Textarea id="dnsNotes" rows={3} {...form.register("dnsNotes")} />
              </Field>
            </div>
            <Controller
              control={form.control}
              name="whoisPrivacy"
              render={({ field }) => (
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
                  WHOIS privacy enabled
                </label>
              )}
            />
          </section>

          {/* ------------------------------- Credentials ---------------------------- */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Credentials</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Login URL" htmlFor="loginUrl" error={errors.loginUrl?.message}>
                <Input id="loginUrl" placeholder="https://" {...form.register("loginUrl")} />
              </Field>
              <Field label="Username / email" htmlFor="username" error={errors.username?.message}>
                <Input id="username" autoComplete="off" {...form.register("username")} />
              </Field>
              <Field label="Password" htmlFor="password" error={errors.password?.message}>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder={hasStoredPassword ? "Leave blank to keep the current password" : "Optional"}
                  {...form.register("password")}
                />
              </Field>
              <Field label="2FA note" htmlFor="twoFactorNote" error={errors.twoFactorNote?.message}>
                <Input id="twoFactorNote" placeholder="e.g. Authenticator app on the owner's phone" {...form.register("twoFactorNote")} />
              </Field>
            </div>
            {hasStoredPassword && (
              <Controller
                control={form.control}
                name="clearPassword"
                render={({ field }) => (
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(checked === true)} />
                    Remove the stored password
                  </label>
                )}
              />
            )}
          </section>

          {/* ---------------------------------- Notes ------------------------------ */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Notes</h3>
            <Textarea rows={3} aria-label="Notes" {...form.register("notes")} />
            {errors.notes && <p className="text-xs text-destructive">{errors.notes.message}</p>}
          </section>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : isEdit ? "Save changes" : "Add domain"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
