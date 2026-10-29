// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react-hooks/incompatible-library */
// "use client";

// import { useMemo, useState } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";
// import {
//   AlertCircle,
//   Banknote,
//   Briefcase,
//   Camera,
//   CheckCircle2,
//   CreditCard,
//   Eye,
//   EyeOff,
//   ImagePlus,
//   Loader2,
//   Shield,
//   Trash2,
//   User as UserIcon,
//   Wallet,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { ApiError } from "@/lib/axios";
// import { cn } from "@/lib/utils";
// import { PaymentMethod, type User } from "@/types/user.types";
// import {
//   createUserSchema,
//   updateUserSchema,
//   type CreateUserInput,
//   type UpdateUserInput,
// } from "@/features/users/schemas/user.schema";
// import {
//   USER_DEPARTMENTS,
//   USER_DESIGNATIONS,
//   USER_GENDER_OPTIONS,
//   USER_PAYMENT_METHOD_OPTIONS,
//   USER_ROLES,
// } from "@/features/users/constants/user.constant";
// import { uploadToCloudinary } from "@/utils/cloudinary";

// interface UserFormProps {
//   user?: User;
//   isLoading?: boolean;
//   onSubmit: (data: CreateUserInput | UpdateUserInput) => Promise<void>;
// }

// type FormValues = CreateUserInput | UpdateUserInput;

// function getInitials(firstName?: string, lastName?: string) {
//   return `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase();
// }

// function FieldError({ message }: { message?: string }) {
//   if (!message) return null;
//   return <p className="text-xs font-medium text-destructive">{message}</p>;
// }

// function SectionHeading({
//   icon: Icon,
//   title,
//   description,
// }: {
//   icon: typeof UserIcon;
//   title: string;
//   description?: string;
// }) {
//   return (
//     <div className="flex items-center gap-2.5">
//       <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
//         <Icon className="h-4 w-4" aria-hidden="true" />
//       </span>
//       <div>
//         <h3 className="text-sm font-semibold text-foreground">{title}</h3>
//         {description && (
//           <p className="text-xs text-muted-foreground">{description}</p>
//         )}
//       </div>
//     </div>
//   );
// }

// const inputClassName =
//   "h-11 rounded-xl border-border/80 bg-background/60 transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40";

// function sanitizePayload(data: FormValues): FormValues {
//   const sanitized: FormValues = {
//     ...data,
//     phone: data.phone || undefined,
//     dateOfBirth: data.dateOfBirth || undefined,
//     avatar: data.avatar || undefined,
//     address: data.address || undefined,
//     bio: data.bio || undefined,
//     designation: data.designation || undefined,
//     department: data.department || undefined,
//     salary:
//       typeof data.salary === "number" && Number.isNaN(data.salary)
//         ? undefined
//         : data.salary,
//   };

//   if (
//     sanitized.paymentMethod === PaymentMethod.BKASH ||
//     sanitized.paymentMethod === PaymentMethod.NAGAD
//   ) {
//     sanitized.bankAccount = undefined;
//   } else if (sanitized.paymentMethod === PaymentMethod.BANK) {
//     sanitized.paymentAccount = undefined;
//   } else {
//     sanitized.paymentAccount = undefined;
//     sanitized.bankAccount = undefined;
//   }

//   return sanitized;
// }

// function AvatarUploader({
//   avatarUrl,
//   initials,
//   firstName,
//   lastName,
//   isUploading,
//   disabled,
//   onUpload,
//   onRemove,
// }: {
//   avatarUrl?: string;
//   initials: string;
//   firstName?: string;
//   lastName?: string;
//   isUploading: boolean;
//   disabled?: boolean;
//   onUpload: (file: File) => Promise<void>;
//   onRemove: () => void;
// }) {
//   return (
//     <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
//       <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
//         {/* Preview */}
//         <div className="relative shrink-0">
//           <div
//             className={cn(
//               "relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl",
//               "border-2 border-dashed border-border/80 bg-muted/40",
//               "ring-4 ring-primary/5",
//             )}
//           >
//             <Avatar className="h-full w-full rounded-2xl">
//               <AvatarImage
//                 src={avatarUrl || undefined}
//                 alt={`${firstName ?? ""} ${lastName ?? ""}`}
//                 className="object-cover"
//               />

//               <AvatarFallback className="rounded-2xl bg-primary/10 text-xl font-semibold text-primary">
//                 {initials}
//               </AvatarFallback>
//             </Avatar>

//             {isUploading && (
//               <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-2xl bg-background/80 backdrop-blur-sm">
//                 <Loader2 className="h-5 w-5 animate-spin text-primary" />
//                 <span className="text-[10px] font-medium text-muted-foreground">
//                   Uploading
//                 </span>
//               </div>
//             )}
//           </div>

//           {avatarUrl && !isUploading && (
//             <div className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-emerald-500 text-white shadow-sm">
//               <CheckCircle2 className="h-3.5 w-3.5" />
//             </div>
//           )}
//         </div>

//         {/* Content */}
//         <div className="min-w-0 flex-1 space-y-3">
//           <div>
//             <div className="flex items-center gap-2">
//               <h4 className="text-sm font-semibold text-foreground">
//                 Profile photo
//               </h4>

