import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import type { PostCardI } from "../../types/postCard.types";
import { getSavedPosts } from "../../services/post.service";
import PostCard from "../../components/PostCard/PostCard";
import CreatePost from "../PostCard/CreatePost";
import PostSkeleton from "../PostCard/PostSkeleton";

export default function SavedPost() {
  const [savedPosts, setSavedPosts] = useState<PostCardI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchSavedPosts() {
    try {
      setIsLoading(true);

      const { data } = await getSavedPosts();
      setSavedPosts(data.data.bookmarks ?? []);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to load saved posts",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  return (<>
    <CreatePost/>
    <section className="space-y-4">
      {isLoading ? (
       <PostSkeleton/>
      ) : savedPosts.length > 0 ? (
        savedPosts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            getAllPost={fetchSavedPosts}
            isSavedPost
          />
        ))
      ) : (
        <p className="rounded-xl bg-white p-5 text-sm text-slate-500 shadow-sm">
          You have no saved posts.
        </p>
      )}
    </section></>
  );
}