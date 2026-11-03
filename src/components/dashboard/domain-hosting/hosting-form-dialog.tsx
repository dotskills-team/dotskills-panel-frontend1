"use client";

import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
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
  BILLING_CYCLE_OPTIONS,
  CURRENCY_OPTIONS,
  HOSTING_TYPE_OPTIONS,
  PAID_BY_OPTIONS,
  STATUS_OPTIONS,
} from "@/features/domain-hosting/constants/domain-hosting.constant";
import {
  useCreateHosting,
  useUpdateHosting,
} from "@/features/domain-hosting/hooks/use-domain-hosting";
import {
  hostingFormSchema,
  type HostingCredentialRow,
  type HostingFormValues,
} from "@/features/domain-hosting/schemas/domain-hosting.schema";
import {
  buildHostingPayload,
  hostingToFormValues,
} from "@/features/domain-hosting/utils/domain-hosting.payload";
import { getErrorMessage } from "@/utils/getErrorMessage";
import type {
  HostingRecord,
  ProjectOption,
  DomainRecord,
} from "@/types/domain-hosting.types";

interface HostingFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Omit to create a new hosting record. */
  record?: HostingRecord | null;
  projects: ProjectOption[];
  projectsLoading: boolean;
  /** Domains that can be linked to this hosting. */
  domainOptions: Pick<DomainRecord, "_id" | "domainName">[];
}