//               {avatarUrl && (
//                 <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
//                   Uploaded
//                 </span>
//               )}
//             </div>

//             <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
//               Add a professional photo that will be displayed across the
//               dashboard and user profile.
//             </p>
//           </div>

//           <div className="flex flex-wrap items-center gap-2">
//             {/* Upload / Change */}
//             <label
//               htmlFor="avatar-upload"
//               className={cn(
//                 "inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg",
//                 "border border-border bg-background px-3 text-xs font-medium",
//                 "transition-colors hover:bg-muted",
//                 "focus-within:ring-2 focus-within:ring-primary/40",
//                 (disabled || isUploading) &&
//                   "pointer-events-none cursor-not-allowed opacity-60",
//               )}
//             >
//               {isUploading ? (
//                 <Loader2 className="h-3.5 w-3.5 animate-spin" />
//               ) : avatarUrl ? (
//                 <Camera className="h-3.5 w-3.5" />
//               ) : (
//                 <ImagePlus className="h-3.5 w-3.5" />
//               )}

//               {isUploading
//                 ? "Uploading..."
//                 : avatarUrl
//                   ? "Change photo"
//                   : "Upload photo"}

//               <Input
//                 id="avatar-upload"
//                 type="file"
//                 accept="image/jpeg,image/png,image/webp"
//                 disabled={disabled || isUploading}
//                 className="hidden"
//                 onChange={async (event) => {
//                   const file = event.target.files?.[0];

//                   if (!file) return;

//                   await onUpload(file);

//                   event.target.value = "";
//                 }}
//               />
//             </label>

//             {/* Remove */}
//             {avatarUrl && !isUploading && (
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="sm"
//                 disabled={disabled}
//                 onClick={onRemove}
//                 className="h-9 gap-1.5 px-3 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
//               >
//                 <Trash2 className="h-3.5 w-3.5" />
//                 Remove
//               </Button>
//             )}
//           </div>

//           <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
//             <span>JPG, PNG or WebP</span>
//             <span className="text-border">•</span>
//             <span>Maximum 5MB</span>
//             <span className="text-border">•</span>
//             <span>Recommended 400×400px</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export function UserForm({ user, isLoading, onSubmit }: UserFormProps) {
//   const [submitError, setSubmitError] = useState<string | null>(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
//   const isEditMode = Boolean(user);

//   const schema = isEditMode ? updateUserSchema : createUserSchema;

//   const {
//     register,
//     control,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors },
//   } = useForm<FormValues>({
//     resolver: zodResolver(schema as any),
//     defaultValues: isEditMode
//       ? {
//           firstName: user!.firstName,
//           lastName: user!.lastName,
//           phone: user!.phone,
//           role: user!.role,
//           designation: user!.designation,
//           gender: user!.gender,
//           dateOfBirth: user!.dateOfBirth
//             ? new Date(user!.dateOfBirth).toISOString().split("T")[0]
//             : "",
//           salary: user!.salary ?? 0,
//           paymentMethod: user!.paymentMethod ?? PaymentMethod.CASH,

//           paymentAccount: {
//             accountHolderName: user!.paymentAccount?.accountHolderName ?? "",
//             accountNumber: user!.paymentAccount?.accountNumber ?? "",
//           },

//           bankAccount: {
//             accountHolderName: user!.bankAccount?.accountHolderName ?? "",
//             accountNumber: user!.bankAccount?.accountNumber ?? "",
//             bankName: user!.bankAccount?.bankName ?? "",
//             branchName: user!.bankAccount?.branchName ?? "",
//             routingNumber: user!.bankAccount?.routingNumber ?? "",
//           },
//           department: user!.department,
//           address: user!.address,
//           avatar: user!.avatar,
//           bio: user!.bio,
//         }
//       : ({
//           firstName: "",
//           lastName: "",
//           email: "",
//           phone: "",
//           password: "",
//           role: "STAFF",
//           gender: undefined,
//           dateOfBirth: undefined,
//           salary: 0,
//           paymentMethod: "CASH",

//           paymentAccount: {
//             accountHolderName: "",
//             accountNumber: "",
//           },

//           bankAccount: {
//             accountHolderName: "",
//             accountNumber: "",
//             bankName: "",
//             branchName: "",
//             routingNumber: "",
//           },
//           designation: "",
//           department: "",
//           address: "",
//         } as CreateUserInput),
//   });

//   const firstName = watch("firstName");
//   const lastName = watch("lastName");
//   const paymentMethod = watch("paymentMethod");
//   const avatarUrl = watch("avatar" as never) as unknown as string | undefined;
//   async function handleAvatarUpload(file: File) {
//     if (!file.type.startsWith("image/")) {
//       toast.error("Please select a valid image.");
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       toast.error("Image must be smaller than 5MB.");
//       return;
//     }

//     try {
//       setIsUploadingAvatar(true);

//       const url = await uploadToCloudinary(file);

//       setValue("avatar" as never, url as never, {
//         shouldDirty: true,
//         shouldValidate: true,
//       });

//       toast.success("Profile photo uploaded successfully.");
//     } catch (error) {
//       console.error("Avatar upload failed:", error);

//       toast.error(
//         error instanceof Error
//           ? error.message
//           : "Failed to upload profile photo.",
//       );
//     } finally {
//       setIsUploadingAvatar(false);
//     }
//   }

