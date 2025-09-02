'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/Heading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCreateUpdateMutation } from '@/core/hooks/common/useCreateUpdateMutation';
import { useDictionary } from '@/core/hooks/use-dictionary';
import { createSlider, updateSlider } from '@/core/lib/api/account/sliders';
import {
  getSliderFormSchema,
  SliderFormData,
} from '@/core/schemas/sliderSchema';

import ContainerView from '../ContainerView';
import FormSection from '../FormSection';
import FileUploadInput from '../input/FileUploadInput';
import TextareaInput from '../input/TextareaInput';
import TextInput from '../input/TextInput';

interface SliderItemImage {
  id: number;
  url?: string;
  name?: string;
}
interface SliderItem {
  id?: number;
  title: string;
  title_en?: string;
  title_ar?: string;
  description?: string;
  description_en?: string;
  description_ar?: string;
  link?: string;
  buttonContent?: string;
  priority: number;
  image?: number;
  image_info?: SliderItemImage;
}
interface Slider {
  id?: number;
  name: string;
  title?: string;
  title_en?: string;
  title_ar?: string;
  description?: string;
  description_en?: string;
  description_ar?: string;
  items?: SliderItem[];
}

interface CreateEditSliderFormProps {
  defaultValue?: Partial<Slider>;
}

