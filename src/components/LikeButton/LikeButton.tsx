import { useState } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";
import toast from "react-hot-toast";
import { likePost } from "../../services/post.service";

type LikeButtonProps = {
  postId: string;
  initialLikes: number;
  initiallyLiked?: boolean;
  onLikeChange?: (isLiked: boolean) => void;
  onLikesCountChange?: (count: number) => void;
};

export default function LikeButton({
  postId,
  initialLikes,
  initiallyLiked = false,
  onLikeChange,
  onLikesCountChange,
}: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initiallyLiked);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLikeToggle() {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await likePost(postId);

      const nextIsLiked = !isLiked;
      const nextLikes = likes + (nextIsLiked ? 1 : -1);

      setIsLiked(nextIsLiked);
      setLikes(nextLikes);

      onLikeChange?.(nextIsLiked);
      onLikesCountChange?.(nextLikes);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to update like");
      } else {
        toast.error("Failed to update like");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      aria-label={isLiked ? "Unlike post" : "Like post"}
      aria-pressed={isLiked}
      disabled={isLoading}
      onClick={handleLikeToggle}
      className={`cursor-pointer flex h-10 items-center justify-center gap-2 rounded-md text-sm font-semibold transition disabled:cursor-wait disabled:opacity-60 ${
        isLiked
          ? "text-[#1877f2] bg-[#E7F3FF] hover:bg-[#E7F3FF]"
          : "text-[#65676b] hover:bg-[#f0f2f5]"
      }`}
    >
      <Icon
        icon="lucide:thumbs-up"
        width={18}
        height={18}
        className={isLiked ? "fill-current" : ""}
      />
      Like
    </button>
  );
}