//   function handleAvatarRemove() {
//     setValue("avatar" as never, undefined as never, {
//       shouldDirty: true,
//       shouldValidate: true,
//     });

//     toast.success("Profile photo removed.");
//   }

//   const initials = useMemo(
//     () => getInitials(firstName, lastName) || "?",
//     [firstName, lastName],
//   );

//   async function handleFormSubmit(data: FormValues) {
//     setSubmitError(null);

//     console.log("Form submitted with data:", data);
//     try {
//       await onSubmit(sanitizePayload(data));
//     } catch (error) {
//       setSubmitError(
//         error instanceof ApiError
//           ? error.message
//           : "Something went wrong. Please try again.",
//       );
//     }
//   }

//   // function onInvalid() {
//   //   toast.error("Please fix the highlighted fields before submitting.");
//   // }

// function onInvalid(errors: any) {
//   console.log("VALIDATION ERRORS:", errors);

//   const firstError = Object.values(errors)[0] as any;

//   toast.error(
//     firstError?.message || "Please fix the highlighted fields before submitting.",
//   );
// }

//   return (
//     <form
//       onSubmit={handleSubmit(handleFormSubmit, onInvalid)}
//       noValidate
//       className="space-y-8"
//     >
//       {submitError && (
//         <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5">
//           <AlertCircle
//             className="mt-0.5 h-4 w-4 shrink-0 text-destructive"
//             aria-hidden="true"
//           />
//           <p className="text-sm text-destructive">{submitError}</p>
//         </div>
//       )}

//       {/* Identity */}
//       <section className="space-y-4">
//         <SectionHeading
//           icon={UserIcon}
//           title="Identity"
//           description="Basic information used across the panel."
//         />

//         <AvatarUploader
//           avatarUrl={avatarUrl}
//           initials={initials}
//           firstName={firstName}
//           lastName={lastName}
//           isUploading={isUploadingAvatar}
//           disabled={isLoading}
//           onUpload={handleAvatarUpload}
//           onRemove={handleAvatarRemove}
//         />

//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//           <div className="space-y-1.5">
//             <Label htmlFor="firstName">First name</Label>
//             <Input
//               id="firstName"
//               placeholder="John"
//               className={inputClassName}
//               aria-invalid={Boolean(errors.firstName)}
//               {...register("firstName")}
//             />
//             <FieldError
//               message={errors.firstName?.message as string | undefined}
//             />
//           </div>

//           <div className="space-y-1.5">
//             <Label htmlFor="lastName">Last name</Label>
//             <Input
//               id="lastName"
//               placeholder="Doe"
//               className={inputClassName}
//               aria-invalid={Boolean(errors.lastName)}
//               {...register("lastName")}
//             />
//             <FieldError
//               message={errors.lastName?.message as string | undefined}
//             />
//           </div>
//         </div>

//         <div className="space-y-1.5">
//           <Label htmlFor="phone">Phone</Label>
//           <Input
//             id="phone"
//             placeholder="+0181878-8816"
//             className={inputClassName}
//             aria-invalid={Boolean(errors.phone)}
//             {...register("phone" as never)}
//           />
//           <FieldError message={errors.phone?.message as string | undefined} />
//         </div>
//       </section>

//       {/* Account & access — create mode only */}
//       {!isEditMode && (
//         <section className="space-y-4">
//           <SectionHeading
//             icon={Shield}
//             title="Account & access"
//             description="Login credentials for the new user."
//           />

//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//             <div className="space-y-1.5">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="john@example.com"
//                 className={inputClassName}
//                 aria-invalid={Boolean(
//                   (errors as Record<string, { message?: string }>).email,
//                 )}
//                 {...register("email" as never)}
//               />
//               <FieldError
//                 message={
//                   (errors as Record<string, { message?: string }>).email
//                     ?.message
//                 }
//               />
//             </div>

//             <div className="space-y-1.5">
//               <Label htmlFor="password">Password</Label>
//               <div className="relative">
//                 <Input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Enter minimum 8 characters"
//                   className={cn(inputClassName, "pr-10")}
//                   aria-invalid={Boolean(
//                     (errors as Record<string, { message?: string }>).password,
//                   )}
//                   {...register("password" as never)}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword((prev) => !prev)}
//                   aria-label={showPassword ? "Hide password" : "Show password"}
//                   className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-4 w-4" aria-hidden="true" />
//                   ) : (
//                     <Eye className="h-4 w-4" aria-hidden="true" />
//                   )}
//                 </button>
//               </div>
//               <FieldError
//                 message={
//                   (errors as Record<string, { message?: string }>).password
//                     ?.message
//                 }
//               />
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Role & work details */}
//       <section className="space-y-4">
//         <SectionHeading
//           icon={Briefcase}
//           title="Role & work details"
//           description="Controls permissions and where this user shows up in the org."
//         />

//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//           <div className="space-y-1.5">
//             <Label>Role</Label>
//             <Controller
//               control={control}
//               name="role"
//               render={({ field }) => (
//                 <Select value={field.value} onValueChange={field.onChange}>
//                   <SelectTrigger className={cn(inputClassName, "w-full")}>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {USER_ROLES.map((role) => (
//                       <SelectItem key={role.value} value={role.value}>
//                         {role.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               )}
//             />
//             <FieldError message={errors.role?.message as string | undefined} />
//           </div>