export default function CreateEditSliderForm({
  defaultValue,
}: CreateEditSliderFormProps) {
  const router = useRouter();
  const isEditSession = Boolean(defaultValue?.id);
  const { dictionary } = useDictionary();
  const sliderFormSchema = getSliderFormSchema(dictionary);

  const clean = Object.fromEntries(
    Object.entries(defaultValue || {}).filter(([, v]) => v != null)
  );

  const [itemImageIds, setItemImageIds] = useState<(number | null)[]>(
    defaultValue?.items?.map(i => i.image || null) || []
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
    setValue,
  } = useForm<SliderFormData>({
    defaultValues: {
      name: '',
      title: '',
      title_en: '',
      title_ar: '',
      description: '',
      description_en: '',
      description_ar: '',
      items: [{ title: '', image: 0, priority: 1 }],
      ...clean,
    },
    resolver: zodResolver(sliderFormSchema),
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'items',
  });

  const createMutation = useCreateUpdateMutation<SliderFormData>({
    mutationFn: createSlider,
    queryKey: ['sliders'],
    operation: 'create',
    setError,
    onSuccess: () => {
      router.push('/admin/sliders');
    },
  });

  const updateMutation = useCreateUpdateMutation<
    SliderFormData & { id: number }
  >({
    mutationFn: data => updateSlider(data, data.id),
    queryKey: ['sliders'],
    operation: 'update',
    setError,
    onSuccess: () => {
      router.push('/admin/sliders');
    },
  });

  const onSubmit = (data: SliderFormData) => {
    const payload = {
      ...data,
      items: data.items.map((item, idx) => ({
        ...item,
        image: itemImageIds[idx] ?? item.image,
      })),
    };

    if (isEditSession) {
      updateMutation.mutate({ ...payload, id: defaultValue!.id as number });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isPending = isEditSession
    ? updateMutation.isPending
    : createMutation.isPending;

  return (
    <div className="space-y-4 w-full">
      <div className="space-y-2">
        <Heading level={3}>
          {isEditSession
            ? dictionary.common.edit + ' ' + dictionary.nav.slider
            : dictionary.common.add + ' ' + dictionary.nav.slider}
        </Heading>
        <p className="text-primary-600">
          {isEditSession
            ? dictionary.common.editItemDescription
            : dictionary.common.addItemDescription}
        </p>
      </div>
      <ContainerView>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          <FormSection title={dictionary.ui.form.sliderInfo}>
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
                  label={`${dictionary.forms.title} ${dictionary.ui.language.fa}`}
                  name="title"
                  placeholder={`${dictionary.forms.title} ${dictionary.ui.language.fa}`}
                  register={register}
                  disabled={isPending}
                  errors={errors}
                />
              </TabsContent>
              <TabsContent value="en">
                <TextInput
                  label={`${dictionary.forms.title} ${dictionary.ui.language.en}`}
                  name="title_en"
                  placeholder={`${dictionary.forms.title} ${dictionary.ui.language.en}`}
                  register={register}
                  disabled={isPending}
                  errors={errors}
                />
              </TabsContent>
              <TabsContent value="ar">
                <TextInput
                  label={`${dictionary.forms.title} ${dictionary.ui.language.ar}`}
                  name="title_ar"
                  placeholder={`${dictionary.forms.title} ${dictionary.ui.language.ar}`}
                  register={register}
                  disabled={isPending}
                  errors={errors}
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
                  label={`${dictionary.forms.description} ${dictionary.ui.language.fa}`}
                  name="description"
                  placeholder={`${dictionary.forms.description} ${dictionary.ui.language.fa}`}
                  register={register}
                  disabled={isPending}
                  errors={errors}
                />
              </TabsContent>
              <TabsContent value="en">
                <TextareaInput
                  label={`${dictionary.forms.description} ${dictionary.ui.language.en}`}
                  name="description_en"
                  placeholder={`${dictionary.forms.description} ${dictionary.ui.language.en}`}
                  register={register}
                  disabled={isPending}
                  errors={errors}
                />
              </TabsContent>
              <TabsContent value="ar">
                <TextareaInput
                  label={`${dictionary.forms.description} ${dictionary.ui.language.ar}`}
                  name="description_ar"
                  placeholder={`${dictionary.forms.description} ${dictionary.ui.language.ar}`}
                  register={register}
                  disabled={isPending}
                  errors={errors}
                />
              </TabsContent>
            </Tabs>
            <TextInput
              label={`${dictionary.forms.name} `}
              name="name"
              register={register}
              disabled={isPending}
              errors={errors}
              placeholder={dictionary.forms.name}
            />
          </FormSection>

          {/* Slider Items */}
          {fields.map((field, index) => (
            <FormSection
              key={field.id}
              title={`${dictionary.ui.form.sliderItem} ${index + 1}`}
              index={index}
              fieldsLength={fields.length}
              move={move}
              setItemImageIds={setItemImageIds}
              setValue={setValue}
              defaultItems={defaultValue?.items} // ← اضافه شده
              onRemove={fields.length > 1 ? () => remove(index) : undefined}
            >
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
                    label={`${dictionary.forms.title} ${dictionary.ui.language.fa}`}
                    name={`items.${index}.title`}
                    placeholder={`${dictionary.forms.title} ${dictionary.ui.language.fa}`}
                    register={register}
                    disabled={isPending}
                    errors={errors}
                  />
                </TabsContent>
                <TabsContent value="en">
                  <TextInput
                    label={`${dictionary.forms.title} ${dictionary.ui.language.en}`}
                    name={`items.${index}.title_en`}
                    placeholder={`${dictionary.forms.title} ${dictionary.ui.language.en}`}
                    register={register}
                    disabled={isPending}
                    errors={errors}
                  />
                </TabsContent>
                <TabsContent value="ar">
                  <TextInput
                    label={`${dictionary.forms.title} ${dictionary.ui.language.ar}`}
                    name={`items.${index}.title_ar`}
                    placeholder={`${dictionary.forms.title} ${dictionary.ui.language.ar}`}
                    register={register}
                    disabled={isPending}
                    errors={errors}
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
                    label={`${dictionary.forms.description} ${dictionary.ui.language.fa}`}
                    name={`items.${index}.description`}
                    placeholder={`${dictionary.forms.description} ${dictionary.ui.language.fa}`}
                    register={register}
                    disabled={isPending}
                    errors={errors}
                  />
                </TabsContent>
                <TabsContent value="en">
                  <TextareaInput
                    label={`${dictionary.forms.description} ${dictionary.ui.language.en}`}
                    name={`items.${index}.description_en`}
                    placeholder={`${dictionary.forms.description} ${dictionary.ui.language.en}`}
                    register={register}
                    disabled={isPending}
                    errors={errors}
                  />
                </TabsContent>
                <TabsContent value="ar">
                  <TextareaInput
                    label={`${dictionary.forms.description} ${dictionary.ui.language.ar}`}
                    name={`items.${index}.description_ar`}
                    placeholder={`${dictionary.forms.description} ${dictionary.ui.language.ar}`}
                    register={register}
                    disabled={isPending}
                    errors={errors}
                  />
                </TabsContent>
              </Tabs>
              <TextInput
                label={`${dictionary.forms.link}`}
                name={`items.${index}.link`}
                register={register}
                disabled={isPending}
                errors={errors?.items?.[index]}
                placeholder={dictionary.forms.link}
              />
              <TextInput
                label={`${dictionary.forms.buttonContent}`}
                name={`items.${index}.buttonContent`}
                register={register}
                disabled={isPending}
                errors={errors?.items?.[index]}
                placeholder={dictionary.forms.buttonContent}
              />
              <input type="hidden" {...register(`items.${index}.priority`)} />
              <FileUploadInput
                accept="image/*,video/*"
                disabled={isPending}
                onUploadSuccess={image => {
                  const imageId = image?.id ? Number(image.id) : null;
                  setItemImageIds(prev => {
                    const newIds = [...prev];
                    newIds[index] = imageId;
                    return newIds;
                  });
                  setValue(`items.${index}.image`, imageId as number);
                }}
                error={errors?.items?.[index]?.image?.message}
                defaultImageUrl={defaultValue?.items?.[index]?.image_info?.url}
                defaultImageName={
                  defaultValue?.items?.[index]?.image_info?.name
                }
              />
            </FormSection>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              append({
                title: '',
                image: 0,
                priority: fields.length + 1,
              });
              setItemImageIds(prev => [...prev, null]);
            }}
            disabled={isPending}
          >
            <Plus className="h-4 w-4" />
            {dictionary.ui.form.sliderAdd}
          </Button>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-11 text-base"
          >
            {isPending ? (
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
