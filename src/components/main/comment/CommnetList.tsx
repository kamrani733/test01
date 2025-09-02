'use client';

import { Heading } from '@/components/ui/Heading';
import { useDictionary } from '@/core/hooks/use-dictionary';
import { CommentItem as CommentType } from '@/core/types/comments';

import CommentItem from './CommnetItem';

interface CommentListProps {
  comments: CommentType[];
}

export default function CommentList({ comments }: CommentListProps) {
  const { dictionary } = useDictionary();
  console.log(comments);

  return (
    <div className="w-full">
      <Heading level={2} className="mb-4">
        {dictionary.nav.comments}
      </Heading>
      <ul className="flex flex-col gap-4">
        {comments.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </ul>
    </div>
  );
}