//           <div className="space-y-1.5">
//             <Label>Department</Label>
//             <Controller
//               control={control}
//               name={"department" as never}
//               render={({ field }) => (
//                 <Select
//                   value={field.value ?? ""}
//                   onValueChange={field.onChange}
//                 >
//                   <SelectTrigger className={cn(inputClassName, "w-full")}>
//                     <SelectValue placeholder="Select department" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {USER_DEPARTMENTS.map((dept) => (
//                       <SelectItem key={dept} value={dept}>
//                         {dept}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               )}
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//           <div className="space-y-1.5">
//             <Label>Designation</Label>
//             <Controller
//               control={control}
//               name={"designation" as never}
//               render={({ field }) => (
//                 <Select
//                   value={field.value ?? ""}
//                   onValueChange={field.onChange}
//                 >
//                   <SelectTrigger className={cn(inputClassName, "w-full")}>
//                     <SelectValue placeholder="Select designation" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {USER_DESIGNATIONS.map((designation) => (
//                       <SelectItem key={designation} value={designation}>
//                         {designation}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               )}
//             />
//           </div>

//           <div className="space-y-1.5">
//             <Label htmlFor="address">Address</Label>
//             <Input
//               id="address"
//               placeholder="123 Main St, City, State"
//               className={inputClassName}
//               {...register("address" as never)}
//             />
//           </div>
//         </div>
//       </section>

//       <section className="space-y-4">
//         <SectionHeading
//           icon={UserIcon}
//           title="Personal & Compensation"
//           description="Personal details and employee payment information."
//         />

//         {/* Personal information */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//           <div className="space-y-1.5">
//             <Label>Gender</Label>

//             <Controller
//               control={control}
//               name="gender"
//               render={({ field }) => (
//                 <Select
//                   value={field.value ?? ""}
//                   onValueChange={field.onChange}
//                 >
//                   <SelectTrigger className={cn(inputClassName, "w-full")}>
//                     <SelectValue placeholder="Select gender" />
//                   </SelectTrigger>

//                   <SelectContent>
//                     {USER_GENDER_OPTIONS.map((option) => (
//                       <SelectItem key={option.value} value={option.value}>
//                         {option.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               )}
//             />

//             <FieldError
//               message={errors.gender?.message as string | undefined}
//             />
//           </div>

//           <div className="space-y-1.5">
//             <Label htmlFor="dateOfBirth">Date of birth</Label>

//             <Input
//               id="dateOfBirth"
//               type="date"
//               className={inputClassName}
//               {...register("dateOfBirth" as never)}
//             />

//             <FieldError
//               message={errors.dateOfBirth?.message as string | undefined}
//             />
//           </div>
//         </div>

//         {/* Salary & payment */}
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//           <div className="space-y-1.5">
//             <Label htmlFor="salary">Monthly salary</Label>

//             <div className="relative">
//               <Banknote className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

//               <Input
//                 id="salary"
//                 type="number"
//                 min="0"
//                 placeholder="50000"
//                 className={cn(inputClassName, "pl-9")}
//                 {...register("salary" as never, {
//                   valueAsNumber: true,
//                 })}
//               />
//             </div>

//             <FieldError
//               message={errors.salary?.message as string | undefined}
//             />
//           </div>

//           <div className="space-y-1.5">
//             <Label>Payment method</Label>

//             <Controller
//               control={control}
//               name="paymentMethod"
//               render={({ field }) => (
//                 <Select
//                   value={field.value ?? ""}
//                   onValueChange={field.onChange}
//                 >
//                   <SelectTrigger className={cn(inputClassName, "w-full")}>
//                     <SelectValue placeholder="Select payment method" />
//                   </SelectTrigger>

//                   <SelectContent>
//                     {USER_PAYMENT_METHOD_OPTIONS.map((option) => (
//                       <SelectItem key={option.value} value={option.value}>
//                         {option.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               )}
//             />

//             <FieldError
//               message={errors.paymentMethod?.message as string | undefined}
//             />
//           </div>
//         </div>

//         {/* Mobile wallet */}
//         {(paymentMethod === "BKASH" || paymentMethod === "NAGAD") && (
//           <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-4">
//             <div className="flex items-center gap-2">
//               <Wallet className="h-4 w-4 text-primary" />

//               <div>
//                 <p className="text-sm font-semibold">
//                   {paymentMethod === "BKASH" ? "bKash" : "Nagad"} account
//                 </p>

//                 <p className="text-xs text-muted-foreground">
//                   Enter the payment account details.
//                 </p>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               <div className="space-y-1.5">
//                 <Label>Account holder name</Label>

//                 <Input
//                   placeholder="John Doe"
//                   className={inputClassName}
//                   {...register("paymentAccount.accountHolderName" as never)}
//                 />

//                 <FieldError
//                   message={
//                     (
//                       errors.paymentAccount as
//                         | { accountHolderName?: { message?: string } }
//                         | undefined
//                     )?.accountHolderName?.message
//                   }
//                 />
//               </div>

//               <div className="space-y-1.5">
//                 <Label>Account number</Label>

