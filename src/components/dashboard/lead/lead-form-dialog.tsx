/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, Paperclip, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
  CONTACT_METHOD_OPTIONS,
  LEAD_PRIORITY_OPTIONS,
  LEAD_SOURCE_OPTIONS,
} from "@/features/leads/constants/lead.constant";
import { useAssignableUsers } from "@/features/users/hooks/useAssignableUsers";
import { getLeadFullName } from "@/features/leads/utils/lead.utils";
import { useLeadMutations } from "@/features/leads/hooks";
import {
  createLeadFormSchema,
  type CreateLeadFormValues,
} from "@/features/leads/schemas/lead.schema";
import { LeadType, type ILead } from "@/types/lead";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { uploadMultipleToCloudinary } from "@/utils/cloudinary";
import { getErrorMessage } from "@/utils/getErrorMessage";

interface LeadFormDialogProps {
  mode: "create" | "edit";
  lead?: ILead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type LeadFormDialogValues = CreateLeadFormValues & {
  attachments: string[];
};

const EMPTY_VALUES: LeadFormDialogValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  alternatePhone: "",
  company: "",
  website: "",
  industry: "",
  jobTitle: "",
  employeeSize: "",
  country: "",
  state: "",
  city: "",
  zipCode: "",
  address: "",
  source: LEAD_SOURCE_OPTIONS[0].value,
  priority: LEAD_PRIORITY_OPTIONS[1]?.value,
  pipelineStage: "",
  estimatedValue: undefined,
  expectedCloseDate: "",
  assignedTo: "",
  preferredContactMethod: undefined,
  requirementTitle: "",
  requirementDescription: "",
  budget: undefined,
  leadType: LeadType.WEBSITE,
  timeline: "",
  attachments: [],
};

const leadToFormValues = (lead: ILead): LeadFormDialogValues => ({
  firstName: lead.firstName,
  lastName: lead.lastName,
  email: lead.email ?? "",
  phone: lead.phone,
  alternatePhone: lead.alternatePhone ?? "",
  leadType: lead.leadType ?? LeadType.WEBSITE,
  company: lead.company ?? "",
  website: lead.website ?? "",
  industry: lead.industry ?? "",
  jobTitle: lead.jobTitle ?? "",
  employeeSize: lead.employeeSize ?? "",
  country: lead.country ?? "",
  state: lead.state ?? "",
  city: lead.city ?? "",
  zipCode: lead.zipCode ?? "",
  address: lead.address ?? "",
  source: lead.source,
  priority: lead.priority,
  pipelineStage: lead.pipelineStage ?? "",
  estimatedValue: lead.estimatedValue,
  expectedCloseDate: lead.expectedCloseDate?.slice(0, 10) ?? "",
  assignedTo: lead.assignedTo?._id ?? "",
  preferredContactMethod: lead.preferredContactMethod,
  requirementTitle: lead.requirementTitle ?? "",
  requirementDescription: lead.requirementDescription ?? "",
  budget: lead.budget,
  timeline: lead.timeline ?? "",
  attachments: lead?.attachments?.map((attachment) => attachment.url) ?? [],
});

