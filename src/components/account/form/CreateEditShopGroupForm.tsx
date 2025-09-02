'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/Heading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCreateUpdateMutation } from '@/core/hooks/common/useCreateUpdateMutation';
import { useDictionary } from '@/core/hooks/use-dictionary';
import {
  createShopGroup,
  updateShopGroup,
} from '@/core/lib/api/account/shop-groups';
import { ShopGroup } from '@/core/models/shop-group-model';
import {
  getShopGroupFormSchema,
  ShopGroupFormData,
} from '@/core/schemas/shopGroupSchema';

import ContainerView from '../ContainerView';
import FormSection from '../FormSection';
import TextInput from '../input/TextInput';

interface CreateEditShopGroupFormProps {
  defaultValue?: Partial<ShopGroup>;
}

export default function CreateEditShopGroupForm({
  defaultValue,
}: CreateEditShopGroupFormProps) {
  const router = useRouter();
  const isEditSession = Boolean(defaultValue);
  const { dictionary } = useDictionary();
  const shopGroupFormSchema = getShopGroupFormSchema(dictionary);
  const filterDefaultValueWithoutNull = Object.fromEntries(
    Object.entries(defaultValue || {}).filter(([, value]) => value !== null)
  );
  const { id } = filterDefaultValueWithoutNull;
  console.log(defaultValue);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
    setValue,
  } = useForm<ShopGroupFormData>({
    defaultValues: {
      ...filterDefaultValueWithoutNull,
    },
    resolver: zodResolver(shopGroupFormSchema),
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'meta',
  });

  const createMutation = useCreateUpdateMutation<ShopGroupFormData>({
    mutationFn: createShopGroup,
    queryKey: ['shop-groups'],
    operation: 'create',
    setError,
    onSuccess: () => router.push('/admin/shop/groups'),
  });

  const updateMutation = useCreateUpdateMutation<
    ShopGroupFormData & { id: number }
  >({
    mutationFn: data => updateShopGroup(data, data.id),
    queryKey: ['shop-groups'],
    operation: 'update',
    setError,
    onSuccess: () => router.push('/admin/shop/groups'),
  });

  const onSubmit = (data: ShopGroupFormData) => {
    if (isEditSession) {
      updateMutation.mutate({ ...data, id: id as number });
    } else {
      createMutation.mutate(data);
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
            ? dictionary.common.edit + ' ' + dictionary.nav.group
            : dictionary.common.add + ' ' + dictionary.nav.group}
        </Heading>
        <p className="text-primary-600">
          {isEditSession
            ? dictionary.common.editItemDescription
            : dictionary.common.addItemDescription}
        </p>
      </div>
      <ContainerView>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          <FormSection title={dictionary.ui.form.groupInfo}>
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
                  errors={errors}
                />
              </TabsContent>
              <TabsContent value="en">
                <TextInput
                  label={`${dictionary.forms.title} ${dictionary.ui.language.en}`}
                  name="title_en"
                  placeholder={`${dictionary.forms.title} ${dictionary.ui.language.en}`}
                  register={register}
                  errors={errors}
                />
              </TabsContent>
              <TabsContent value="ar">
                <TextInput
                  label={`${dictionary.forms.title} ${dictionary.ui.language.ar}`}
                  name="title_ar"
                  placeholder={`${dictionary.forms.title} ${dictionary.ui.language.ar}`}
                  register={register}
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
                <TextInput
                  label={`${dictionary.forms.description} ${dictionary.ui.language.fa}`}
                  name="description"
                  placeholder={`${dictionary.forms.description} ${dictionary.ui.language.fa}`}
                  register={register}
                  errors={errors}
                />
              </TabsContent>
              <TabsContent value="en">
                <TextInput
                  label={`${dictionary.forms.description} ${dictionary.ui.language.en}`}
                  name="description_en"
                  placeholder={`${dictionary.forms.description} ${dictionary.ui.language.en}`}
                  register={register}
                  errors={errors}
                />
              </TabsContent>
              <TabsContent value="ar">
                <TextInput
                  label={`${dictionary.forms.description} ${dictionary.ui.language.ar}`}
                  name="description_ar"
                  placeholder={`${dictionary.forms.description} ${dictionary.ui.language.ar}`}
                  register={register}
                  errors={errors}
                />
              </TabsContent>
            </Tabs>
          </FormSection>

          {/* Shop Group Items */}
          {fields.map((field, index) => (
            <FormSection
              key={field.id}
              title={`${dictionary.ui.form.metaItem} ${index + 1}`}
              index={index}
              fieldsLength={fields.length}
              move={move}
              setValue={setValue} 
              onRemove={() => remove(index)}
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
                    name={`meta.${index}.title`}
                    placeholder={`${dictionary.forms.title} ${dictionary.ui.language.fa}`}
                    register={register}
                    errors={errors?.meta?.[index]}
                  />
                </TabsContent>
                <TabsContent value="en">
                  <TextInput
                    label={`${dictionary.forms.title} ${dictionary.ui.language.en}`}
                    name={`meta.${index}.title_en`}
                    placeholder={`${dictionary.forms.title} ${dictionary.ui.language.en}`}
                    register={register}
                    errors={errors?.meta?.[index]}
                  />
                </TabsContent>
                <TabsContent value="ar">
                  <TextInput
                    label={`${dictionary.forms.title} ${dictionary.ui.language.ar}`}
                    name={`meta.${index}.title_ar`}
                    placeholder={`${dictionary.forms.title} ${dictionary.ui.language.ar}`}
                    register={register}
                    errors={errors?.meta?.[index]}
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
                    label={`${dictionary.forms.description} ${dictionary.ui.language.fa}`}
                    name={`meta.${index}.description`}
                    placeholder={`${dictionary.forms.description} ${dictionary.ui.language.fa}`}
                    register={register}
                    errors={errors?.meta?.[index]}
                  />
                </TabsContent>
                <TabsContent value="en">
                  <TextInput
                    label={`${dictionary.forms.description} ${dictionary.ui.language.en}`}
                    name={`meta.${index}.en_description`}
                    placeholder={`${dictionary.forms.description} ${dictionary.ui.language.en}`}
                    register={register}
                    errors={errors?.meta?.[index]}
                  />
                </TabsContent>
                <TabsContent value="ar">
                  <TextInput
                    label={`${dictionary.forms.description} ${dictionary.ui.language.ar}`}
                    name={`meta.${index}.ar_description`}
                    placeholder={`${dictionary.forms.description} ${dictionary.ui.language.ar}`}
                    register={register}
                    errors={errors?.meta?.[index]}
                  />
                </TabsContent>
              </Tabs>
              <TextInput
                label={`${dictionary.forms.name}`}
                name={`meta.${index}.name`}
                placeholder={dictionary.forms.name}
                register={register}
                errors={errors?.meta?.[index]}
                disabled={isPending}
              />
              <input type="hidden" {...register(`meta.${index}.priority`)} />
            </FormSection>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              append({
                name: '',
                title: '',
                priority: fields.length + 1,
              });
            }}
            disabled={isPending}
          >
            <Plus className="h-4 w-4" />
            {dictionary.ui.form.metaAdd}
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