//                 <Input
//                   placeholder="01XXXXXXXXX"
//                   className={inputClassName}
//                   {...register("paymentAccount.accountNumber" as never)}
//                 />

//                 <FieldError
//                   message={
//                     (
//                       errors.paymentAccount as
//                         | { accountNumber?: { message?: string } }
//                         | undefined
//                     )?.accountNumber?.message
//                   }
//                 />
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Bank */}
//         {paymentMethod === "BANK" && (
//           <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-4">
//             <div className="flex items-center gap-2">
//               <CreditCard className="h-4 w-4 text-primary" />

//               <div>
//                 <p className="text-sm font-semibold">
//                   Bank account information
//                 </p>

//                 <p className="text-xs text-muted-foreground">
//                   Provide the employee&apos;s bank account details.
//                 </p>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               <div className="space-y-1.5">
//                 <Label>Account holder name</Label>

//                 <Input
//                   placeholder="John Doe"
//                   className={inputClassName}
//                   {...register("bankAccount.accountHolderName" as never)}
//                 />

//                 <FieldError
//                   message={
//                     (
//                       errors.bankAccount as
//                         | { accountHolderName?: { message?: string } }
//                         | undefined
//                     )?.accountHolderName?.message
//                   }
//                 />
//               </div>

//               <div className="space-y-1.5">
//                 <Label>Account number</Label>

//                 <Input
//                   placeholder="Enter account number"
//                   className={inputClassName}
//                   {...register("bankAccount.accountNumber" as never)}
//                 />

//                 <FieldError
//                   message={
//                     (
//                       errors.bankAccount as
//                         | { accountNumber?: { message?: string } }
//                         | undefined
//                     )?.accountNumber?.message
//                   }
//                 />
//               </div>

//               <div className="space-y-1.5">
//                 <Label>Bank name</Label>

//                 <Input
//                   placeholder="Bank name"
//                   className={inputClassName}
//                   {...register("bankAccount.bankName" as never)}
//                 />

//                 <FieldError
//                   message={
//                     (
//                       errors.bankAccount as
//                         | { bankName?: { message?: string } }
//                         | undefined
//                     )?.bankName?.message
//                   }
//                 />
//               </div>

//               <div className="space-y-1.5">
//                 <Label>Branch name</Label>

//                 <Input
//                   placeholder="Branch name"
//                   className={inputClassName}
//                   {...register("bankAccount.branchName" as never)}
//                 />
//               </div>

//               <div className="space-y-1.5 sm:col-span-2">
//                 <Label>Routing number</Label>

//                 <Input
//                   placeholder="Routing number"
//                   className={inputClassName}
//                   {...register("bankAccount.routingNumber" as never)}
//                 />
//               </div>
//             </div>
//           </div>
//         )}
//       </section>

//       <div className="flex justify-end gap-3 border-t border-border/60 pt-6">
//         <Button
//           type="submit"
//           disabled={isLoading}
//           className="h-11 gap-2 rounded-xl bg-indigo-600 px-6 font-medium text-white shadow-[0_1px_2px_rgba(79,70,229,0.1),0_8px_20px_-8px_rgba(79,70,229,0.5)] transition-transform duration-200 ease-in-out hover:scale-[1.02] hover:bg-indigo-700 disabled:pointer-events-none disabled:opacity-70"
//         >
//           {(isLoading || isUploadingAvatar) && (
//             <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
//           )}

//           {isUploadingAvatar
//             ? "Uploading photo..."
//             : isEditMode
//               ? "Update user"
//               : "Create user"}
//         </Button>
//       </div>
//     </form>
//   );
// }








/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  AlertCircle,
  Banknote,
  Briefcase,
  Camera,
  CheckCircle2,
  CreditCard,
  Eye,
  EyeOff,
  ImagePlus,
  KeyRound,
  Loader2,
  Shield,
  Trash2,
  User as UserIcon,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ApiError } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { PaymentMethod, type User } from "@/types/user.types";
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserInput,
  type UpdateUserInput,
} from "@/features/users/schemas/user.schema";
import {
  USER_DEPARTMENTS,
  USER_DESIGNATIONS,
  USER_GENDER_OPTIONS,
  USER_PAYMENT_METHOD_OPTIONS,
  USER_ROLES,
} from "@/features/users/constants/user.constant";
import { uploadToCloudinary } from "@/utils/cloudinary";

const MIN_PASSWORD_LENGTH = 8;

interface UserFormProps {
  user?: User;
  isLoading?: boolean;
  onSubmit: (data: CreateUserInput | UpdateUserInput) => Promise<void>;
  /** True only when the logged-in user is ADMIN or SUPER_ADMIN. */
  canChangePassword?: boolean;
  /** Calls the admin change-password endpoint for the given user. */
  onChangePassword?: (userId: string, newPassword: string) => Promise<void>;
}

type FormValues = CreateUserInput | UpdateUserInput;

