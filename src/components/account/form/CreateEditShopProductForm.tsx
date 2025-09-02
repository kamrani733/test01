'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { Heading } from '@/components/ui/Heading';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SearchableCombobox } from '@/components/ui/SearchableCombobox';
import MultipleSelector from '@/components/ui/MultipleSelector';
type FormOption = {
  value: string | number;
  label: string;
  [key: string]: any;
};
import ContainerView from '../ContainerView';
import FormSection from '../FormSection';
import TextInput from '../input/TextInput';
import FileUploadInput from '../input/MultipleFileUploadInput';
import { useDictionary } from '@/core/hooks/use-dictionary';
import { useRouter } from 'next/navigation';
import { getMetaFieldsByGroupId } from '@/core/lib/api/account/shop-groups';
import {
  createShopProduct,
  updateShopProduct,
} from '@/core/lib/api/account/shop-products';
import {
  getShopProductFormSchema,
  ShopProductFormData,
} from '@/core/schemas/shopProductSchema';
import { ShopProduct } from '@/core/models/shop-product-model';
import { ImageTs } from '@/core/types/imageTs';
import { useCreateUpdateMutation } from '@/core/hooks/common/useCreateUpdateMutation';

import { List } from '@/components/ui/SearchableCombobox';

interface ShopProductPayload {
  categories: number[];
  tags: (string | number)[];
  related_products: number[];
  thumbnail?: number | null;
  images?: number[];
  color_id?: number | null;
  [key: string]: any;
}

interface FormSelectOption {
  value: string | number;
  label: string;
  [key: string]: any;
}

type ErrorHandler = (
  name: string | number,
  error: { type: string; message: string }
) => void;

interface CreateEditShopProductFormProps {
  defaultValue?: Partial<ShopProduct>;
  shopProductsList: FormSelectOption[];
  shopTagsList: FormSelectOption[];
  shopGroupsList: List<number>[];
  shopCategoriesList: FormSelectOption[];
  shopColorList: List<string | number>[];
}

