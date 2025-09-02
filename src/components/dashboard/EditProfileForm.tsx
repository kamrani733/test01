// "use client";

// import type React from "react";
// import { useState } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { useDictionary } from "@/core/hooks/use-dictionary";
// import { SearchableCombobox } from "@/components/ui/SearchableCombobox";
// import TextInput from "@/components/account/input/TextInput";
// import { Loader2 } from "lucide-react";
// import { ImageTs } from "@/core/types/imageTs";
// import FileUploadInput from "../account/input/FileUploadInput";
// import { DatePicker } from "../account/input/DatePicker";
// import SelectField from "../account/input/SelectField";
// import {
//   UserProfileData,
//   userProfileSchema,
// } from "@/core/schemas/userProfileSchema";
// import {
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   DialogTrigger,
// } from "../ui/dialog";
// import { useAddressStore } from "@/stores";
// import dynamic from "next/dynamic";
// import {
//   updateProfile,
//   UserResponseData,
// } from "@/core/lib/api/main/dashboard-api";

// const LocationPicker = dynamic(
//   () => import("./LocationPicker"),
//   { ssr: false } // disable server-side rendering
// );

// interface List {
//   value: number;
//   label: string;
// }

// interface CreateEditUserFormProps {
//   cities: List[];
//   defaultValue?: UserResponseData & { avatar?: ImageTs };
// }

// const GENDER_OPTIONS = [
//   { value: "male", label: "مرد" },
//   { value: "female", label: "زن" },
// ];

// export default function EditProfileForm({
//   cities,
//   defaultValue,
// }: CreateEditUserFormProps) {
//   const { dictionary } = useDictionary();
//   const [attachmentId, setAttachmentId] = useState<number | null>(null);
//   const [open, setOpen] = useState(false);

//   const handleUploadSuccess = (image: ImageTs | null) => {
//     if (image) {
//       setAttachmentId(image.id ?? null);
//     }
//   };

//   const { selectedAddress, selectedLocation } = useAddressStore();

//   console.log("Address:", selectedAddress);
//   console.log("location:", selectedLocation);

//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors, isSubmitting },
//   } = useForm<UserProfileData>({
//     defaultValues: {
//       ...defaultValue,
//       address: defaultValue?.address || "",
//     },
//     resolver: zodResolver(userProfileSchema),
//   });

//   const onSubmit = async (formData: UserProfileData) => {
//     try {
//       // Combine form data with attachmentId
//       const payload = {
//         ...formData,
//         avatar_id: Number(attachmentId),
//         selectedLocation,
//         selectedAddress,
//         city_id: Number(formData.city_id),
//       };
//       console.log("Payload to send:", payload);
//       const result = await updateProfile({ profileData: payload });
//       console.log("final result:", result);
//       toast.success(result.message);
//       return result;
//     } catch (error) {
//       console.error("Profile update failed:", error);
//       throw error;
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit(onSubmit)}
//       className="border border-primary-300 rounded-sm py-20 px-40"
//     >
//       <div className="grid grid-cols-2 gap-8 mb-16">
//         <div className="col-span-1">
//           <TextInput
//             label=""
//             name="first_name"
//             register={register}
//             errors={errors}
//             placeholder={dictionary.forms.firstname}
//             disabled={isSubmitting}
//           />
//         </div>
//         <div className="col-span-1">
//           <TextInput
//             label=""
//             name="last_name"
//             register={register}
//             errors={errors}
//             placeholder={dictionary.forms.lastname}
//             disabled={isSubmitting}
//           />
//         </div>
//         <div className="col-span-1">
//           <TextInput
//             label=""
//             name="nickname"
//             register={register}
//             errors={errors}
//             placeholder={dictionary.forms.nickname}
//             disabled={isSubmitting}
//           />
//         </div>
//         <div className="col-span-1">
//           <Controller
//             control={control}
//             name="gender"
//             render={({ field }) => (
//               <SelectField
//                 label=""
//                 value={field.value || ""}
//                 onValueChange={field.onChange}
//                 options={GENDER_OPTIONS}
//                 placeholder={dictionary.forms.gender}
//                 disabled={isSubmitting}
//                 error={errors.gender?.message}
//               />
//             )}
//           />
//         </div>
//         <div className="col-span-1">
//           <Controller
//             control={control}
//             name="birthdate_jalali"
//             render={({ field }) => (
//               <DatePicker
//                 className="border-none"
//                 value={field.value || ""}
//                 onChange={field.onChange}
//                 errors={errors}
//                 placeholder={dictionary.forms.birthdate}
//                 label=""
//                 name="birthdate_jalali"
//               />
//             )}
//           />
//         </div>
//         <div className="col-span-1">
//           <Controller
//             control={control}
//             name="date_marriage"
//             render={({ field }) => (
//               <DatePicker
//                 value={field.value || ""}
//                 onChange={field.onChange}
//                 errors={errors}
//                 placeholder={dictionary.forms.dateMarriage}
//                 label=""
//                 name="date_marriage"
//               />
//             )}
//           />
//         </div>
//         <div className="col-span-1">
//           <TextInput
//             label=""
//             name="national_code"
//             register={register}
//             errors={errors}
//             placeholder={dictionary.forms.nationalCode}
//             disabled={isSubmitting}
//           />
//         </div>

