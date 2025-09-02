'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import Link from 'next/link';

import TextareaInput from '@/components/account/input/TextareaInput';
import CustomButton from '@/components/shared/CustomButton';
import { useAuth } from '@/contexts/authContext';
import { useDictionary } from '@/core/hooks/use-dictionary';
import { postCommentProductById } from '@/core/lib/api/main/main-shop-product';
import {
  CommentFormData,
  getCommentFormSchema,
} from '@/core/schemas/commentSchema';

interface CommentFormProps {
  productId: number;
}

export default function CommentForm({ productId }: CommentFormProps) {
  const {
    state: { isAuthenticated, user },
  } = useAuth();
  const { dictionary } = useDictionary();
  const commentSchema = getCommentFormSchema(dictionary);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = async (data: CommentFormData) => {
    if (!isAuthenticated) {
      return;
    }

    try {
      const result = await postCommentProductById(productId, {
        content: data.content,
      });

      if (result.status === 'success') {
        toast.success(result.message);
        reset();
      } else if (result.status === 'error') {
        const contentError = result.data?.errors?.content;

        setError('content', { type: 'server', message: contentError });
        toast.error(result.message);
      } else {
        toast.error(result.message || dictionary.errors.createError);
      }
    } catch (err: any) {
      console.error(err);
      setError('content', { type: 'server', message: dictionary.common.error });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="my-4 p-4 flex items-center justify-center flex-col bg-[#F5F5F5] rounded-lg">
        <p className="mb-4 text-[#525252]">{dictionary.ui.pages.alertforcomment}</p>
        <CustomButton
          variant="black"
          size="lg"
          className="h-9 px-4 text-base w-fit"
        >
          <Link href="/login">
            {dictionary.forms.login} | {dictionary.forms.signin}
          </Link>
        </CustomButton>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 my-4"
    >
      <TextareaInput
        label={dictionary.forms.content}
        register={register}
        name="content"
        placeholder="نظر خود را بنویسید"
        disabled={isSubmitting}
        errors={errors}
      />
      <CustomButton
        type="submit"
        variant="black"
        disabled={isSubmitting}
        className="w-fit"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {dictionary.common.loading}
          </>
        ) : (
          "ارسال نظر"
        )}
      </CustomButton>
    </form>
  );
}
