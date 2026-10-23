import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { LikeComment } from "../../services/comments.service";

type LikeCommentButtonProps = {
  postId: string;
  commentId: string;
  initialLikes: number;
  initiallyLiked?: boolean;
  onLikeChange?: (isLiked: boolean) => void;
  onLikesCountChange?: (count: number) => void;
};

export default function LikeCommentButton({
  postId,
  commentId,
  initialLikes,
  initiallyLiked = false,
  onLikeChange,
  onLikesCountChange,
}: LikeCommentButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initiallyLiked);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLikeToggle() {
    if (isLoading) return;

    setIsLoading(true);

    try {
      await LikeComment(postId, commentId);

      const nextIsLiked = !isLiked;
      const nextLikes = likes + (nextIsLiked ? 1 : -1);

      setIsLiked(nextIsLiked);
      setLikes(nextLikes);

      onLikeChange?.(nextIsLiked);
      onLikesCountChange?.(nextLikes);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to update comment like",
        );
      } else {
        toast.error("Failed to update comment like");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      aria-label={isLiked ? "Unlike comment" : "Like comment"}
      aria-pressed={isLiked}
      disabled={isLoading}
      onClick={handleLikeToggle}
      className={`flex cursor-pointer items-center gap-1 text-xs font-semibold transition ${
        isLiked
          ? "text-[#1877f2]"
          : "text-[#65676b] hover:text-[#1877f2]"
      }`}
    >
      Like({likes})
    </button>
  );
}