function getInitials(firstName?: string, lastName?: string) {
  return `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase();
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs font-medium text-destructive">{message}</p>;
}

function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof UserIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

const inputClassName =
  "h-11 rounded-xl border-border/80 bg-background/60 transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40";

function sanitizePayload(data: FormValues): FormValues {
  const sanitized: FormValues = {
    ...data,
    phone: data.phone || undefined,
    dateOfBirth: data.dateOfBirth || undefined,
    avatar: data.avatar || undefined,
    address: data.address || undefined,
    bio: data.bio || undefined,
    designation: data.designation || undefined,
    department: data.department || undefined,
    salary:
      typeof data.salary === "number" && Number.isNaN(data.salary)
        ? undefined
        : data.salary,
  };

  if (
    sanitized.paymentMethod === PaymentMethod.BKASH ||
    sanitized.paymentMethod === PaymentMethod.NAGAD
  ) {
    sanitized.bankAccount = undefined;
  } else if (sanitized.paymentMethod === PaymentMethod.BANK) {
    sanitized.paymentAccount = undefined;
  } else {
    sanitized.paymentAccount = undefined;
    sanitized.bankAccount = undefined;
  }

  return sanitized;
}

function AvatarUploader({
  avatarUrl,
  initials,
  firstName,
  lastName,
  isUploading,
  disabled,
  onUpload,
  onRemove,
}: {
  avatarUrl?: string;
  initials: string;
  firstName?: string;
  lastName?: string;
  isUploading: boolean;
  disabled?: boolean;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
        {/* Preview */}
        <div className="relative shrink-0">
          <div
            className={cn(
              "relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl",
              "border-2 border-dashed border-border/80 bg-muted/40",
              "ring-4 ring-primary/5",
            )}
          >
            <Avatar className="h-full w-full rounded-2xl">
              <AvatarImage
                src={avatarUrl || undefined}
                alt={`${firstName ?? ""} ${lastName ?? ""}`}
                className="object-cover"
              />

              <AvatarFallback className="rounded-2xl bg-primary/10 text-xl font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>

            {isUploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-2xl bg-background/80 backdrop-blur-sm">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-[10px] font-medium text-muted-foreground">
                  Uploading
                </span>
              </div>
            )}
          </div>

          {avatarUrl && !isUploading && (
            <div className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-emerald-500 text-white shadow-sm">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-foreground">
                Profile photo
              </h4>

              {avatarUrl && (
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
                  Uploaded
                </span>
              )}
            </div>

            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Add a professional photo that will be displayed across the
              dashboard and user profile.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Upload / Change */}
            <label
              htmlFor="avatar-upload"
              className={cn(
                "inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg",
                "border border-border bg-background px-3 text-xs font-medium",
                "transition-colors hover:bg-muted",
                "focus-within:ring-2 focus-within:ring-primary/40",
                (disabled || isUploading) &&
                  "pointer-events-none cursor-not-allowed opacity-60",
              )}
            >
              {isUploading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : avatarUrl ? (
                <Camera className="h-3.5 w-3.5" />
              ) : (
                <ImagePlus className="h-3.5 w-3.5" />
              )}

              {isUploading
                ? "Uploading..."
                : avatarUrl
                  ? "Change photo"
                  : "Upload photo"}

              <Input
                id="avatar-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={disabled || isUploading}
                className="hidden"
                onChange={async (event) => {
                  const file = event.target.files?.[0];

                  if (!file) return;

                  await onUpload(file);

                  event.target.value = "";
                }}
              />
            </label>

            {/* Remove */}
            {avatarUrl && !isUploading && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={disabled}
                onClick={onRemove}
                className="h-9 gap-1.5 px-3 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </Button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            <span>JPG, PNG or WebP</span>
            <span className="text-border">•</span>
            <span>Maximum 5MB</span>
            <span className="text-border">•</span>
            <span>Recommended 400×400px</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UserForm({
  user,
  isLoading,
  onSubmit,
  canChangePassword = false,
  onChangePassword,
}: UserFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Admin password reset (edit mode only)
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);

  const isEditMode = Boolean(user);
  const showPasswordReset =
    isEditMode && canChangePassword && Boolean(onChangePassword);

  const schema = isEditMode ? updateUserSchema : createUserSchema;

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema as any),
    defaultValues: isEditMode
      ? {
          firstName: user!.firstName,
          lastName: user!.lastName,
          phone: user!.phone,
          role: user!.role,
          designation: user!.designation,
          gender: user!.gender,
          dateOfBirth: user!.dateOfBirth
            ? new Date(user!.dateOfBirth).toISOString().split("T")[0]
            : "",
          salary: user!.salary ?? 0,
          paymentMethod: user!.paymentMethod ?? PaymentMethod.CASH,

          paymentAccount: {
            accountHolderName: user!.paymentAccount?.accountHolderName ?? "",
            accountNumber: user!.paymentAccount?.accountNumber ?? "",
          },

          bankAccount: {
            accountHolderName: user!.bankAccount?.accountHolderName ?? "",
            accountNumber: user!.bankAccount?.accountNumber ?? "",
            bankName: user!.bankAccount?.bankName ?? "",
            branchName: user!.bankAccount?.branchName ?? "",
            routingNumber: user!.bankAccount?.routingNumber ?? "",
          },
          department: user!.department,
          address: user!.address,
          avatar: user!.avatar,
          bio: user!.bio,
        }
      : ({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          role: "STAFF",
          gender: undefined,
          dateOfBirth: undefined,
          salary: 0,
          paymentMethod: "CASH",

          paymentAccount: {
            accountHolderName: "",
            accountNumber: "",
          },

          bankAccount: {
            accountHolderName: "",
            accountNumber: "",
            bankName: "",
            branchName: "",
            routingNumber: "",
          },
          designation: "",
          department: "",
          address: "",
        } as CreateUserInput),
  });

  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const paymentMethod = watch("paymentMethod");
  const avatarUrl = watch("avatar" as never) as unknown as string | undefined;

  async function handleAvatarUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB.");
      return;
    }

    try {
      setIsUploadingAvatar(true);

      const url = await uploadToCloudinary(file);

      setValue("avatar" as never, url as never, {
        shouldDirty: true,
        shouldValidate: true,
      });

      toast.success("Profile photo uploaded successfully.");
    } catch (error) {
      console.error("Avatar upload failed:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload profile photo.",
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  function handleAvatarRemove() {
    setValue("avatar" as never, undefined as never, {
      shouldDirty: true,
      shouldValidate: true,
    });

    toast.success("Profile photo removed.");
  }

  const initials = useMemo(
    () => getInitials(firstName, lastName) || "?",
    [firstName, lastName],
  );

  async function handleFormSubmit(data: FormValues) {
    setSubmitError(null);
    setNewPasswordError(null);

    const wantsPasswordChange = showPasswordReset && newPassword.length > 0;

    if (wantsPasswordChange && newPassword.length < MIN_PASSWORD_LENGTH) {
      setNewPasswordError(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      );
      return;
    }

    try {
      // Change password first so a failure here doesn't leave a half-saved state
      if (wantsPasswordChange && user && onChangePassword) {
        await onChangePassword(user._id, newPassword);
        setNewPassword("");
        toast.success("Password updated successfully.");
      }

      await onSubmit(sanitizePayload(data));
    } catch (error) {
      setSubmitError(
        error instanceof ApiError
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  function onInvalid(formErrors: any) {
    const firstError = Object.values(formErrors)[0] as any;

    toast.error(
      firstError?.message ||
        "Please fix the highlighted fields before submitting.",
    );
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit, onInvalid)}
      noValidate
      className="space-y-8"
    >
      {submitError && (
        <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-3.5">
          <AlertCircle
            className="mt-0.5 h-4 w-4 shrink-0 text-destructive"
            aria-hidden="true"
          />
          <p className="text-sm text-destructive">{submitError}</p>
        </div>
      )}

      {/* Identity */}
      <section className="space-y-4">
        <SectionHeading
          icon={UserIcon}
          title="Identity"
          description="Basic information used across the panel."
        />

        <AvatarUploader
          avatarUrl={avatarUrl}
          initials={initials}
          firstName={firstName}
          lastName={lastName}
          isUploading={isUploadingAvatar}
          disabled={isLoading}
          onUpload={handleAvatarUpload}
          onRemove={handleAvatarRemove}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              placeholder="John"
              className={inputClassName}
              aria-invalid={Boolean(errors.firstName)}
              {...register("firstName")}
            />
            <FieldError
              message={errors.firstName?.message as string | undefined}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              placeholder="Doe"
              className={inputClassName}
              aria-invalid={Boolean(errors.lastName)}
              {...register("lastName")}
            />
            <FieldError
              message={errors.lastName?.message as string | undefined}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            placeholder="+0181878-8816"
            className={inputClassName}
            aria-invalid={Boolean(errors.phone)}
            {...register("phone" as never)}
          />
          <FieldError message={errors.phone?.message as string | undefined} />
        </div>
      </section>

      {/* Account & access — create mode only */}
      {!isEditMode && (
        <section className="space-y-4">
          <SectionHeading
            icon={Shield}
            title="Account & access"
            description="Login credentials for the new user."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className={inputClassName}
                aria-invalid={Boolean(
                  (errors as Record<string, { message?: string }>).email,
                )}
                {...register("email" as never)}
              />
              <FieldError
                message={
                  (errors as Record<string, { message?: string }>).email
                    ?.message
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter minimum 8 characters"
                  className={cn(inputClassName, "pr-10")}
                  aria-invalid={Boolean(
                    (errors as Record<string, { message?: string }>).password,
                  )}
                  {...register("password" as never)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              <FieldError
                message={
                  (errors as Record<string, { message?: string }>).password
                    ?.message
                }
              />
            </div>
          </div>
        </section>
      )}

      {/* Password reset — edit mode, admin / super admin only */}
      {showPasswordReset && (
        <section className="space-y-4">
          <SectionHeading
            icon={KeyRound}
            title="Change password"
            description="Leave empty to keep the current password."
          />

          <div className="space-y-1.5">
            <Label htmlFor="newPassword">New password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Enter minimum 8 characters"
                value={newPassword}
                onChange={(event) => {
                  setNewPassword(event.target.value);
                  if (newPasswordError) setNewPasswordError(null);
                }}
                className={cn(inputClassName, "pr-10")}
                aria-invalid={Boolean(newPasswordError)}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                aria-label={
                  showNewPassword ? "Hide password" : "Show password"
                }
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
            <FieldError message={newPasswordError ?? undefined} />
          </div>
        </section>
      )}

      {/* Role & work details */}
      <section className="space-y-4">
        <SectionHeading
          icon={Briefcase}
          title="Role & work details"
          description="Controls permissions and where this user shows up in the org."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className={cn(inputClassName, "w-full")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError message={errors.role?.message as string | undefined} />
          </div>

          <div className="space-y-1.5">
            <Label>Department</Label>
            <Controller
              control={control}
              name={"department" as never}
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className={cn(inputClassName, "w-full")}>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Designation</Label>
            <Controller
              control={control}
              name={"designation" as never}
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className={cn(inputClassName, "w-full")}>
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_DESIGNATIONS.map((designation) => (
                      <SelectItem key={designation} value={designation}>
                        {designation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="123 Main St, City, State"
              className={inputClassName}
              {...register("address" as never)}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading
          icon={UserIcon}
          title="Personal & Compensation"
          description="Personal details and employee payment information."
        />

        {/* Personal information */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Gender</Label>

            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className={cn(inputClassName, "w-full")}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>

                  <SelectContent>
                    {USER_GENDER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <FieldError
              message={errors.gender?.message as string | undefined}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dateOfBirth">Date of birth</Label>

            <Input
              id="dateOfBirth"
              type="date"
              className={inputClassName}
              {...register("dateOfBirth" as never)}
            />

            <FieldError
              message={errors.dateOfBirth?.message as string | undefined}
            />
          </div>
        </div>

        {/* Salary & payment */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="salary">Monthly salary</Label>

            <div className="relative">
              <Banknote className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="salary"
                type="number"
                min="0"
                placeholder="50000"
                className={cn(inputClassName, "pl-9")}
                {...register("salary" as never, {
                  valueAsNumber: true,
                })}
              />
            </div>

            <FieldError
              message={errors.salary?.message as string | undefined}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Payment method</Label>

            <Controller
              control={control}
              name="paymentMethod"
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className={cn(inputClassName, "w-full")}>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>

                  <SelectContent>
                    {USER_PAYMENT_METHOD_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            <FieldError
              message={errors.paymentMethod?.message as string | undefined}
            />
          </div>
        </div>

        {/* Mobile wallet */}
        {(paymentMethod === "BKASH" || paymentMethod === "NAGAD") && (
          <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" />

              <div>
                <p className="text-sm font-semibold">
                  {paymentMethod === "BKASH" ? "bKash" : "Nagad"} account
                </p>

                <p className="text-xs text-muted-foreground">
                  Enter the payment account details.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Account holder name</Label>

                <Input
                  placeholder="John Doe"
                  className={inputClassName}
                  {...register("paymentAccount.accountHolderName" as never)}
                />

                <FieldError
                  message={
                    (
                      errors.paymentAccount as
                        | { accountHolderName?: { message?: string } }
                        | undefined
                    )?.accountHolderName?.message
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label>Account number</Label>

                <Input
                  placeholder="01XXXXXXXXX"
                  className={inputClassName}
                  {...register("paymentAccount.accountNumber" as never)}
                />

                <FieldError
                  message={
                    (
                      errors.paymentAccount as
                        | { accountNumber?: { message?: string } }
                        | undefined
                    )?.accountNumber?.message
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Bank */}
        {paymentMethod === "BANK" && (
          <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />

              <div>
                <p className="text-sm font-semibold">
                  Bank account information
                </p>

                <p className="text-xs text-muted-foreground">
                  Provide the employee&apos;s bank account details.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Account holder name</Label>

                <Input
                  placeholder="John Doe"
                  className={inputClassName}
                  {...register("bankAccount.accountHolderName" as never)}
                />

                <FieldError
                  message={
                    (
                      errors.bankAccount as
                        | { accountHolderName?: { message?: string } }
                        | undefined
                    )?.accountHolderName?.message
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label>Account number</Label>

                <Input
                  placeholder="Enter account number"
                  className={inputClassName}
                  {...register("bankAccount.accountNumber" as never)}
                />

                <FieldError
                  message={
                    (
                      errors.bankAccount as
                        | { accountNumber?: { message?: string } }
                        | undefined
                    )?.accountNumber?.message
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label>Bank name</Label>

                <Input
                  placeholder="Bank name"
                  className={inputClassName}
                  {...register("bankAccount.bankName" as never)}
                />

                <FieldError
                  message={
                    (
                      errors.bankAccount as
                        | { bankName?: { message?: string } }
                        | undefined
                    )?.bankName?.message
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label>Branch name</Label>

                <Input
                  placeholder="Branch name"
                  className={inputClassName}
                  {...register("bankAccount.branchName" as never)}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label>Routing number</Label>

                <Input
                  placeholder="Routing number"
                  className={inputClassName}
                  {...register("bankAccount.routingNumber" as never)}
                />
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="flex justify-end gap-3 border-t border-border/60 pt-6">
        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 gap-2 rounded-xl bg-indigo-600 px-6 font-medium text-white shadow-[0_1px_2px_rgba(79,70,229,0.1),0_8px_20px_-8px_rgba(79,70,229,0.5)] transition-transform duration-200 ease-in-out hover:scale-[1.02] hover:bg-indigo-700 disabled:pointer-events-none disabled:opacity-70"
        >
          {(isLoading || isUploadingAvatar) && (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          )}

          {isUploadingAvatar
            ? "Uploading photo..."
            : isEditMode
              ? "Update user"
              : "Create user"}
        </Button>
      </div>
    </form>
  );
}