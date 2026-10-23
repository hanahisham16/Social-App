import {
  UserContext,
  type UserContextType,
} from "../../components/context/UserContext";
import { Icon } from "@iconify/react"; // استيراد مكون Icon من Iconify
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { getMyFeed } from "../../services/feed.service";
import type { PostCardI } from "../../types/postCard.types";
import PostCard from "../../components/PostCard/PostCard";
import PostSkeleton from "../../components/PostCard/PostSkeleton";
import toast from "react-hot-toast";
import { getSavedPosts } from "../../services/post.service";

export default function Profile() {
  const { userDetails }: UserContextType = useContext(UserContext);
  const [myPostsCount, setMyPostsCount] = useState(0);
  const [myPosts, setMyPosts] = useState<PostCardI[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  const [activeTab, setActiveTab] = useState("posts");
  const [savedPosts, setSavedPosts] = useState<PostCardI[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(true);

  const fetchSavedPosts = async () => {
    try {
      setIsLoadingSaved(true);

      const { data } = await getSavedPosts();

      setSavedPosts(data.data.bookmarks ?? []);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to load saved posts",
        );
      }
    } finally {
      setIsLoadingSaved(false);
    }
  };

  useEffect(() => {
    if (userDetails?._id) {
      fetchSavedPosts();
    }
  }, [userDetails?._id]);
  useEffect(() => {
    async function fetchMyPostsCount() {
      try {
        const { data } = await getMyFeed(1, 1);

        setMyPostsCount(data.meta.pagination.total);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data?.message);
        }
      }
    }

    if (userDetails) {
      fetchMyPostsCount();
    }
  }, [userDetails]);
  const fetchMyPosts = async () => {
    try {
      setIsLoadingPosts(true);

      const { data } = await getMyFeed(1, 10);

      setMyPosts(data.data.posts);
      setMyPostsCount(data.meta.pagination.total);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data?.message);
      }
    } finally {
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    if (userDetails?._id) {
      fetchMyPosts();
    }
  }, [userDetails?._id]);
  return (
    <>
      {userDetails && (
        <>
          <main className="min-h-screen bg-sec py-6">
            <div className="container mx-auto max-w-6xl px-4">
              <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,.06)] sm:rounded-[28px]">
                <div className="h-36 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-700 sm:h-44" />

                <div className="relative mx-2 -mt-16 rounded-3xl border border-white/60 bg-white/92 p-5  backdrop-blur-xl sm:p-7">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={userDetails.photo}
                        alt={userDetails.name}
                        className="size-24 shrink-0 rounded-full object-cover ring-4 ring-white sm:size-28"
                      />
                      <div>
                        <h1 className="truncate text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">
                          {userDetails.name}
                        </h1>
                        <p className="mt-1 text-lg font-semibold text-slate-500 sm:text-xl">
                          @{userDetails?.username}
                        </p>
                        <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#d7e7ff] bg-[#eef6ff] px-3 py-1 text-xs font-bold text-[#0b57d0]">
                          <Icon icon="lucide:sparkles" width="12" height="12" />
                          Route Posts member
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 lg:min-w-80">
                      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4">
                        <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                          Followers
                        </p>
                        <p className="mt-1 text-xl font-bold text-gray-900">
                          {userDetails.followersCount}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4">
                        <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                          Following
                        </p>
                        <p className="mt-1 text-xl font-bold text-gray-900">
                          {userDetails.followingCount}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-center sm:px-4 sm:py-4">
                        <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                          Bookmarks
                        </p>
                        <p className="mt-1 text-xl font-bold text-gray-900">
                          {userDetails.bookmarksCount}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <h2 className="text-sm font-semibold text-gray-900">
                        About
                      </h2>
                      <p className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                        <Icon
                          icon="lucide:mail"
                          width="16"
                          height="16"
                          className="text-gray-400"
                        />
                        {userDetails.email}
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                        <Icon
                          icon="lucide:sparkles"
                          width="16"
                          height="16"
                          className="text-gray-400"
                        />
                        Active on Route Posts
                      </p>
                    </div>

                    <div className="grid gap-3">
                      <div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3">
                        <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                          My Posts
                        </p>
                        <p className="mt-1 text-xl font-bold text-gray-900">
                          {myPostsCount}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-[#dbeafe] bg-[#f6faff] px-4 py-3">
                        <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                          Saved Posts
                        </p>
                        <p className="mt-1 text-xl font-bold text-gray-900">
                          {savedPosts.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mt-4 flex items-center justify-between rounded-2xl bg-white px-3 py-2 shadow-sm">
                <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("posts")}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold ${
                      activeTab === "posts"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    <Icon icon="lucide:image" width="16" height="16" />
                    My Posts
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("saved")}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold ${
                      activeTab === "saved"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-500"
                    }`}
                  >
                    <Icon icon="lucide:bookmark" width="16" height="16" />
                    Saved
                  </button>
                </div>
                <span className="grid size-7 place-items-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">
                  {activeTab === "posts" ? myPostsCount : savedPosts.length}
                </span>
              </section>

              {activeTab === "posts" ? (
                isLoadingPosts ? (
                  <p className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm text-gray-400 shadow-sm">
                    Loading posts...
                  </p>
                ) : myPosts.length > 0 ? (
                  <div className="mt-4 space-y-4">
                    {myPosts.map((post) => (
                      <PostCard
                        key={post._id}
                        post={post}
                        getAllPost={fetchMyPosts}
                        variant="profile"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm text-gray-400 shadow-sm">
                    You have not posted yet.
                  </p>
                )
              ) : isLoadingSaved ? (
                <p className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm text-gray-400 shadow-sm">
                  Loading saved posts...
                </p>
              ) : savedPosts.length > 0 ? (
                <div className="mt-4 space-y-4">
                  {savedPosts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      getAllPost={fetchSavedPosts}
                      variant="profile"
                    />
                  ))}
                </div>
              ) : (
                <p className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm text-gray-400 shadow-sm">
                  You have no saved posts.
                </p>
              )}
            </div>
          </main>
        </>
      )}
    </>
  );
}