//         <div className="col-span-1">
//           <TextInput
//             label=""
//             name="phone_code"
//             register={register}
//             errors={errors}
//             placeholder={dictionary.forms.phoneCode}
//             disabled={isSubmitting}
//           />
//         </div>
//         <div className="col-span-1">
//           <TextInput
//             label=""
//             name="phone"
//             register={register}
//             errors={errors}
//             placeholder={dictionary.forms.phone}
//             disabled={isSubmitting}
//           />
//         </div>
//         <div className="col-span-1">
//           <TextInput
//             label=""
//             name="email"
//             register={register}
//             errors={errors}
//             placeholder={dictionary.forms.email}
//             disabled={isSubmitting}
//           />
//         </div>

//         <div className="col-span-1">
//           <Controller
//             control={control}
//             name="city_id"
//             render={({ field }) => (
//               <SearchableCombobox
//                 options={cities}
//                 value={field.value || ""}
//                 onValueChange={field.onChange}
//                 label=""
//                 placeholder="انتخاب شهر"
//                 disabled={isSubmitting}
//                 error={errors.city_id?.message}
//               />
//             )}
//           />
//         </div>

//         <Dialog open={open} onOpenChange={setOpen}>
//           <div className="flex justify-between items-center">
//             <DialogTrigger asChild>
//               <Button>open</Button>
//             </DialogTrigger>
//           </div>
//           <DialogContent>
//             <DialogTitle></DialogTitle>
//             <LocationPicker setOpen={setOpen} />
//           </DialogContent>
//         </Dialog>

//         <div className="col-span-1">
//           <TextInput
//             label=""
//             name="address"
//             register={register}
//             errors={errors}
//             placeholder={dictionary.forms.address}
//             disabled={isSubmitting}
//           />
//         </div>
//         <div className="col-span-1">
//           <TextInput
//             label=""
//             name="postal_code"
//             register={register}
//             errors={errors}
//             placeholder={dictionary.forms.postalCode}
//             disabled={isSubmitting}
//           />
//         </div>
//         <div className="col-span-1">
//           <TextInput
//             label=""
//             name="address_plaque"
//             register={register}
//             errors={errors}
//             placeholder={dictionary.forms.plaque}
//             disabled={isSubmitting}
//           />
//         </div>
//         <div className="col-span-1">
//           <TextInput
//             label=""
//             name="address_floor"
//             register={register}
//             errors={errors}
//             placeholder={dictionary.forms.floor}
//             disabled={isSubmitting}
//           />
//         </div>
//         <div className="col-span-1">
//           <TextInput
//             label=""
//             name="address_unit"
//             register={register}
//             errors={errors}
//             placeholder={dictionary.forms.unit}
//             disabled={isSubmitting}
//           />
//         </div>

//         <div className="col-span-1">
//           <TextInput
//             label=""
//             name="job"
//             register={register}
//             errors={errors}
//             placeholder={dictionary.forms.job}
//             disabled={isSubmitting}
//           />
//         </div>
//         <div className="col-span-1">
//           <TextInput
//             label=""
//             name="education"
//             register={register}
//             errors={errors}
//             placeholder={dictionary.forms.education}
//             disabled={isSubmitting}
//           />
//         </div>

//         <div className="col-span-1">
//           <FileUploadInput
//             accept="image/*"
//             disabled={isSubmitting}
//             onUploadSuccess={handleUploadSuccess}
//             error={errors.avatar_id?.message}
//             defaultImageUrl={defaultValue?.avatar_info?.url}
//             defaultImageName={defaultValue?.avatar_info?.name}
//           />
//         </div>
//       </div>

//       <Button
//         type="submit"
//         disabled={isSubmitting}
//         className="w-full h-11 text-base"
//       >
//         {isSubmitting ? (
//           <Loader2 className="animate-spin h-5 w-5 mr-2" />
//         ) : (
//           dictionary.common.submit
//         )}
//       </Button>
//     </form>
//   );
// }
