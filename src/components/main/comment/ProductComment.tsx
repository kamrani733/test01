import { getCommentProductsById } from '@/core/lib/api/main/main-shop-product';

import CommentForm from './CommentForm';
import CommentList from './CommnetList';

interface ProductCommentsProps {
  productId: number;
}

export default async function ProductComments({
  productId,
}: ProductCommentsProps) {
  const comments = await getCommentProductsById(productId);

  return (
    <div className="w-full">
      <CommentList comments={comments} />

      <CommentForm productId={productId} />
    </div>
  );
}
