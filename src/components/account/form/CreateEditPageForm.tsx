'use client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useDictionary } from '@/core/hooks/use-dictionary';
import { Heading } from '@/components/ui/Heading';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TextInput from '../input/TextInput';
import SelectField from '../input/SelectField';
import { useRouter } from 'next/navigation';
import ContainerView from '../ContainerView';
import { createPage, updatePage } from '@/core/lib/api/account/pages';
import { getPageFormSchema, PageFormData } from '@/core/schemas/pageSchema';
import { Page } from '@/core/models/page-model';
import { generateSlug } from '@/utils/generateSlug';
import { useEffect } from 'react';
import EditorPage from '../EditorPage';
import TextareaInput from '../input/TextareaInput';
import { getOptions } from '@/constants/options';
import { useCreateUpdateMutation } from '@/core/hooks/common/useCreateUpdateMutation';

interface CreateEditPageFormProps {
  defaultValue?: Partial<Page>;
}

export default function CreateEditPageForm({
  defaultValue,
}: CreateEditPageFormProps) {
  const router = useRouter();
  const { dictionary } = useDictionary();
  const isEditSession = Boolean(defaultValue);
  const pageFormSchema = getPageFormSchema(dictionary);
  const { STATUS_OPTIONS_PAGE } = getOptions(dictionary);
  console.log(defaultValue);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    setError,
  } = useForm<PageFormData>({
    defaultValues: {
      ...defaultValue,
      content: defaultValue?.content ?? '',
    },
    resolver: zodResolver(pageFormSchema),
  });

  const getLabelOrPlaceholder = (field: string, lang: string): string => {
    const baseField = field.replace(/_en|_ar/, '');
    const baseLabel =
      dictionary.forms[baseField as keyof typeof dictionary.forms] ?? baseField;
    const langLabel =
      dictionary.ui.language[lang as keyof typeof dictionary.ui.language] ??
      lang;
    return `${baseLabel} ${langLabel}`;
  };
  const watchedTitleFa = watch('title');
  useEffect(() => {
    if (!isEditSession && watchedTitleFa) {
      setValue('slug', generateSlug(watchedTitleFa));
    }
  }, [watchedTitleFa, isEditSession, setValue]);

  const createMutation = useCreateUpdateMutation<PageFormData>({
    mutationFn: data => createPage(data),
    queryKey: ['pages'],
    operation: 'create',
    setError,
    onSuccess: () => {
      router.push('/admin/pages');
    },
  });

  const updateMutation = useCreateUpdateMutation<PageFormData & { id: number }>(
    {
      mutationFn: data => updatePage(data, defaultValue?.id as number),
      queryKey: ['pages'],
      operation: 'update',
      setError,
      onSuccess: () => {
        router.push('/admin/pages');
      },
    }
  );

  const onSubmit = (data: PageFormData) => {
    console.log(data);

    if (isEditSession) {
      updateMutation.mutate({ ...data, id: defaultValue?.id as number });
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = isEditSession
    ? updateMutation.isPending
    : createMutation.isPending;

  return (
    <div className="space-y-4 w-full">
      <Heading level={3}>
        {isEditSession
          ? `${dictionary.common.edit} ${dictionary.nav.page}`
          : `${dictionary.common.add} ${dictionary.nav.page}`}
      </Heading>
      <p className="text-primary-600">
        {isEditSession
          ? dictionary.common.editItemDescription
          : dictionary.common.addItemDescription}
      </p>
      <ContainerView>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          {/* Multilingual Title Fields */}
          <Tabs defaultValue="fa" className="w-full">
            <TabsList className="border border-muted bg-primary-0">
              <TabsTrigger value="fa" className="data-[state=active]:bg-muted">
                {dictionary.ui.language.fa}
              </TabsTrigger>
              <TabsTrigger value="en" className="data-[state=active]:bg-muted">
                {dictionary.ui.language.en}
              </TabsTrigger>
              <TabsTrigger value="ar" className="data-[state=active]:bg-muted">
                {dictionary.ui.language.ar}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="fa">
              <TextInput
                label={getLabelOrPlaceholder('title', 'fa')}
                name="title"
                placeholder={getLabelOrPlaceholder('title', 'fa')}
                register={register}
                errors={errors}
                disabled={isPending}
              />
            </TabsContent>
            <TabsContent value="en">
              <TextInput
                label={getLabelOrPlaceholder('title_en', 'en')}
                name="title_en"
                placeholder={getLabelOrPlaceholder('title_en', 'en')}
                register={register}
                errors={errors}
                disabled={isPending}
              />
            </TabsContent>
            <TabsContent value="ar">
              <TextInput
                label={getLabelOrPlaceholder('title_ar', 'ar')}
                name="title_ar"
                placeholder={getLabelOrPlaceholder('title_ar', 'ar')}
                register={register}
                errors={errors}
                disabled={isPending}
              />
            </TabsContent>
          </Tabs>

          {/* Slug */}
          <TextInput
            label={dictionary.forms.slug}
            name="slug"
            placeholder={dictionary.forms.slug}
            register={register}
            errors={errors}
            disabled={isPending}
          />

          {/* Status */}
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <SelectField
                label={dictionary.forms.status}
                defaultValue="draft"
                value={field.value || ''}
                onValueChange={field.onChange}
                options={STATUS_OPTIONS_PAGE}
                placeholder={dictionary.forms.status}
                disabled={isPending}
                error={errors.status?.message}
              />
            )}
          />

          {/* Multilingual Excerpt Fields */}
          <Tabs defaultValue="fa" className="w-full">
            <TabsList className="border border-muted bg-primary-0">
              <TabsTrigger value="fa" className="data-[state=active]:bg-muted">
                {dictionary.ui.language.fa}
              </TabsTrigger>
              <TabsTrigger value="en" className="data-[state=active]:bg-muted">
                {dictionary.ui.language.en}
              </TabsTrigger>
              <TabsTrigger value="ar" className="data-[state=active]:bg-muted">
                {dictionary.ui.language.ar}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="fa">
              <TextareaInput
                label={getLabelOrPlaceholder('excerpt', 'fa')}
                name="excerpt"
                placeholder={getLabelOrPlaceholder('excerpt', 'fa')}
                register={register}
                errors={errors}
                disabled={isPending}
              />
            </TabsContent>
            <TabsContent value="en">
              <TextareaInput
                label={getLabelOrPlaceholder('excerpt_en', 'en')}
                name="excerpt_en"
                placeholder={getLabelOrPlaceholder('excerpt_en', 'en')}
                register={register}
                errors={errors}
                disabled={isPending}
              />
            </TabsContent>
            <TabsContent value="ar">
              <TextareaInput
                label={getLabelOrPlaceholder('excerpt_ar', 'ar')}
                name="excerpt_ar"
                placeholder={getLabelOrPlaceholder('excerpt_ar', 'ar')}
                register={register}
                errors={errors}
                disabled={isPending}
              />
            </TabsContent>
          </Tabs>

          {/* Multilingual Content Fields with TinyMCE */}
          <Tabs defaultValue="fa" className="w-full">
            <TabsList className="border border-muted bg-primary-0">
              <TabsTrigger value="fa" className="data-[state=active]:bg-muted">
                {dictionary.ui.language.fa}
              </TabsTrigger>
              <TabsTrigger value="en" className="data-[state=active]:bg-muted">
                {dictionary.ui.language.en}
              </TabsTrigger>
              <TabsTrigger value="ar" className="data-[state=active]:bg-muted">
                {dictionary.ui.language.ar}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="fa">
              <Controller
                control={control}
                name="content"
                render={({ field }) => (
                  <EditorPage
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.content?.message}
                  />
                )}
              />
            </TabsContent>
            <TabsContent value="en">
              <Controller
                control={control}
                name="content_en"
                render={({ field }) => (
                  <EditorPage
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.content_en?.message}
                  />
                )}
              />
            </TabsContent>
            <TabsContent value="ar">
              <Controller
                control={control}
                name="content_ar"
                render={({ field }) => (
                  <EditorPage
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.content_en?.message}
                  />
                )}
              />
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