export function LeadFormDialog({
  mode,
  lead,
  open,
  onOpenChange,
}: LeadFormDialogProps) {
  const { createLead, updateLead } = useLeadMutations();
  const { data: usersResponse } = useAssignableUsers();
  const users = usersResponse?.data ?? [];

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<CreateLeadFormValues>({
    resolver: zodResolver(createLeadFormSchema as any),
    defaultValues:
      mode === "edit" && lead ? leadToFormValues(lead) : EMPTY_VALUES,
  });

  useEffect(() => {
    if (open) {
      form.reset(
        mode === "edit" && lead ? leadToFormValues(lead) : EMPTY_VALUES,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, lead, mode]);

  const isSubmitting = createLead.isPending || updateLead.isPending;
  // const attachments = form.watch("attachments") ?? [];

  const handleFilesSelected = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    setIsUploading(true);
    try {
      const urls = await uploadMultipleToCloudinary(files);
      // form.setValue("attachments", [...attachments, ...urls], {
      //   shouldDirty: true,
      //   shouldValidate: true,
      // });
      toast.success(
        urls.length > 1 ? `${urls.length} files uploaded.` : "File uploaded.",
      );
    } catch (error) {
      toast.error("Failed to upload attachment(s).");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const onSubmit = form.handleSubmit((values) => {
    const payload = {
      ...values,
      email: values.email || undefined,
      alternatePhone: values.alternatePhone || undefined,
      assignedTo: values.assignedTo || undefined,
      expectedCloseDate: values.expectedCloseDate || undefined,
    };
    
    if (mode === "create") {
  createLead.mutate(payload, {
    onSuccess: () => {
      toast.success("Lead created successfully.");
      onOpenChange(false);
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Failed to create lead.")),
  });
} else if (lead) {
  updateLead.mutate(
    { id: lead._id, payload },
    {
      onSuccess: () => {
        toast.success("Lead updated successfully.");
        onOpenChange(false);
      },
      onError: (error) =>
        toast.error(getErrorMessage(error, "Failed to update lead.")),
    },
  );
}
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>
          {mode === "create" ? "Add New Lead" : "Edit Lead"}
        </DialogTitle>
        <DialogDescription>
          {mode === "create"
            ? "Capture a new lead and route it to the right owner."
            : "Update this lead's information."}
        </DialogDescription>
      </DialogHeader>
      <DialogContent className="bg-gray-100 dark:bg-slate-950 not-last-of-type:max-h-[90vh] max-w-2xl overflow-y-auto">
        <ScrollArea className="max-h-[80vh] pr-2">
          <form onSubmit={onSubmit} className="flex flex-col gap-6">
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="First Name"
                error={form.formState.errors.firstName?.message}
              >
                <Input {...form.register("firstName")} placeholder="Brooklyn" />
              </Field>
              <Field
                label="Last Name"
                error={form.formState.errors.lastName?.message}
              >
                <Input {...form.register("lastName")} placeholder="Simmons" />
              </Field>
              <Field label="Email" error={form.formState.errors.email?.message}>
                <Input
                  {...form.register("email")}
                  placeholder="name@example.com"
                />
              </Field>
              <Field label="Phone" error={form.formState.errors.phone?.message}>
                <Input
                  {...form.register("phone")}
                  placeholder="+1 (555) 123-4567"
                />
              </Field>
              <Field label="Company">
                <Input
                  {...form.register("company")}
                  placeholder="Tech Solutions Inc."
                />
              </Field>
              <Field label="Job Title">
                <Input
                  {...form.register("jobTitle")}
                  placeholder="Marketing Manager"
                />
              </Field>
              <Field label="Industry">
                <Input {...form.register("industry")} placeholder="Software" />
              </Field>
              <Field label="Website">
                <Input
                  {...form.register("website")}
                  placeholder="https://example.com"
                />
              </Field>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Address">
                <Input
                  {...form.register("address")}
                  placeholder="123 Main Street"
                />
              </Field>
              <Field label="City">
                <Input {...form.register("city")} placeholder="Austin" />
              </Field>
              <Field label="State / Region">
                <Input {...form.register("state")} placeholder="Texas" />
              </Field>
              <Field label="Country">
                <Input
                  {...form.register("country")}
                  placeholder="United States"
                />
              </Field>
              <Field label="ZIP / Postal Code">
                <Input {...form.register("zipCode")} placeholder="78701" />
              </Field>
              <Field label="Location (Auto imported)">
                <Input
                  value={[
                    form.watch("city"),
                    form.watch("state"),
                    form.watch("country"),
                  ]
                    .filter(Boolean)
                    .join(", ")}
                  placeholder="City, State, Country"
                  readOnly
                />
              </Field>

              <Field label="Lead Type">
  <Select
    value={form.watch("leadType")}
    onValueChange={(value) =>
      form.setValue(
        "leadType",
        value as CreateLeadFormValues["leadType"],
        {
          shouldDirty: true,
          shouldValidate: true,
        },
      )
    }
  >
    <SelectTrigger>
      <SelectValue placeholder="Select lead type" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem value="WEBSITE">Website</SelectItem>
      <SelectItem value="SOFTWARE">Software</SelectItem>
    </SelectContent>
  </Select>
</Field>

              <Field
                label="Source"
                error={form.formState.errors.source?.message}
              >
                <Select
                  value={form.watch("source")}
                  onValueChange={(value) =>
                    form.setValue(
                      "source",
                      value as CreateLeadFormValues["source"],
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAD_SOURCE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Priority">
                <Select
                  value={form.watch("priority")}
                  onValueChange={(value) =>
                    form.setValue(
                      "priority",
                      value as CreateLeadFormValues["priority"],
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAD_PRIORITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Preferred Contact Method">
                <Select
                  value={form.watch("preferredContactMethod")}
                  onValueChange={(value) =>
                    form.setValue(
                      "preferredContactMethod",
                      value as CreateLeadFormValues["preferredContactMethod"],
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTACT_METHOD_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Assign To">
                <Select
                  value={form.watch("assignedTo")}
                  onValueChange={(value) => form.setValue("assignedTo", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        {getLeadFullName(user)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Estimated Value ($)">
                <Input
                  type="number"
                  min={0}
                  {...form.register("estimatedValue")}
                />
              </Field>

              <Field label="Expected Close Date">
                <Input type="date" {...form.register("expectedCloseDate")} />
              </Field>
            </section>

            <section className="grid grid-cols-1 gap-4">
              <Field label="Requirement Title">
                <Input
                  {...form.register("requirementTitle")}
                  placeholder="Enterprise CRM rollout"
                />
              </Field>
              <Field label="Requirement Description">
                <Textarea
                  rows={3}
                  {...form.register("requirementDescription")}
                  placeholder="Interested in our enterprise plan..."
                />
              </Field>

              {/* <Field label="Attachments">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFilesSelected(e.target.files)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Paperclip className="h-4 w-4" />
                )}
                {isUploading ? "Uploading..." : "Upload file(s)"}
              </Button>

              {attachments.length > 0 && (
                <ul className="mt-2 flex flex-col gap-2">
                  {attachments.map((url) => (
                    <li
                      key={url}
                      className="flex items-center justify-between gap-2 rounded-md border bg-background px-2 py-1 text-xs"
                    >
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-blue-600 hover:underline"
                      >
                        {url.split("/").pop()}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(url)}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Remove attachment"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Field> */}
            </section>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isUploading}
                variant="default"
                className="gap-2 duration-500 hover:cursor-pointer hover:scale-105 transition-transform transform ease-in-out hover:bg-cyan-800 text-white bg-indigo-600"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {mode === "create" ? "Create Lead" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