export default function CreateEditShopProductForm({
  defaultValue,
  shopProductsList,
  shopTagsList,
  shopGroupsList,
  shopCategoriesList,
  shopColorList,
}: CreateEditShopProductFormProps) {
  const { dictionary } = useDictionary();
  const router = useRouter();
  const isEditSession = Boolean(defaultValue);

  // Image States
  const [currentThumbnailId, setCurrentThumbnailId] = useState<number | null>(
    defaultValue?.thumbnail?.id || null
  );
  const [currentDefaultThumbnail, setCurrentDefaultThumbnail] =
    useState<ImageTs | null>(defaultValue?.thumbnail || null);
  const [currentImageIds, setCurrentImageIds] = useState<number[]>(
    defaultValue?.images?.map(img => img.id) || []
  );
  const [currentDefaultImages, setCurrentDefaultImages] = useState<ImageTs[]>(
    defaultValue?.images || []
  );

  // Meta Fields State
  const [metaFields, setMetaFields] = useState<any[]>([]);
  const [isFetchingMetaFields, setIsFetchingMetaFields] = useState(false);

  // Form Setup
  const shopProductFormSchema = getShopProductFormSchema(dictionary);
  const filterDefaultValueWithoutNull = Object.fromEntries(
    Object.entries(defaultValue || {}).filter(([, value]) => value !== null)
  );

  const getMetaFieldDefaultValues = useCallback(() => {
    const metaFieldValues: Record<string, string> = {};
    const metaFieldsArray = Array.isArray(defaultValue?.meta_fields)
      ? defaultValue.meta_fields
      : [];

    metaFieldsArray.forEach((field: Partial<ShopProduct>) => {
      const baseKey = Object.keys(field).find(
        key =>
          ![
            'title',
            'title_en',
            'title_ar',
            'description',
            'description_en',
            'description_ar',
            'priority',
          ].includes(key)
      );
      if (baseKey) {
        metaFieldValues[baseKey] = String(field[baseKey] ?? '');
        metaFieldValues[`${baseKey}_en`] = String(field[`${baseKey}_en`] ?? '');
        metaFieldValues[`${baseKey}_ar`] = String(field[`${baseKey}_ar`] ?? '');
      }
    });
    return metaFieldValues;
  }, [defaultValue?.meta_fields]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
    setValue,
    unregister,
    getValues,
  } = useForm<ShopProductFormData>({
    defaultValues: {
      ...filterDefaultValueWithoutNull,
      ...getMetaFieldDefaultValues(),
      tags: defaultValue?.tags || [],
      categories: defaultValue?.categories || [],
      related_products: defaultValue?.related_products || [],
    },
    resolver: zodResolver(shopProductFormSchema),
  });

  // Mutations
  const createMutation = useCreateUpdateMutation<ShopProductFormData>({
    mutationFn: (data: ShopProductFormData) => {
      const payload: ShopProductPayload = {
        ...data,
        categories: Array.isArray(data.categories)
          ? data.categories.map(c => Number(c.value))
          : [],
        tags: Array.isArray(data.tags) ? data.tags.map(t => t.value) : [],
        related_products: Array.isArray(data.related_products)
          ? data.related_products.map(r => Number(r.value))
          : [],
      };
      return createShopProduct(payload);
    },
    queryKey: ['shop-products'],
    operation: 'create',
    setError: setError as ErrorHandler,
    onSuccess: () => router.push('/admin/shop/products'),
  });

  const updateMutation = useCreateUpdateMutation<
    ShopProductFormData & { id: number }
  >({
    mutationFn: (data: ShopProductFormData & { id: number }) => {
      const payload: ShopProductPayload = {
        ...data,
        categories: Array.isArray(data.categories)
          ? data.categories.map(c => Number(c.value))
          : [],
        tags: Array.isArray(data.tags) ? data.tags.map(t => t.value) : [],
        related_products: Array.isArray(data.related_products)
          ? data.related_products.map(r => Number(r.value))
          : [],
      };
      return updateShopProduct(payload, data.id);
    },
    queryKey: ['shop-products'],
    operation: 'update',
    setError: setError as ErrorHandler,
    onSuccess: () => router.push('/admin/shop/products'),
  });

  // Meta Fields Logic
  const fixedKeys = [
    'title',
    'title_en',
    'title_ar',
    'description',
    'description_en',
    'description_ar',
    'priority',
  ];
  const getBaseKey = (field: any) =>
    Object.keys(field).find(key => !fixedKeys.includes(key));

  const loadMetaFields = useCallback(
    async (groupId: number | undefined) => {
      if (groupId === undefined) {
        setMetaFields([]);
        return;
      }
      setIsFetchingMetaFields(true);
      try {
        const data = await getMetaFieldsByGroupId(groupId);
        const newMetaFields = data.data || [];
        const newBaseKeys = new Set(
          newMetaFields.map((f: any) => getBaseKey(f))
        );

        // Unregister old meta fields
        metaFields.forEach((field: any) => {
          const baseKey = getBaseKey(field);
          if (baseKey && !newBaseKeys.has(baseKey)) {
            unregister(baseKey);
            unregister(`${baseKey}_en`);
            unregister(`${baseKey}_ar`);
          }
        });

        setMetaFields(newMetaFields);
        newMetaFields.forEach((field: any) => {
          const baseKey = getBaseKey(field);
          if (baseKey) {
            setValue(baseKey, getValues(baseKey) ?? '');
            setValue(`${baseKey}_en`, getValues(`${baseKey}_en`) ?? '');
            setValue(`${baseKey}_ar`, getValues(`${baseKey}_ar`) ?? '');
          }
        });
      } catch (err) {
        console.error(err);
        setMetaFields([]);
      } finally {
        setIsFetchingMetaFields(false);
      }
    },
    [metaFields, getValues, setValue, unregister]
  );

  useEffect(() => {
    if (isEditSession && defaultValue?.group_id !== undefined) {
      loadMetaFields(Number(defaultValue.group_id));
    }
  }, [isEditSession, defaultValue?.group_id, loadMetaFields]);

  // Form Fields Configuration
  const multilingualFields = ['title', 'description', 'content'];
  const nonMultilingualFields = [
    'code',
    'price',
    'weight',
    'excerpt',
    'fabric_area',
    'fabric_basic_price',
    'overalsize',
  ];
  const statusOptions: FormSelectOption[] = useMemo(
    () =>
      [
        'publish',
        'pending',
        'custom',
        'service',
        'project',
        'semiproduct',
        'cheklistitem',
        'analyze',
        'map',
        'fabric',
      ].map(value => ({
        value,
        label:
          dictionary.ui.status[value as keyof typeof dictionary.ui.status] ||
          value,
      })),
    [dictionary]
  );

  const shopColorListString: FormSelectOption[] = useMemo(
    () => shopColorList.map(item => ({ ...item, value: String(item.value) })),
    [shopColorList]
  );

  const shopGroupsListString: FormSelectOption[] = useMemo(
    () => shopGroupsList.map(item => ({ ...item, value: String(item.value) })),
    [shopGroupsList]
  );

  const getLabel = (field: string, lang?: string): string => {
    const baseField = field.replace(/(_en|_ar)$/, '');
    const baseLabel =
      dictionary.forms[baseField as keyof typeof dictionary.forms] ?? baseField;
    if (lang) {
      const langLabel =
        dictionary.ui.language[lang as keyof typeof dictionary.ui.language] ??
        lang;
      return `${baseLabel} ${langLabel}`;
    }
    return typeof baseLabel === 'string' ? baseLabel : field;
  };

  const getLocalized = (baseKey: string | undefined, lang: string) => {
    if (!baseKey) return { label: '', placeholder: '' };

    const label =
      metaFields.find(item => item[baseKey] !== undefined)?.[
        `title${lang === 'fa' ? '' : `_${lang}`}`
      ] || baseKey;
    const placeholder =
      metaFields.find(item => item[baseKey] !== undefined)?.[
        `description${lang === 'fa' ? '' : `_${lang}`}`
      ] || '';
    return { label, placeholder };
  };

  // Image Handlers
  const handleThumbnailRemove = () => {
    setCurrentThumbnailId(null);
    setCurrentDefaultThumbnail(null);
  };

  const removeImageById = (id: number) => {
    setCurrentImageIds(prev => prev.filter(imgId => imgId !== id));
    setCurrentDefaultImages(prev => prev.filter(img => img.id !== id));
  };

  // Form Submission
  const onSubmit = (data: ShopProductFormData) => {
    const metaFieldsArray = metaFields
      .map((field: ShopProduct) => {
        const baseKey = getBaseKey(field) as string;
        if (!baseKey) return null;
        return {
          [baseKey]: data[baseKey] || '',
          [`${baseKey}_en`]: data[`${baseKey}_en`] || '',
          [`${baseKey}_ar`]: data[`${baseKey}_ar`] || '',
          title: field.title || '',
          title_en: field.title_en || '',
          title_ar: field.title_ar || '',
          description: field.description || '',
          description_en: field.description_en || '',
          description_ar: field.description_ar || '',
          priority: field.priority || 0,
        };
      })
      .filter(Boolean);

    const cleanedData = { ...data };
    metaFields.forEach(field => {
      const baseKey = getBaseKey(field);
      if (baseKey) {
        delete cleanedData[baseKey];
        delete cleanedData[`${baseKey}_en`];
        delete cleanedData[`${baseKey}_ar`];
      }
    });

    const finalData = {
      ...cleanedData,
      thumbnail: currentThumbnailId,
      images: currentImageIds,
      meta_fields: metaFieldsArray,
    };

    if (isEditSession) {
      updateMutation.mutate({ ...finalData, id: defaultValue?.id as number });
    } else {
      createMutation.mutate(finalData);
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
            ? `${dictionary.common.edit} ${dictionary.nav.product}`
            : `${dictionary.common.add} ${dictionary.nav.product}`}
        </Heading>
        <p className="text-primary-600">
          {isEditSession
            ? dictionary.common.editItemDescription
            : dictionary.common.addItemDescription}
        </p>
      </div>

      <ContainerView>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          <Tabs defaultValue="product">
            <TabsList>
              <TabsTrigger value="product">
                {dictionary.ui.form.productInfo}
              </TabsTrigger>
              <TabsTrigger value="metafield" disabled={metaFields.length === 0}>
                {dictionary.ui.form.metaField}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="product" className="space-y-6">
              <FormSection title={dictionary.ui.form.productInfo}>
                {multilingualFields.map(baseField => (
                  <Tabs defaultValue="fa" className="w-full" key={baseField}>
                    <TabsList className="border border-muted bg-primary-0">
                      {['fa', 'en', 'ar'].map(lang => (
                        <TabsTrigger
                          key={lang}
                          value={lang}
                          className="data-[state=active]:bg-muted"
                        >
                          {
                            dictionary.ui.language[
                              lang as keyof typeof dictionary.ui.language
                            ]
                          }
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {['fa', 'en', 'ar'].map(lang => {
                      const fieldName =
                        lang === 'fa' ? baseField : `${baseField}_${lang}`;
                      return (
                        <TabsContent key={lang} value={lang}>
                          <TextInput
                            label={getLabel(fieldName, lang)}
                            name={fieldName}
                            placeholder={getLabel(fieldName, lang)}
                            register={register}
                            errors={errors}
                            disabled={isPending}
                          />
                        </TabsContent>
                      );
                    })}
                  </Tabs>
                ))}

                {nonMultilingualFields.map(field => (
                  <TextInput
                    key={field}
                    label={getLabel(field)}
                    name={field}
                    placeholder={getLabel(field)}
                    register={register}
                    errors={errors}
                    disabled={isPending}
                    type={
                      [
                        'price',
                        'weight',
                        'fabric_area',
                        'fabric_basic_price',
                      ].includes(field)
                        ? 'number'
                        : 'text'
                    }
                  />
                ))}

                <Controller
                  control={control}
                  name="tags"
                  render={({ field }) => (
                    <div className="flex flex-col gap-2">
                      <label className="text-primary-600" htmlFor={field.name}>
                        {dictionary.nav.tag}
                      </label>
                      <MultipleSelector
                        placeholder={dictionary.nav.tag}
                        defaultOptions={shopTagsList.map(v => ({
                          ...v,
                          value: String(v.value),
                        }))}
                        value={(field.value || []).map(v => ({
                          ...v,
                          value: String(v.value),
                        }))}
                        onChange={field.onChange}
                        creatable
                        emptyIndicator={
                          <p className="text-center text-sm leading-10 text-gray-600 dark:text-gray-400">
                            {dictionary.common.noResult}
                          </p>
                        }
                      />
                    </div>
                  )}
                />

                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <SearchableCombobox
                      label={getLabel('status')}
                      value={field.value}
                      onValueChange={value => field.onChange(value)}
                      options={statusOptions}
                      placeholder={getLabel('status')}
                      disabled={isPending}
                      error={errors.status?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="color_id"
                  render={({ field }) => (
                    <SearchableCombobox
                      label={getLabel('color')}
                      value={field.value}
                      onValueChange={value => field.onChange(value)}
                      options={shopColorList}
                      placeholder={getLabel('color')}
                      disabled={isPending}
                      error={errors.color_id?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="group_id"
                  render={({ field }) => (
                    <SearchableCombobox
                      label={getLabel('group_id')}
                      value={field.value}
                      onValueChange={async value => {
                        field.onChange(value);
                        await loadMetaFields(value);
                      }}
                      options={shopGroupsList}
                      placeholder={getLabel('group_id')}
                      disabled={isPending}
                      error={errors.group_id?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="categories"
                  render={({ field }) => (
                    <div className="flex flex-col gap-2">
                      <label className="text-primary-600" htmlFor={field.name}>
                        {dictionary.nav.categories}
                      </label>
                      <MultipleSelector
                        value={(field.value || []).map(v => ({
                          ...v,
                          value: String(v.value),
                        }))}
                        onChange={field.onChange}
                        placeholder={dictionary.nav.categories}
                        defaultOptions={shopCategoriesList.map(v => ({
                          ...v,
                          value: String(v.value),
                        }))}
                        emptyIndicator={
                          <p className="text-center text-sm leading-10 text-gray-600 dark:text-gray-400">
                            {dictionary.common.noResult}
                          </p>
                        }
                      />
                    </div>
                  )}
                />

                <Controller
                  control={control}
                  name="related_products"
                  render={({ field }) => (
                    <div className="flex flex-col gap-2">
                      <label className="text-primary-600" htmlFor={field.name}>
                        {dictionary.forms.related_products}
                      </label>
                      <MultipleSelector
                        value={(field.value || []).map(v => ({
                          ...v,
                          value: String(v.value),
                        }))}
                        onChange={field.onChange}
                        placeholder={dictionary.forms.related_products}
                        defaultOptions={shopProductsList.map(v => ({
                          ...v,
                          value: String(v.value),
                        }))}
                        emptyIndicator={
                          <p className="text-center text-sm leading-10 text-gray-600 dark:text-gray-400">
                            {dictionary.common.noResult}
                          </p>
                        }
                      />
                    </div>
                  )}
                />
              </FormSection>

              <FormSection title={dictionary.ui.form.thumbnail}>
                <FileUploadInput
                  onUploadSuccess={image => {
                    if (!Array.isArray(image) && image) {
                      setCurrentThumbnailId(image.id);
                      setCurrentDefaultThumbnail(image);
                    }
                  }}
                  defaultImages={
                    currentDefaultThumbnail ? [currentDefaultThumbnail] : []
                  }
                  onDefaultRemove={handleThumbnailRemove}
                />
              </FormSection>

              <FormSection title={dictionary.ui.form.galleries}>
                <FileUploadInput
                  multiple
                  onUploadSuccess={images => {
                    if (Array.isArray(images)) {
                      setCurrentImageIds(prev => [
                        ...prev,
                        ...images.map(img => img.id),
                      ]);
                      setCurrentDefaultImages(prev => [...prev, ...images]);
                    }
                  }}
                  defaultImages={currentDefaultImages}
                  onDefaultRemove={removeImageById}
                />
              </FormSection>
            </TabsContent>

            <TabsContent value="metafield" className="space-y-6">
              {metaFields.length > 0 && (
                <FormSection title={dictionary.ui.form.metaField}>
                  {metaFields.map(field => {
                    const baseKey = getBaseKey(field);
                    return (
                      <Tabs defaultValue="fa" className="w-full" key={baseKey}>
                        <TabsList className="border border-muted bg-primary-0">
                          {['fa', 'en', 'ar'].map(lang => (
                            <TabsTrigger
                              key={lang}
                              value={lang}
                              className="data-[state=active]:bg-muted"
                            >
                              {
                                dictionary.ui.language[
                                  lang as keyof typeof dictionary.ui.language
                                ]
                              }
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        {['fa', 'en', 'ar'].map(lang => {
                          const fieldName =
                            lang === 'fa' ? baseKey : `${baseKey}_${lang}`;
                          const { label, placeholder } = getLocalized(
                            baseKey,
                            lang
                          );
                          return (
                            <TabsContent key={lang} value={lang}>
                              <TextInput
                                label={label}
                                name={fieldName}
                                placeholder={placeholder}
                                register={register}
                                errors={errors}
                                disabled={isPending}
                              />
                            </TabsContent>
                          );
                        })}
                      </Tabs>
                    );
                  })}
                </FormSection>
              )}
            </TabsContent>
          </Tabs>

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
