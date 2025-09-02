'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useDictionary } from '@/core/hooks/use-dictionary';
import { Heading } from '@/components/ui/Heading';
import TextInput from '@/components/account/input/TextInput';
import FileUploadInput from '../input/FileUploadInput';
import ContainerView from '../ContainerView';
import { Loader2 } from 'lucide-react';
import FormSection from '../FormSection';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  getSettingsSchema,
  SettingsFormData,
} from '@/core/schemas/settingSchema';
import { updateSettings } from '@/core/lib/api/account/settings';
import { Settings } from '@/core/models/settings-model';
import { useCreateUpdateMutation } from '@/core/hooks/common/useCreateUpdateMutation';
import TextareaInput from '../input/TextareaInput';

interface Props {
  defaultValue: Settings;
}

export default function GlobalSettingsForm({ defaultValue }: Props) {
  const { dictionary } = useDictionary();
  const globalSettingsSchema = getSettingsSchema();
  const [logoDesktopId, setLogoDesktopId] = useState<number | null>(null);
  const [logoMobileId, setLogoMobileId] = useState<number | null>(null);
  const [favIconId, setFavIconId] = useState<number | null>(null);

  const filterDefaultValueWithoutNull = Object.fromEntries(
    Object.entries(defaultValue || {}).filter(([, value]) => value !== null)
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
  } = useForm<SettingsFormData>({
    defaultValues: {
      ...filterDefaultValueWithoutNull,
    },
    resolver: zodResolver(globalSettingsSchema),
  });

  const mutation = useCreateUpdateMutation<SettingsFormData>({
    mutationFn: updateSettings,
    queryKey: ['settings'],
    operation: 'update',
    setError,
  });

  const onSubmit = (data: SettingsFormData) => {
    const payload = { ...data };
    if (logoDesktopId) payload.logo_desktop = logoDesktopId.toString();
    if (logoMobileId) payload.logo_mobile = logoMobileId.toString();
    if (favIconId) payload.fav_icon = favIconId.toString();
    mutation.mutate(payload);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="space-y-2">
        <Heading level={3}>
          {dictionary.common.add + ' ' + dictionary.nav.settings}
        </Heading>
        <p className="text-primary-600">
          {dictionary.common.addItemDescription}
        </p>
      </div>
      <ContainerView>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          {/* Site Information */}
          <FormSection title={dictionary.ui.form.siteInfo}>
            <Tabs defaultValue="fa" className="w-full">
              <TabsList className="border border-muted bg-primary-0">
                <TabsTrigger
                  value="fa"
                  className="data-[state=active]:bg-muted"
                >
                  {dictionary.ui.language.fa}
                </TabsTrigger>
                <TabsTrigger
                  value="en"
                  className="data-[state=active]:bg-muted"
                >
                  {dictionary.ui.language.en}
                </TabsTrigger>
                <TabsTrigger
                  value="ar"
                  className="data-[state=active]:bg-muted"
                >
                  {dictionary.ui.language.ar}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="fa">
                <TextInput
                  label={`${dictionary.forms.siteTitle} ${dictionary.ui.language.fa}`}
                  name="site_title"
                  placeholder={`${dictionary.forms.siteTitle} ${dictionary.ui.language.fa}`}
                  register={register}
                  errors={errors}
                  disabled={isSubmitting}
                />
              </TabsContent>
              <TabsContent value="en">
                <TextInput
                  label={`${dictionary.forms.siteTitle} ${dictionary.ui.language.en}`}
                  name="site_title_en"
                  placeholder={`${dictionary.forms.siteTitle} ${dictionary.ui.language.en}`}
                  register={register}
                  errors={errors}
                  disabled={isSubmitting}
                />
              </TabsContent>
              <TabsContent value="ar">
                <TextInput
                  label={`${dictionary.forms.siteTitle} ${dictionary.ui.language.ar}`}
                  name="site_title_ar"
                  placeholder={`${dictionary.forms.siteTitle} ${dictionary.ui.language.ar}`}
                  register={register}
                  errors={errors}
                  disabled={isSubmitting}
                />
              </TabsContent>
            </Tabs>
            <Tabs defaultValue="fa" className="w-full">
              <TabsList className="border border-muted bg-primary-0">
                <TabsTrigger
                  value="fa"
                  className="data-[state=active]:bg-muted"
                >
                  {dictionary.ui.language.fa}
                </TabsTrigger>
                <TabsTrigger
                  value="en"
                  className="data-[state=active]:bg-muted"
                >
                  {dictionary.ui.language.en}
                </TabsTrigger>
                <TabsTrigger
                  value="ar"
                  className="data-[state=active]:bg-muted"
                >
                  {dictionary.ui.language.ar}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="fa">
                <TextareaInput
                  label={`${dictionary.forms.siteDescription} ${dictionary.ui.language.fa}`}
                  name="site_description"
                  placeholder={`${dictionary.forms.siteDescription} ${dictionary.ui.language.fa}`}
                  register={register}
                  errors={errors}
                  disabled={isSubmitting}
                />
              </TabsContent>
              <TabsContent value="en">
                <TextareaInput
                  label={`${dictionary.forms.siteDescription} ${dictionary.ui.language.en}`}
                  name="site_description_en"
                  placeholder={`${dictionary.forms.siteDescription} ${dictionary.ui.language.en}`}
                  register={register}
                  errors={errors}
                  disabled={isSubmitting}
                />
              </TabsContent>
              <TabsContent value="ar">
                <TextareaInput
                  label={`${dictionary.forms.siteDescription} ${dictionary.ui.language.ar}`}
                  name="site_description_ar"
                  placeholder={`${dictionary.forms.siteDescription} ${dictionary.ui.language.ar}`}
                  register={register}
                  errors={errors}
                  disabled={isSubmitting}
                />
              </TabsContent>
            </Tabs>
          </FormSection>
          <FormSection title={dictionary.forms.logoDesktop}>
            <FileUploadInput
              accept="image/*"
              disabled={isSubmitting}
              onUploadSuccess={image => {
                const imageId = image?.id ? Number(image.id) : null;
                setLogoDesktopId(imageId);
                setValue('logo_desktop', imageId?.toString() || '');
              }}
              error={errors.logo_desktop?.message}
              defaultImageUrl={defaultValue?.logo_desktop_info?.url}
              defaultImageName={defaultValue?.logo_desktop_info?.name}
            />
          </FormSection>
          <FormSection title={dictionary.forms.logoMobile}>
            <FileUploadInput
              accept="image/*"
              disabled={isSubmitting}
              onUploadSuccess={image => {
                const imageId = image?.id ? Number(image.id) : null;
                setLogoMobileId(imageId);
                setValue('logo_mobile', imageId?.toString() || '');
              }}
              error={errors.logo_mobile?.message}
              defaultImageUrl={defaultValue?.logo_mobile_info?.url}
              defaultImageName={defaultValue?.logo_mobile_info?.name}
            />
          </FormSection>
          <FormSection title={dictionary.forms.favIcon}>
            <FileUploadInput
              accept=".ico"
              disabled={isSubmitting}
              onUploadSuccess={image => {
                const imageId = image?.id ? Number(image.id) : null;
                setFavIconId(imageId);
                setValue('fav_icon', imageId?.toString() || '');
              }}
              error={errors.fav_icon?.message}
              defaultImageUrl={defaultValue?.fav_icon_info?.url}
              defaultImageName={defaultValue?.fav_icon_info?.name}
            />
          </FormSection>

          {/* SEO Information */}
          <FormSection title={dictionary.ui.form.seoInfo}>
            <Tabs defaultValue="fa" className="w-full">
              <TabsList className="border border-muted bg-primary-0">
                <TabsTrigger
                  value="fa"
                  className="data-[state=active]:bg-muted"
                >
                  {dictionary.ui.language.fa}
                </TabsTrigger>
                <TabsTrigger
                  value="en"
                  className="data-[state=active]:bg-muted"
                >
                  {dictionary.ui.language.en}
                </TabsTrigger>
                <TabsTrigger
                  value="ar"
                  className="data-[state=active]:bg-muted"
                >
                  {dictionary.ui.language.ar}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="fa">
                <TextInput
                  label={`${dictionary.forms.metaTitle} ${dictionary.ui.language.fa}`}
                  name="meta_title"
                  placeholder={`${dictionary.forms.metaTitle} ${dictionary.ui.language.fa}`}
                  register={register}
                  errors={errors}
                  disabled={isSubmitting}
                />
              </TabsContent>
              <TabsContent value="en">
                <TextInput
                  label={`${dictionary.forms.metaTitle} ${dictionary.ui.language.en}`}
                  name="meta_title_en"
                  placeholder={`${dictionary.forms.metaTitle} ${dictionary.ui.language.en}`}
                  register={register}
                  errors={errors}
                  disabled={isSubmitting}
                />
              </TabsContent>
              <TabsContent value="ar">
                <TextInput
                  label={`${dictionary.forms.metaTitle} ${dictionary.ui.language.ar}`}
                  name="meta_title_ar"
                  placeholder={`${dictionary.forms.metaTitle} ${dictionary.ui.language.ar}`}
                  register={register}
                  errors={errors}
                  disabled={isSubmitting}
                />
              </TabsContent>
            </Tabs>
            <Tabs defaultValue="fa" className="w-full">
              <TabsList className="border border-muted bg-primary-0">
                <TabsTrigger
                  value="fa"
                  className="data-[state=active]:bg-muted"
                >
                  {dictionary.ui.language.fa}
                </TabsTrigger>
                <TabsTrigger
                  value="en"
                  className="data-[state=active]:bg-muted"
                >
                  {dictionary.ui.language.en}
                </TabsTrigger>
                <TabsTrigger
                  value="ar"
                  className="data-[state=active]:bg-muted"
                >
                  {dictionary.ui.language.ar}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="fa">
                <TextareaInput
                  label={`${dictionary.forms.metaDescription} ${dictionary.ui.language.fa}`}
                  name="meta_description"
                  placeholder={`${dictionary.forms.metaDescription} ${dictionary.ui.language.fa}`}
                  register={register}
                  errors={errors}
                  disabled={isSubmitting}
                />
              </TabsContent>
              <TabsContent value="en">
                <TextareaInput
                  label={`${dictionary.forms.metaDescription} ${dictionary.ui.language.en}`}
                  name="meta_description_en"
                  placeholder={`${dictionary.forms.metaDescription} ${dictionary.ui.language.en}`}
                  register={register}
                  errors={errors}
                  disabled={isSubmitting}
                />
              </TabsContent>
              <TabsContent value="ar">
                <TextareaInput
                  label={`${dictionary.forms.metaDescription} ${dictionary.ui.language.ar}`}
                  name="meta_description_ar"
                  placeholder={`${dictionary.forms.metaDescription} ${dictionary.ui.language.ar}`}
                  register={register}
                  errors={errors}
                  disabled={isSubmitting}
                />
              </TabsContent>
            </Tabs>
            <Tabs defaultValue="fa" className="w-full">
              <TabsList className="border border-muted bg-primary-0">
                <TabsTrigger
                  value="fa"
                  className="data-[state=active]:bg-muted"
                >
                  {dictionary.ui.language.fa}
                </TabsTrigger>
                <TabsTrigger
                  value="en"
                  className="data-[state=active]:bg-muted"
                >
                  {dictionary.ui.language.en}
                </TabsTrigger>
                <TabsTrigger
                  value="ar"
                  className="data-[state=active]:bg-muted"
                >
                  {dictionary.ui.language.ar}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="fa">
                <TextInput
                  label={`${dictionary.forms.metaKeywords} ${dictionary.ui.language.fa}`}
                  name="meta_keywords"
                  placeholder={`${dictionary.forms.metaKeywords} ${dictionary.ui.language.fa}`}
                  register={register}
                  errors={errors}
                  disabled={isSubmitting}
                />
              </TabsContent>
              <TabsContent value="en">
                <TextInput
                  label={`${dictionary.forms.metaKeywords} ${dictionary.ui.language.en}`}
                  name="meta_keywords_en"
                  placeholder={`${dictionary.forms.metaKeywords} ${dictionary.ui.language.en}`}
                  register={register}
                  errors={errors}
                  disabled={isSubmitting}
                />
              </TabsContent>
              <TabsContent value="ar">
                <TextInput
                  label={`${dictionary.forms.metaKeywords} ${dictionary.ui.language.ar}`}
                  name="meta_keywords_ar"
                  placeholder={`${dictionary.forms.metaKeywords} ${dictionary.ui.language.ar}`}
                  register={register}
                  errors={errors}
                  disabled={isSubmitting}
                />
              </TabsContent>
            </Tabs>
          </FormSection>

          {/* Contact Information */}
          <FormSection title={dictionary.ui.form.contactInfo}>
            <Tabs defaultValue="fa" className="w-full">
              <TabsList className="border border-muted bg-primary-0">
                <TabsTrigger
                  value="fa"
                  className="data-[state=active]:bg-muted"
                >
                  {dictionary.ui.language.fa}
                </TabsTrigger>
                <TabsTrigger
                  value="en"
                  className="data-[state=active]:bg-muted"
                >
                  {dictionary.ui.language.en}
                </TabsTrigger>
                <TabsTrigger
                  value="ar"
                  className="data-[state=active]:bg-muted"
                >
                  {dictionary.ui.language.ar}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="fa">
                <TextareaInput
                  label={`${dictionary.forms.companyAddress} ${dictionary.ui.language.fa}`}
                  name="company_address"
                  placeholder={`${dictionary.forms.companyAddress} ${dictionary.ui.language.fa}`}
                  register={register}
                  errors={errors}
                  disabled={isSubmitting}
                />
              </TabsContent>
              <TabsContent value="en">
                <TextareaInput
                  label={`${dictionary.forms.companyAddress} ${dictionary.ui.language.en}`}
                  name="company_address_en"
                  placeholder={`${dictionary.forms.companyAddress} ${dictionary.ui.language.en}`}
                  register={register}
                  errors={errors}
                  disabled={isSubmitting}
                />
              </TabsContent>
              <TabsContent value="ar">
                <TextareaInput
                  label={`${dictionary.forms.companyAddress} ${dictionary.ui.language.ar}`}
                  name="company_address_ar"
                  placeholder={`${dictionary.forms.companyAddress} ${dictionary.ui.language.ar}`}
                  register={register}
                  errors={errors}
                  disabled={isSubmitting}
                />
              </TabsContent>
            </Tabs>
            <TextInput
              label={`${dictionary.forms.locationLat} ${dictionary.forms.company}`}
              name="company_lat"
              placeholder={dictionary.forms.locationLat}
              register={register}
              errors={errors}
              disabled={isSubmitting}
            />
            <TextInput
              label={`${dictionary.forms.locationLon} ${dictionary.forms.company}`}
              name="company_lon"
              placeholder={dictionary.forms.locationLon}
              register={register}
              errors={errors}
              disabled={isSubmitting}
            />
            <TextInput
              label={`${dictionary.forms.companyPhone} `}
              name="company_phone"
              placeholder={dictionary.forms.companyPhone}
              register={register}
              errors={errors}
              disabled={isSubmitting}
            />
            <TextInput
              label={`${dictionary.forms.companyMobile} `}
              name="company_mobile"
              placeholder={dictionary.forms.companyMobile}
              register={register}
              errors={errors}
              disabled={isSubmitting}
            />
            <TextInput
              label={`${dictionary.forms.adminEmail} `}
              name="admin_email"
              placeholder={dictionary.forms.adminEmail}
              register={register}
              errors={errors}
              disabled={isSubmitting}
            />
          </FormSection>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 text-base"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
            ) : (
              dictionary.common.submit
            )}
          </Button>
        </form>
      </ContainerView>
    </div>
  );
}