const EMPTY_CREDENTIAL_ROW: HostingCredentialRow = {
  label: "",
  loginUrl: "",
  username: "",
  password: "",
  clearPassword: false,
  hasPassword: false,
  port: "",
  note: "",
};

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function HostingFormDialog({
  open,
  onOpenChange,
  record,
  projects,
  projectsLoading,
  domainOptions,
}: HostingFormDialogProps) {
  const isEdit = Boolean(record);

  const form = useForm<HostingFormValues>({
    resolver: zodResolver(hostingFormSchema),
    defaultValues: hostingToFormValues(record),
  });

  const credentialRows = useFieldArray({ control: form.control, name: "credentials" });

  const createMutation = useCreateHosting();
  const updateMutation = useUpdateHosting();
  const isSaving = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (open) form.reset(hostingToFormValues(record));
  }, [open, record, form]);

  const { errors } = form.formState;

  const onSubmit = async (values: HostingFormValues) => {
    const payload = buildHostingPayload(values);

    try {
      if (record) {
        await updateMutation.mutateAsync({ id: record._id, payload });
        toast.success("Hosting record updated successfully.");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Hosting record added successfully.");
      }
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to save the hosting record."));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit hosting" : "Add hosting"}</DialogTitle>
          <DialogDescription>
            Each login row keeps its own encrypted password. Rows you remove are deleted.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* ------------------------------ Basic info ----------------------------- */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Basic info</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Client project *" htmlFor="h-project" error={errors.project?.message}>
                <Controller
                  control={form.control}
                  name="project"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange} disabled={projectsLoading}>
                      <SelectTrigger id="h-project" className="w-full">
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

              <Field label="Provider" htmlFor="provider" error={errors.provider?.message}>
                <Input id="provider" placeholder="Hostinger, DigitalOcean..." {...form.register("provider")} />
              </Field>

              <Field label="Hosting type" htmlFor="hostingType" error={errors.hostingType?.message}>
                <Controller
                  control={form.control}
                  name="hostingType"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="hostingType" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {HOSTING_TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              <Field label="Plan name" htmlFor="planName" error={errors.planName?.message}>
                <Input id="planName" {...form.register("planName")} />
              </Field>

              <Field label="Server location" htmlFor="serverLocation" error={errors.serverLocation?.message}>
                <Input id="serverLocation" placeholder="Singapore, Frankfurt..." {...form.register("serverLocation")} />
              </Field>

              <Field label="Server IP" htmlFor="serverIp" error={errors.serverIp?.message}>
                <Input id="serverIp" {...form.register("serverIp")} />
              </Field>

              <Field label="Status" htmlFor="h-status" error={errors.status?.message}>
                <Controller
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="h-status" className="w-full">
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

            <div className="space-y-2">
              <Label>Linked domains</Label>
              {domainOptions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No domains added yet.</p>
              ) : (
                <Controller
                  control={form.control}
                  name="linkedDomains"
                  render={({ field }) => (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {domainOptions.map((domain) => {
                        const checked = field.value.includes(domain._id);
                        return (
                          <label key={domain._id} className="flex items-center gap-2 text-sm">
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(value) =>
                                field.onChange(
                                  value === true
                                    ? [...field.value, domain._id]
                                    : field.value.filter((id) => id !== domain._id),
                                )
                              }
                            />
                            {domain.domainName}
                          </label>
                        );
                      })}
                    </div>
                  )}
                />
              )}
            </div>
          </section>

          {/* ------------------------------ Control panel -------------------------- */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Control panel</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Control panel" htmlFor="controlPanel" error={errors.controlPanel?.message}>
                <Input id="controlPanel" placeholder="cPanel, Plesk, Coolify..." {...form.register("controlPanel")} />
              </Field>
              <Field label="Control panel URL" htmlFor="controlPanelUrl" error={errors.controlPanelUrl?.message}>
                <Input id="controlPanelUrl" placeholder="https://" {...form.register("controlPanelUrl")} />
              </Field>
            </div>
          </section>

          {/* ---------------------------- Purchase & pricing ----------------------- */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Purchase & pricing</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Purchase date" htmlFor="h-purchaseDate" error={errors.purchaseDate?.message}>
                <Input id="h-purchaseDate" type="date" {...form.register("purchaseDate")} />
              </Field>
              <Field label="Expiry date *" htmlFor="h-expiryDate" error={errors.expiryDate?.message}>
                <Input id="h-expiryDate" type="date" {...form.register("expiryDate")} />
              </Field>
              <Field label="Billing cycle" htmlFor="billingCycle" error={errors.billingCycle?.message}>
                <Controller
                  control={form.control}
                  name="billingCycle"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="billingCycle" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BILLING_CYCLE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
              <Field label="Purchase price" htmlFor="h-purchasePrice" error={errors.purchasePrice?.message}>
                <Input id="h-purchasePrice" inputMode="decimal" placeholder="0" {...form.register("purchasePrice")} />
              </Field>
              <Field label="Renewal price" htmlFor="h-renewalPrice" error={errors.renewalPrice?.message}>
                <Input id="h-renewalPrice" inputMode="decimal" placeholder="0" {...form.register("renewalPrice")} />
              </Field>
              <Field label="Currency" htmlFor="h-currency" error={errors.currency?.message}>
                <Controller
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="h-currency" className="w-full">
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
              <Field label="Paid by" htmlFor="h-paidBy" error={errors.paidBy?.message}>
                <Controller
                  control={form.control}
                  name="paidBy"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="h-paidBy" className="w-full">
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
          </section>

          {/* ------------------------------- Credentials ---------------------------- */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground">Credentials</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => credentialRows.append({ ...EMPTY_CREDENTIAL_ROW })}
              >
                <Plus className="h-4 w-4" />
                Add login
              </Button>
            </div>

            {credentialRows.fields.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No logins yet. Add cPanel, SSH, FTP, database or provider accounts.
              </p>
            )}

            {credentialRows.fields.map((row, index) => {
              const rowErrors = errors.credentials?.[index];
              const hasStoredPassword = Boolean(form.getValues(`credentials.${index}.hasPassword`));

              return (
                <div key={row.id} className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">Login {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => credentialRows.remove(index)}
                      aria-label={`Remove login ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <Field label="Label *" htmlFor={`cred-label-${index}`} error={rowErrors?.label?.message}>
                      <Input id={`cred-label-${index}`} placeholder="cPanel, SSH, FTP, DB" {...form.register(`credentials.${index}.label`)} />
                    </Field>
                    <Field label="Login URL" htmlFor={`cred-url-${index}`} error={rowErrors?.loginUrl?.message}>
                      <Input id={`cred-url-${index}`} {...form.register(`credentials.${index}.loginUrl`)} />
                    </Field>
                    <Field label="Username" htmlFor={`cred-user-${index}`} error={rowErrors?.username?.message}>
                      <Input id={`cred-user-${index}`} autoComplete="off" {...form.register(`credentials.${index}.username`)} />
                    </Field>
                    <Field label="Password" htmlFor={`cred-pass-${index}`} error={rowErrors?.password?.message}>
                      <Input
                        id={`cred-pass-${index}`}
                        type="password"
                        autoComplete="new-password"
                        placeholder={hasStoredPassword ? "Leave blank to keep" : "Optional"}
                        {...form.register(`credentials.${index}.password`)}
                      />
                    </Field>
                    <Field label="Port" htmlFor={`cred-port-${index}`} error={rowErrors?.port?.message}>
                      <Input id={`cred-port-${index}`} inputMode="numeric" placeholder="22, 21, 3306..." {...form.register(`credentials.${index}.port`)} />
                    </Field>
                    <Field label="Note" htmlFor={`cred-note-${index}`} error={rowErrors?.note?.message}>
                      <Input id={`cred-note-${index}`} {...form.register(`credentials.${index}.note`)} />
                    </Field>
                  </div>

                  {hasStoredPassword && (
                    <Controller
                      control={form.control}
                      name={`credentials.${index}.clearPassword`}
                      render={({ field }) => (
                        <label className="flex items-center gap-2 text-sm">
                          <Checkbox checked={field.value} onCheckedChange={(value) => field.onChange(value === true)} />
                          Remove the stored password
                        </label>
                      )}
                    />
                  )}
                </div>
              );
            })}
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
              {isSaving ? "Saving..." : isEdit ? "Save changes" : "Add hosting"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
