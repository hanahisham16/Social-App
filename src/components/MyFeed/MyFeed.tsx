import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";

import PostCard from "../../components/PostCard/PostCard";
import type { PostCardI } from "../../types/postCard.types";
import CreatePost from "../PostCard/CreatePost";
import { getMyFeed } from "../../services/feed.service";
import PostSkeleton from "../PostCard/PostSkeleton";

interface Pagination {
  currentPage: number;
  limit: number;
  total: number;
  numberOfPages: number;
}

export default function MyFeed() {
  const [posts, setPosts] = useState<PostCardI[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchMyFeed = useCallback(async (page = 1, loadMore = false) => {
    try {
      if (loadMore) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      const { data } = await getMyFeed(page, 10);

      const newPosts: PostCardI[] = data.data.posts;
      const pageInfo: Pagination = data.meta.pagination;

      setPosts((prev) => (loadMore ? [...prev, ...newPosts] : newPosts));

      setPagination(pageInfo);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to load your feed",
        );
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    void fetchMyFeed(1);
  }, [fetchMyFeed]);

  const getAllPost = () => {
    void fetchMyFeed(1);
  };

  const handleLoadMore = () => {
    if (!pagination || isLoadingMore) return;

    if (pagination.currentPage < pagination.numberOfPages) {
      void fetchMyFeed(pagination.currentPage + 1, true);
    }
  };

  return (
    <>
      <CreatePost getAllPost={getAllPost} />{" "}
      <main>
        <div>
          {isLoading ? (
            <PostSkeleton />
          ) : posts.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
              No posts yet. Be the first one to publish.
            </div>
          ) : (
            <div className="space-y-5">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} getAllPost={getAllPost} />
              ))}

              {pagination &&
                pagination.currentPage < pagination.numberOfPages && (
                  <div className="flex justify-center py-3">
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className="flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isLoadingMore && (
                        <Icon
                          icon="lucide:loader-circle"
                          className="animate-spin"
                          width={17}
                          height={17}
                        />
                      )}
                      {isLoadingMore ? "Loading..." : "View more posts"}
                    </button>
                  </div>
                )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
