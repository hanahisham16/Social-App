import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import SuggestedFriends from "../../components/SuggestedFriends/SuggestedFriends";
import { Icon } from "@iconify/react";
import PostCard from "../../components/PostCard/PostCard";
import { getUserFeed } from "../../services/feed.service";
import axios from "axios";
import type { PostCardI } from "../../types/postCard.types";
import PostSkeleton from "../../components/PostCard/PostSkeleton";
import CreatePost from "../../components/PostCard/CreatePost";
import MyFeed from "../../components/MyFeed/MyFeed";
import SavedPost from "../../components/SavedPost/SavedPost";

function Newsfeed() {
  const [page, setPage] = useState(1);
  const [activeLink, setActiveLink] = useState("feed");
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [posts, setPosts] = useState<PostCardI[] | []>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuggestedOpen, setIsSuggestedOpen] = useState<boolean>(false);

  async function getAllPost() {
    try {
      setIsLoading(true);
      const { data } = await getUserFeed(1, 10);
      setPosts(data.data.posts);
      setPage(2);
      setHasMore(data.data.posts.length === 10);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data?.message);
      }
    } finally {
      setIsLoading(false);
    }
  }
  async function loadMorePosts() {
    if (isLoadingMore || !hasMore) return;
    try {
      setIsLoadingMore(true);
      const { data } = await getUserFeed(page, 10);

      const newPosts = data.data.posts;

      setPosts((prev) => {
        const allPosts = [...prev, ...newPosts];

        const uniquePosts = Array.from(
          new Map(allPosts.map((post) => [post._id, post])).values(),
        );

        return uniquePosts;
      });

      setPage((prev) => prev + 1);

      if (newPosts.length < 10) {
        setHasMore(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data?.message);
      }
    } finally {
      setIsLoadingMore(false);
    }
  }
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const pageHeight = document.documentElement.scrollHeight;

      if (scrollPosition >= pageHeight - 300) {
        loadMorePosts();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, hasMore, isLoadingMore]);
  useEffect(() => {
    getAllPost();
  }, []);

  const toggleSuggested = (): void => {
    setIsSuggestedOpen((prev) => !prev);
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-3 py-3.5">
        <div className="grid min-w-0 gap-4 xl:grid-cols-[240px_minmax(0,1fr)_300px]">
          {" "}
          <div className="hidden h-fit space-y-3 xl:sticky xl:top-[84px] xl:block">
            <Sidebar
              activeLink={activeLink}
              setActiveLink={setActiveLink}
            />{" "}
          </div>
          <div className="min-w-0 space-y-4">
            <div className="xl:hidden">
              <Sidebar
                activeLink={activeLink}
                setActiveLink={setActiveLink}
              />{" "}
            </div>
            <div className="space-y-3 xl:hidden">
              <button
                onClick={toggleSuggested}
                className="cursor-pointer inline-flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm"
              >
                <h2 className="flex items-center gap-2 text-base font-bold text-main">
                  <Icon icon="lucide:users" width={18} height={18} />
                  Suggested Friends
                </h2>
                <span className="inline-flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                    5
                  </span>
                  <span className="text-xs font-bold text-[#1877f2]">
                    {isSuggestedOpen ? "Hide" : "Show"}
                  </span>
                </span>
              </button>

              {isSuggestedOpen && <SuggestedFriends />}
            </div>
            
            <div className="min-w-0 space-y-4">
              {activeLink === "feed" && (
                
                <MyFeed />
              )}

              {activeLink === "posts" && (
                
                <MyFeed />
              )}

              {activeLink === "community" && (
                
                <>
                  <CreatePost getAllPost={getAllPost} />

                  {isLoading ? (
                    <PostSkeleton />
                  ) : (
                    <>
                      {posts.map((post) => (
                        <React.Fragment key={post._id}>
                          <PostCard getAllPost={getAllPost} post={post} />
                        </React.Fragment>
                      ))}

                      {isLoadingMore && (
                        <div className="py-4">
                          <PostSkeleton />
                        </div>
                      )}

                      {!hasMore && posts.length > 0 && (
                        <p className="py-4 text-center text-sm text-slate-500">
                          No more posts
                        </p>
                      )}
                    </>
                  )}
                </>
              )}

              {activeLink === "saved" && (
                
                <SavedPost />
              )}
            </div>
          </div>
          <div className="hidden h-fit xl:sticky xl:top-[84px] xl:block">
            <SuggestedFriends />
          </div>
        </div>
      </div>
    </>
  );
}

export default Newsfeed;
