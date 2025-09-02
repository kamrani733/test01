'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heading } from '@/components/ui/Heading';
import { useCreateUpdateMutation } from '@/core/hooks/common/useCreateUpdateMutation';
import { useDictionary } from '@/core/hooks/use-dictionary';
import { createMenus, updateMenus } from '@/core/lib/api/account/menus';
import { Menu } from '@/core/models/menu-model';
import { getMenuFormSchema, MenuFormData } from '@/core/schemas/menuSchema';
import { MenuItem } from '@/core/types/menu';

import ContainerView from '../ContainerView';
import DragDropMenuBuilder from '../DragDropMenuBuilder';
import TextareaInput from '../input/TextareaInput';
import TextInput from '../input/TextInput';

interface CreateEditMenuFormProps {
  defaultValue?: Partial<Menu>;
}

export default function CreateEditMenuForm({
  defaultValue,
}: CreateEditMenuFormProps) {
  const router = useRouter();
  const { dictionary } = useDictionary();
  const isEditSession = Boolean(defaultValue);

  const menuFormSchema = getMenuFormSchema(dictionary);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    if (defaultValue?.items && defaultValue.items.length > 0) {
      setMenuItems(defaultValue.items);
    }
  }, [defaultValue]);

  const {
    register,
    handleSubmit,
    control,
    getValues,
    watch,
    setValue,
    formState: { errors },
    setError,
  } = useForm<MenuFormData>({
    defaultValues: {
      title: defaultValue?.title || '',
      name: defaultValue?.name || '',
      description: defaultValue?.description || '',
    },
    resolver: zodResolver(menuFormSchema),
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: Menu) => {
      return createMenus(data);
    },
    onSuccess: data => {
      if (data.status === 'validation_error') {
        const errorMessage = data.message || 'Validation error';
        toast.error(errorMessage);
      } else {
        toast.success(data.message || 'Menu created successfully!');
        queryClient.invalidateQueries({ queryKey: ['menus'] });
        router.push('/admin/menus');
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || 'Failed to create menu';
      toast.error(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Menu) => {
      return updateMenus(data, defaultValue?.id as number);
    },
    onSuccess: data => {
      if (data.status === 'validation_error') {
        const errorMessage = data.message || 'Validation error';
        toast.error(errorMessage);
      } else {
        toast.success(data.message || 'Menu updated successfully!');
        queryClient.invalidateQueries({ queryKey: ['menus'] });
        router.push('/admin/menus');
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || 'Failed to update menu';
      toast.error(errorMessage);
    },
  });

  // Auto-save mutation (no redirect)
  const autoSaveMutation = useMutation({
    mutationFn: (data: Menu) => {
      return updateMenus(data, defaultValue?.id as number);
    },
    onSuccess: data => {
      if (data.status === 'validation_error') {
        const errorMessage = data.message || 'Validation error';
        toast.error(errorMessage);
      } else {
        // Show a subtle success toast for auto-save
        toast.success(data.message || 'Menu auto-saved', {
          duration: 2000,
          position: 'bottom-right',
        });
        queryClient.invalidateQueries({ queryKey: ['menus'] });
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || 'Failed to auto-save menu';
      toast.error(errorMessage);
    },
  });

  const handleAutoSave = (items: MenuItem[]) => {
    if (!isEditSession || !defaultValue?.id) return;

    const formData = getValues();
    const watchedValues = watch();

    const menuData: Partial<Menu> = {
      title: formData.title,
      name: formData.name,
      description: watchedValues.description || formData.description || '',
      items: items,
    };

    autoSaveMutation.mutate(menuData as Menu);
  };

  const onSubmit = (data: MenuFormData) => {
    if (!data.title.trim()) {
      setError('title', { type: 'manual', message: 'Title is required' });
      return;
    }

    if (!data.name.trim()) {
      setError('name', { type: 'manual', message: 'Menu code is required' });
      return;
    }

    const menuData: Partial<Menu> = {
      title: data.title,
      name: data.name,
      description: data.description || '',
      items: menuItems,
    };

    console.log('🔍 FORMmmmmmmmmmmmm', {
      menuData,
    });

    if (isEditSession) {
      updateMutation.mutate(menuData as Menu);
    } else {
      createMutation.mutate(menuData as Menu);
    }
  };

  const isPending = isEditSession
    ? updateMutation.isPending
    : createMutation.isPending;

  return (
    <div className="space-y-4 w-full">
      <Heading level={3}>
        {isEditSession
          ? dictionary.common.edit + ' ' + dictionary.nav.menu
          : dictionary.common.add + ' ' + dictionary.nav.menu}
      </Heading>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Main Info Section */}
        <Card>
          <CardHeader>
            <CardTitle>{dictionary.ui.form.mainInfo}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TextInput
              label={dictionary.forms.title}
              name="title"
              placeholder={dictionary.forms.title}
              register={register}
              errors={errors}
            />

            <TextInput
              label={dictionary.forms.name || 'Menu Code'}
              name="name"
              placeholder={dictionary.forms.name || 'Enter menu code'}
              register={register}
              errors={errors}
            />

            <TextareaInput
              label={dictionary.forms.description}
              name="description"
              placeholder={dictionary.forms.description}
              register={register}
              errors={errors}
            />
          </CardContent>
        </Card>

        {/* Menu Items Section */}
        <Card>
          <CardHeader>
            <CardTitle>{dictionary.nav.menu} Items</CardTitle>
          </CardHeader>
          <CardContent>
            <DragDropMenuBuilder
              items={menuItems}
              onChange={setMenuItems}
              onAutoSave={handleAutoSave}
              menuId={defaultValue?.id}
              menuTitle={defaultValue?.title}
              isAutoSaving={autoSaveMutation.isPending}
            />
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" disabled={isPending} className="flex-1">
            {isPending && <Loader2 className="text-base h-11 animate-spin" />}
            {isEditSession ? dictionary.common.save : dictionary.common.add}
          </Button>
        </div>
      </form>
    </div>
  );
}
