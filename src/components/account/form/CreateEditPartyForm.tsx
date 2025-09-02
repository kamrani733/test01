"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, Search } from "lucide-react";
import TextInput from "@/components/account/input/TextInput";
import TextareaInput from "@/components/account/input/TextareaInput";
import { getCompanyFormSchema, getPersonFormSchema, CompanyFormData, PersonFormData } from "@/core/schemas/partySchema";
import { Party, Company, Person } from "@/core/models/party-model";
import { useDictionary } from "@/core/hooks/use-dictionary";
import SelectField from "../input/SelectField";
import { createCompany, createPerson, updateParty, checkPartyMobileExists, checkPartyEmailExists, checkPartyCodeExists, checkCompanyNationalIdExists, checkPersonNationalCodeExists } from "@/core/lib/api/account/parties";
import { useCreateUpdateMutation } from "@/core/hooks/common/useCreateUpdateMutation";
import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PARTY_TYPE_OPTIONS, STATUS_OPTIONS, GENDER_OPTIONS, EMPLOYEE_NUM_OPTIONS } from "@/core/models/party-model";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PartySearchModal from "../PartySearchModal";

interface CreateEditPartyFormProps {
  onSuccess: () => void;
  partyToEdit?: Partial<Party>;
}

export default function CreateEditPartyForm({
  onSuccess,
  partyToEdit = {},
}: CreateEditPartyFormProps) {
  const { id, entity } = partyToEdit;
  const { dictionary } = useDictionary();
  const isEditSession = Boolean(id);
  const [activeTab, setActiveTab] = useState<"person" | "company">(entity as "person" | "company" || "person");
  const [showSearchModal, setShowSearchModal] = useState(false);
  
  // Validation states
  const [mobileValidationError, setMobileValidationError] = useState<string>("");
  const [emailValidationError, setEmailValidationError] = useState<string>("");
  const [codeValidationError, setCodeValidationError] = useState<string>("");
  const [nationalValidationError, setNationalValidationError] = useState<string>("");
  const [isValidating, setIsValidating] = useState(false);

  const isPerson = activeTab === "person";

  const form = useForm<any>({
    defaultValues: {
      entity: activeTab,
      type: partyToEdit.type || [],
      code: partyToEdit.code || "",
      email: partyToEdit.email || "",
      mobile: partyToEdit.mobile || "",
      status: partyToEdit.status || "active",
      city_id: partyToEdit.city_id ? Number(partyToEdit.city_id) : 1,
      address: partyToEdit.address || "",
      address_plaque: partyToEdit.address_plaque || "",
      address_floor: partyToEdit.address_floor || "",
      address_unit: partyToEdit.address_unit || "",
      postal_code: partyToEdit.postal_code || "",
      mobile2: partyToEdit.mobile2 || "",
      pre_phone: partyToEdit.pre_phone || "",
      phone: partyToEdit.phone || "",
      pre_phone2: partyToEdit.pre_phone2 || "",
      phone2: partyToEdit.phone2 || "",
      website: partyToEdit.website || "",
      description: partyToEdit.description || "",
      logo_avatar_id: partyToEdit.logo_avatar_id ? Number(partyToEdit.logo_avatar_id) : undefined,
      location_lat: partyToEdit.location_lat ? Number(partyToEdit.location_lat) : undefined,
      location_lon: partyToEdit.location_lon ? Number(partyToEdit.location_lon) : undefined,
      ...(isPerson ? {
        first_name: (partyToEdit as Person).first_name || "",
        last_name: (partyToEdit as Person).last_name || "",
        national_code: (partyToEdit as Person).national_code || "",
        gender: (partyToEdit as Person).gender || undefined,
        birthdate: (partyToEdit as Person).birthdate || "",
        date_marriage: (partyToEdit as Person).date_marriage || "",
        job: (partyToEdit as Person).job || "",
        fax: (partyToEdit as Person).fax || "",
        bank_name: (partyToEdit as Person).bank_name || "",
        card_number: (partyToEdit as Person).card_number || "",
        account_number: (partyToEdit as Person).account_number || "",
        iban: (partyToEdit as Person).iban || "",
        referrer_name: (partyToEdit as Person).referrer_name || "",
        referrer_job: (partyToEdit as Person).referrer_job || "",
        referrer_phone: (partyToEdit as Person).referrer_phone || "",
        driving_license_number: (partyToEdit as Person).driving_license_number || "",
        driving_license_type: (partyToEdit as Person).driving_license_type || "",
      } : {
        legal_name: (partyToEdit as Company).legal_name || "",
        trade_name: (partyToEdit as Company).trade_name || "",
        national_id: (partyToEdit as Company).national_id || "",
        registration_code: (partyToEdit as Company).registration_code || "",
        economic_issue: (partyToEdit as Company).economic_issue || "",
        established_date: (partyToEdit as Company).established_date || "",
        employee_num: (partyToEdit as Company).employee_num || "",
      }),
    },
    resolver: isPerson ? zodResolver(getPersonFormSchema(dictionary)) : zodResolver(getCompanyFormSchema(dictionary)),
  });

  const { register, handleSubmit, control, formState: { errors }, setError, watch, clearErrors, setValue } = form;
  
  const watchedMobile = watch("mobile");
  const watchedEmail = watch("email");
  const watchedCode = watch("code");
  const watchedNational = watch(isPerson ? "national_code" : "national_id");

  // Validation effects
  useEffect(() => {
    const validateMobile = async () => {
      if (!watchedMobile || watchedMobile.length < 11) {
        setMobileValidationError("");
        return;
      }

      if (isEditSession && watchedMobile === partyToEdit.mobile) {
        setMobileValidationError("");
        return;
      }

      setIsValidating(true);
      try {
        const result = await checkPartyMobileExists(watchedMobile, isEditSession ? id as number : undefined);
        if (result.exists) {
          setMobileValidationError("شماره موبایل قبلاً ثبت شده است");
          setError("mobile", { message: "شماره موبایل قبلاً ثبت شده است" });
        } else {
          setMobileValidationError("");
          clearErrors("mobile");
        }
      } catch (error) {
        console.error("Error validating mobile:", error);
      } finally {
        setIsValidating(false);
      }
    };

    const timeoutId = setTimeout(validateMobile, 500);
    return () => clearTimeout(timeoutId);
  }, [watchedMobile, isEditSession, id, partyToEdit.mobile, setError, clearErrors]);

  useEffect(() => {
    const validateEmail = async () => {
      if (!watchedEmail || watchedEmail.length < 5) {
        setEmailValidationError("");
        return;
      }

      if (isEditSession && watchedEmail === partyToEdit.email) {
        setEmailValidationError("");
        return;
      }

      setIsValidating(true);
      try {
        const result = await checkPartyEmailExists(watchedEmail, isEditSession ? id as number : undefined);
        if (result.exists) {
          setEmailValidationError("ایمیل قبلاً ثبت شده است");
          setError("email", { message: "ایمیل قبلاً ثبت شده است" });
        } else {
          setEmailValidationError("");
          clearErrors("email");
        }
      } catch (error) {
        console.error("Error validating email:", error);
      } finally {
        setIsValidating(false);
      }
    };

    const timeoutId = setTimeout(validateEmail, 500);
    return () => clearTimeout(timeoutId);
  }, [watchedEmail, isEditSession, id, partyToEdit.email, setError, clearErrors]);

  useEffect(() => {
    const validateCode = async () => {
      if (!watchedCode || watchedCode.length < 2) {
        setCodeValidationError("");
        return;
      }

      if (isEditSession && watchedCode === partyToEdit.code) {
        setCodeValidationError("");
        return;
      }

      setIsValidating(true);
      try {
        const result = await checkPartyCodeExists(watchedCode, isEditSession ? id as number : undefined);
        if (result.exists) {
          setCodeValidationError("کد طرف قبلاً ثبت شده است");
          setError("code", { message: "کد طرف قبلاً ثبت شده است" });
        } else {
          setCodeValidationError("");
          clearErrors("code");
        }
      } catch (error) {
        console.error("Error validating code:", error);
      } finally {
        setIsValidating(false);
      }
    };

    const timeoutId = setTimeout(validateCode, 500);
    return () => clearTimeout(timeoutId);
  }, [watchedCode, isEditSession, id, partyToEdit.code, setError, clearErrors]);

  useEffect(() => {
    const validateNational = async () => {
      if (!watchedNational || watchedNational.length < 5) {
        setNationalValidationError("");
        return;
      }

      const originalValue = isPerson 
        ? (partyToEdit as Person).national_code 
        : (partyToEdit as Company).national_id;

      if (isEditSession && watchedNational === originalValue) {
        setNationalValidationError("");
        return;
      }

      setIsValidating(true);
      try {
        const result = isPerson 
          ? await checkPersonNationalCodeExists(watchedNational, isEditSession ? id as number : undefined)
          : await checkCompanyNationalIdExists(watchedNational, isEditSession ? id as number : undefined);
        
        if (result.exists) {
          const fieldName = isPerson ? "کد ملی" : "شناسه ملی";
          setNationalValidationError(`${fieldName} قبلاً ثبت شده است`);
          setError(isPerson ? "national_code" : "national_id", { message: `${fieldName} قبلاً ثبت شده است` });
        } else {
          setNationalValidationError("");
          clearErrors(isPerson ? "national_code" : "national_id");
        }
      } catch (error) {
        console.error("Error validating national:", error);
      } finally {
        setIsValidating(false);
      }
    };

    const timeoutId = setTimeout(validateNational, 500);
    return () => clearTimeout(timeoutId);
  }, [watchedNational, isPerson, isEditSession, id, partyToEdit, setError, clearErrors]);

  const createMutation = useCreateUpdateMutation<any>({
    mutationFn: (data) => {
      if (data.entity === "company") {
        return createCompany(data);
      } else {
        return createPerson(data);
      }
    },
    queryKey: ["parties"],
    operation: "create",
    setError: (name: any, error: any) => setError(name, error),
    onSuccess,
  });

  const updateMutation = useCreateUpdateMutation<any>({
    mutationFn: (data) => updateParty({ ...data, id: id as number }),
    queryKey: ["parties"],
    operation: "update",
    setError: (name: any, error: any) => setError(name, error),
    onSuccess,
  });

  const onSubmit = (data: any) => {
    if (isEditSession) {
      updateMutation.mutate({ ...data, id: id as number });
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = isEditSession ? updateMutation.isPending : createMutation.isPending;

  const hasValidationErrors = !!(
    mobileValidationError || 
    emailValidationError || 
    codeValidationError || 
    nationalValidationError
  );

  const handleSearchForExisting = () => {
    const currentValues = watch();
    const searchFields: any = {};
    
    if (currentValues.mobile) searchFields.mobile = currentValues.mobile;
    if (currentValues.email) searchFields.email = currentValues.email;
    if (currentValues.code) searchFields.code = currentValues.code;
    
    if (isPerson) {
      if ((currentValues as any).first_name) searchFields.first_name = (currentValues as any).first_name;
      if ((currentValues as any).last_name) searchFields.last_name = (currentValues as any).last_name;
      if ((currentValues as any).national_code) searchFields.national_code = (currentValues as any).national_code;
    } else {
      if ((currentValues as any).trade_name) searchFields.trade_name = (currentValues as any).trade_name;
      if ((currentValues as any).national_id) searchFields.national_id = (currentValues as any).national_id;
    }
    
    setShowSearchModal(true);
  };

  const handleSelectExistingParty = (party: Party) => {
    // Fill form with existing party data
    setValue("entity", party.entity);
    setValue("type", party.type || []);
    setValue("code", party.code || "");
    setValue("email", party.email || "");
    setValue("mobile", party.mobile);
    setValue("status", party.status);
    setValue("city_id", party.city_id ? Number(party.city_id) : undefined);
    setValue("address", party.address || "");
    setValue("address_plaque", party.address_plaque || "");
    setValue("address_floor", party.address_floor || "");
    setValue("address_unit", party.address_unit || "");
    setValue("postal_code", party.postal_code || "");
    setValue("mobile2", party.mobile2 || "");
    setValue("pre_phone", party.pre_phone || "");
    setValue("phone", party.phone || "");
    setValue("pre_phone2", party.pre_phone2 || "");
    setValue("phone2", party.phone2 || "");
    setValue("website", party.website || "");
    setValue("description", party.description || "");
    setValue("logo_avatar_id", party.logo_avatar_id ? Number(party.logo_avatar_id) : undefined);
    setValue("location_lat", party.location_lat ? Number(party.location_lat) : undefined);
    setValue("location_lon", party.location_lon ? Number(party.location_lon) : undefined);

    if (party.entity === "person") {
      const person = party as Person;
      setValue("first_name", person.first_name);
      setValue("last_name", person.last_name);
      setValue("national_code", person.national_code || "");
      setValue("gender", person.gender);
      setValue("birthdate", person.birthdate || "");
      setValue("date_marriage", person.date_marriage || "");
      setValue("job", person.job || "");
      setValue("fax", person.fax || "");
      setValue("bank_name", person.bank_name || "");
      setValue("card_number", person.card_number || "");
      setValue("account_number", person.account_number || "");
      setValue("iban", person.iban || "");
      setValue("referrer_name", person.referrer_name || "");
      setValue("referrer_job", person.referrer_job || "");
      setValue("referrer_phone", person.referrer_phone || "");
      setValue("driving_license_number", person.driving_license_number || "");
      setValue("driving_license_type", person.driving_license_type || "");
    } else {
      const company = party as Company;
      setValue("legal_name", company.legal_name || "");
      setValue("trade_name", company.trade_name);
      setValue("national_id", company.national_id || "");
      setValue("registration_code", company.registration_code || "");
      setValue("economic_issue", company.economic_issue || "");
      setValue("established_date", company.established_date || "");
      setValue("employee_num", company.employee_num || "");
    }
    
    setActiveTab(party.entity);
    onSuccess(); // Close the form since we're editing existing party
  };

  return (
    <div className="flex w-full min-w-10 flex-col gap-5">
      {!isEditSession && (
        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value as "person" | "company");
          setValue("entity", value as "person" | "company");
        }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="person">شخص</TabsTrigger>
            <TabsTrigger value="company">شرکت</TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      <form
        className="flex w-full min-w-10 flex-col gap-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Common Fields */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">اطلاعات عمومی</h3>
          
          {/* Type Field */}
          <div className="space-y-2">
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <SelectField
                  label="نوع طرف"
                  value={field.value || []}
                  onValueChange={field.onChange}
                  options={PARTY_TYPE_OPTIONS.map(option => ({
                    value: option.key,
                    label: option.label
                  }))}
                  placeholder="انتخاب نوع طرف"
                  disabled={isPending}
                  error={errors.type?.message as string}
                />
              )}
            />
          </div>

          {/* Code Field */}
          <div className="space-y-2">
            <TextInput
              label="کد طرف"
              name="code"
              register={register}
              errors={errors}
              placeholder="کد اختصاری طرف"
              disabled={isPending}
            />
            {codeValidationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{codeValidationError}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Mobile Field */}
          <div className="space-y-2">
            <TextInput
              label="شماره موبایل *"
              name="mobile"
              register={register}
              errors={errors}
              placeholder="09123456789"
              disabled={isPending}
            />
            {isValidating && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                در حال بررسی شماره موبایل...
              </div>
            )}
            {mobileValidationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{mobileValidationError}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <TextInput
              label="ایمیل"
              name="email"
              register={register}
              errors={errors}
              placeholder="example@domain.com"
              disabled={isPending}
            />
            {emailValidationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{emailValidationError}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Status Field */}
          <div className="space-y-2">
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <SelectField
                  label="وضعیت *"
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  options={STATUS_OPTIONS.map(option => ({
                    value: option.key,
                    label: option.label
                  }))}
                  placeholder="انتخاب وضعیت"
                  disabled={isPending}
                  error={errors.status?.message as string}
                />
              )}
            />
          </div>
        </div>

        {/* Entity Specific Fields */}
        {isPerson ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">اطلاعات شخص</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="نام *"
                name="first_name"
                register={register}
                errors={errors}
                placeholder="نام"
                disabled={isPending}
              />
              <TextInput
                label="نام خانوادگی *"
                name="last_name"
                register={register}
                errors={errors}
                placeholder="نام خانوادگی"
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <TextInput
                label="کد ملی"
                name="national_code"
                register={register}
                errors={errors}
                placeholder="1234567890"
                disabled={isPending}
              />
              {nationalValidationError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{nationalValidationError}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <SelectField
                    label="جنسیت"
                    value={field.value || ""}
                    onValueChange={field.onChange}
                    options={GENDER_OPTIONS.map(option => ({
                      value: option.key,
                      label: option.label
                    }))}
                    placeholder="انتخاب جنسیت"
                    disabled={isPending}
                    error={errors.gender?.message as string}
                  />
                )}
              />
              <TextInput
                label="شغل"
                name="job"
                register={register}
                errors={errors}
                placeholder="شغل"
                disabled={isPending}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">اطلاعات شرکت</h3>
            
            <TextInput
              label="نام تجاری *"
              name="trade_name"
              register={register}
              errors={errors}
              placeholder="نام تجاری شرکت"
              disabled={isPending}
            />

            <TextInput
              label="نام حقوقی"
              name="legal_name"
              register={register}
              errors={errors}
              placeholder="نام رسمی شرکت"
              disabled={isPending}
            />

            <div className="space-y-2">
              <TextInput
                label="شناسه ملی"
                name="national_id"
                register={register}
                errors={errors}
                placeholder="14009876543"
                disabled={isPending}
              />
              {nationalValidationError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{nationalValidationError}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="کد ثبت"
                name="registration_code"
                register={register}
                errors={errors}
                placeholder="567890"
                disabled={isPending}
              />
              <TextInput
                label="کد اقتصادی"
                name="economic_issue"
                register={register}
                errors={errors}
                placeholder="123456789"
                disabled={isPending}
              />
            </div>
          </div>
        )}

        {/* Search and Submit Buttons */}
        <div className="flex gap-3">
          {!isEditSession && (
            <Button
              type="button"
              variant="outline"
              onClick={handleSearchForExisting}
              disabled={isPending || isValidating}
              className="flex-1 h-11 text-base"
            >
              <Search className="h-4 w-4 mr-2" />
              جستجوی طرف موجود
            </Button>
          )}
          
          <Button
            disabled={isPending || isValidating || hasValidationErrors}
            type="submit"
            className="flex-1 h-11 text-base"
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              isEditSession ? "ویرایش طرف" : "ایجاد طرف"
            )}
          </Button>
        </div>
      </form>

      {/* Search Modal */}
      <PartySearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSelectParty={handleSelectExistingParty}
        searchFields={(() => {
          const currentValues = watch();
          const searchFields: any = {};
          
          if (currentValues.mobile) searchFields.mobile = currentValues.mobile;
          if (currentValues.email) searchFields.email = currentValues.email;
          if (currentValues.code) searchFields.code = currentValues.code;
          
          if (isPerson) {
            if ((currentValues as any).first_name) searchFields.first_name = (currentValues as any).first_name;
            if ((currentValues as any).last_name) searchFields.last_name = (currentValues as any).last_name;
            if ((currentValues as any).national_code) searchFields.national_code = (currentValues as any).national_code;
          } else {
            if ((currentValues as any).trade_name) searchFields.trade_name = (currentValues as any).trade_name;
            if ((currentValues as any).national_id) searchFields.national_id = (currentValues as any).national_id;
          }
          
          return searchFields;
        })()}
      />
    </div>
  );
}
