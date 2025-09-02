import React from 'react';

import { CommentItem as CommentType } from '@/core/types/comments';

interface CommentItemProps {
  comment: CommentType;
}

export default function CommentItem({ comment }: CommentItemProps) {
  return (
    <li className="border rounded-md p-4 bg-white border-primary-300">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-700 font-semibold">
          {comment.author_name}
        </div>
        <div className="text-xs text-gray-500">
          {comment.created_at_jalali ??
            new Date(comment.created_at).toLocaleString()}
        </div>
      </div>
      {comment.subject ? (
        <div className="text-sm font-medium mb-1">{comment.subject}</div>
      ) : null}
      <p className="text-sm text-gray-700">{comment.content}</p>
    </li>
  );
}
