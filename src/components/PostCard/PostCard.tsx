import { useContext, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import type { PostCardI, TopComment } from "../../types/postCard.types";
import moment from "moment";
import { Link } from "react-router";
import axios from "axios";
import { getPostComments } from "../../services/comments.service";
import PostComment from "./PostComment";
import { AlertDialog, Button, Dropdown, Label } from "@heroui/react";
import { UserContext, type UserContextType } from "../context/UserContext";
import EditPost from "./EditPost";
import { deletePost, toggleBookmark } from "../../services/post.service";
import toast from "react-hot-toast";
import {
  updatePostComment,
  deletePostComment,
} from "../../services/comments.service";
import LikeButton from "../LikeButton/LikeButton";
import LikeCommentButton from "../LikeCommentButton/LikeCommentButton";

export default function PostCard({
  post,
  getAllPost,
  variant = "feed",
  isSavedPost = false,
}: {
  post: PostCardI;
  getAllPost: () => void;
  variant?: "feed" | "profile";
  isSavedPost?: boolean;
}) {
  {
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likesCount || 0);
    const [showAllComments, setShowAllComments] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { userDetails }: UserContextType = useContext(UserContext);
    const [showEditPost, setShowEditPost] = useState<boolean>(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(
      null,
    );
    const [editCommentContent, setEditCommentContent] = useState("");
    const [isUpdatingComment, setIsUpdatingComment] = useState(false);
    const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
      null,
    );
    const [isOpen, setIsOpen] = useState(false);

    const [showDeleteCommentDialog, setShowDeleteCommentDialog] =
      useState(false);

    const [selectedCommentId, setSelectedCommentId] = useState<string | null>(
      null,
    );
    const [allComments, setAllComments] = useState<TopComment[] | []>([]);
    const [visibleCount, setVisibleCount] = useState(5);
    const getTimeAgo = (date) => {
      const diff = moment().diff(moment(date), "minutes");
      if (diff < 60) return `${diff} m`;
      const hours = Math.floor(diff / 60);
      if (hours < 24) return `${hours} h`;
      const days = Math.floor(hours / 24);
      if (days < 7) return `${days} d`;
      const weeks = Math.floor(days / 7);
      return `${weeks} w`;
    };
    const [isSaving, setIsSaving] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(post.bookmarked ?? false);

    async function handleSavePost() {
      try {
        setIsSaving(true);

        const { data } = await toggleBookmark(post._id);
        console.log(data);

        setIsBookmarked(data.data.bookmarked ?? !isBookmarked);

        toast.success(data.message || "Post saved successfully");
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || "Failed to save post");
        }
      } finally {
        setIsSaving(false);
      }
    }
    async function getComments(postId: string) {
      try {
        const { data } = await getPostComments(postId);
        setAllComments(data.data.comments);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data?.message);
        }
      } finally {
      }
    }
    async function handleUpdateComment(commentId: string) {
      if (!editCommentContent.trim()) {
        toast.error("Comment cannot be empty");
        return;
      }

      try {
        setIsUpdatingComment(true);

        const formData = new FormData();
        formData.append("content", editCommentContent.trim());

        const { data } = await updatePostComment(post._id, commentId, formData);

        toast.success(data.message || "Comment updated successfully");

        setEditingCommentId(null);
        setEditCommentContent("");

        await getComments(post._id);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || "Failed to update comment",
          );
        }
      } finally {
        setIsUpdatingComment(false);
      }
    }

    async function handleDeleteComment(commentId: string) {
      try {
        setDeletingCommentId(commentId);

        const { data } = await deletePostComment(post._id, commentId);

        toast.success(data.message || "Comment deleted successfully");

        await getComments(post._id);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(
            error.response?.data?.message || "Failed to delete comment",
          );
        }
      } finally {
        setDeletingCommentId(null);
      }
    }
    async function deleteMyPost(postId: string) {
      try {
        const { data } = await deletePost(postId);
        toast.success(data.message);

        getAllPost();
      } catch (error) {
        console.log(error);
      }
    }
    useEffect(() => {
      getComments(post._id);
    }, [post._id]);

    return (
      <article className="overflow-hidden rounded-xl border border-[#dddfe2] bg-white shadow-sm">
        <div className="flex items-center gap-3 px-4 pb-2 pt-4">
          <img
            src={post.user.photo}
            alt={post.user.name}
            className="size-10 rounded-full border border-[#d8dbe1] object-cover object-[66%_40%]"
          />
          <div className="min-w-0 flex-1 leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="text-[15px] font-bold text-[#1c1e21]">
                {post.user.name}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-[#65676b]">
              <span className="text-sm text-[#65676b]">
                @{post.user.username}
              </span>
              {variant === "feed" && (
                <>
                  <span aria-hidden="true">·</span>
                  <span> {getTimeAgo(post.createdAt)}</span>{" "}
                  <span aria-hidden="true">·</span>
                  <Icon
                    icon={
                      post.privacy === "public"
                        ? "lucide:earth"
                        : post.privacy === "followers"
                          ? "lucide:users"
                          : "lucide:lock"
                    }
                    width={12}
                    height={12}
                    aria-label={post.privacy}
                  />
                  <span>{post.privacy}</span>{" "}
                </>
              )}
            </div>
          </div>
          {variant === "profile" ? (
            <button
              type="button"
              className="rounded-md px-2 py-1 text-xs font-bold text-[#1877f2] hover:bg-[#e7f3ff]"
            >
              <Link to={`/postDetails/${post._id}`}>View details</Link>
            </button>
          ) : post.user._id === userDetails?._id ? (
            <Dropdown>
              <Button
                type="button"
                aria-label="More post options"
                className="grid size-9 place-items-center rounded-full bg-transparent text-[#65676b] transition hover:bg-[#f0f2f5]"
              >
                <Icon icon="lucide:ellipsis" width={21} height={21} />
              </Button>

              <Dropdown.Popover>
                <Dropdown.Menu
                  onAction={(key) => console.log(`Selected: ${key}`)}
                >
                  <Dropdown.Item
                    id="save-post"
                    textValue={isBookmarked ? "Remove saved post" : "Save post"}
                    onClick={handleSavePost}
                    isDisabled={isSaving}
                  >
                    <Icon icon="boxicons:bookmark" width={15} height={15} />

                    <Label>
                      {isSaving
                        ? "Saving..."
                        : isBookmarked
                          ? "Unsaved Post"
                          : "Save Post"}
                    </Label>
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => setShowEditPost(true)}
                    id="edit-post"
                    textValue="Edit post"
                  >
                    <Icon icon="boxicons:pencil" width={15} height={15} />
                    <Label>Edit Post</Label>
                  </Dropdown.Item>

                  <Dropdown.Item
                    id="delete-post"
                    textValue="Delete post"
                    variant="danger"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Icon
                      icon="akar-icons:trash-can"
                      className="text-rose-600"
                      width={15}
                      height={15}
                    />
                    <Label>Delete Post</Label>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          ) : (
            <Dropdown>
              <Button
                type="button"
                aria-label="More post options"
                className="grid size-9 place-items-center rounded-full bg-transparent text-[#65676b] transition hover:bg-[#f0f2f5]"
              >
                <Icon icon="lucide:ellipsis" width={21} height={21} />
              </Button>

              <Dropdown.Popover>
                <Dropdown.Menu
                  onAction={(key) => console.log(`Selected: ${key}`)}
                >
                  <Dropdown.Item
                    id="save-post"
                    textValue={isBookmarked ? "Remove saved post" : "Save post"}
                    onClick={handleSavePost}
                    isDisabled={isSaving}
                  >
                    <Icon icon="boxicons:bookmark" width={15} height={15} />

                    <Label>
                      {isSaving
                        ? "Saving..."
                        : isBookmarked
                          ? "Unsaved Post"
                          : "Save Post"}
                    </Label>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          )}
        </div>
        <AlertDialog isOpen={showDeleteDialog}>
          <AlertDialog.Backdrop>
            <AlertDialog.Container>
              <AlertDialog.Dialog className="sm:max-w-[500px] p-0">
                <AlertDialog.Header className="flex flex-row items-center justify-between border-b border-slate-200 px-4 py-3 m-0">
                  <AlertDialog.Heading className="text-base font-extrabold text-slate-900 m-0">
                    Confirm action
                  </AlertDialog.Heading>
                  <AlertDialog.CloseTrigger
                    onClick={() => setShowDeleteDialog(false)}
                    className="m-0 self-center"
                  />
                </AlertDialog.Header>
                <AlertDialog.Body className="flex items-start gap-3 p-4">
                  <AlertDialog.Icon status="danger" />

                  <div className="">
                    <h5 className="text-sm font-extrabold text-slate-900">
                      Delete this post?
                    </h5>
                    <p>
                      This post will be permanently removed from your profile
                      and feed.
                    </p>
                  </div>
                </AlertDialog.Body>
                <AlertDialog.Footer className="flex items-center justify-end gap-2 border-t border-slate-200 px-4 py-3">
                  <Button
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                    onClick={() => setShowDeleteDialog(false)}
                    slot="close"
                    variant="tertiary"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => deleteMyPost(post._id)}
                    className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
                    slot="close"
                    variant="danger"
                  >
                    Delete Post
                  </Button>
                </AlertDialog.Footer>
              </AlertDialog.Dialog>
            </AlertDialog.Container>
          </AlertDialog.Backdrop>
        </AlertDialog>
        {showEditPost ? (
          <EditPost
            getAllPost={getAllPost}
            postId={post._id}
            setShowEditPost={setShowEditPost}
          />
        ) : (
          <>
            <p className="px-4 pb-3 text-[15px] text-[#1c1e21]">{post.body}</p>

            {isBookmarked && (
              <div className="mx-4 mb-3 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
                <Icon icon="boxicons:bookmark" width={15} height={15} />
                Saved Post
              </div>
            )}

            {post.image && (
              <img
                src={post.image}
                alt="Post attachment"
                className="block max-h-[680px] w-full bg-[#10131c] object-cover object-center cursor-pointer"
                onClick={() => setIsOpen(true)}
              />
            )}

            {isOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute cursor-pointer top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition"
                >
                  ✕
                </button>
                <div className="relative max-h-[90vh] max-w-[90vw]">
                  <img
                    src={post.image}
                    alt="Expanded post attachment"
                    className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
                  />
                </div>
              </div>
            )}
          </>
        )}

        <div className="">
          <div className="flex px-4 items-center justify-between border-b border-[#e4e6eb] py-3 text-[13px] text-[#65676b]">
            {variant === "profile" ? (
              <>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Icon
                      icon="lucide:thumbs-up"
                      className="text-blue-500"
                      width={16}
                      height={16}
                    />
                    <span>{likesCount} likes</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon
                      icon="hugeicons:repost"
                      className="text-blue-500"
                      width={16}
                      height={16}
                    />
                    <span>{post.sharesCount} shares</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon
                      icon="lucide:message-circle"
                      className="text-blue-500"
                      width={16}
                      height={16}
                    />
                    <span>{post.commentsCount} comments</span>
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-[#65676b]">
                  <Icon icon="lucide:clock" width={14} height={14} />
                  <span>{moment(post.createdAt).format("MMM D, h:mm A")}</span>
                </div>
              </>
            ) : (
              <>
                <span className="flex items-center gap-1.5">
                  <span className="grid size-[18px] place-items-center rounded-full bg-[#1877f2] text-white">
                    <Icon icon="lucide:thumbs-up" width={11} height={11} />
                  </span>
                  <span
                    onClick={() => setIsLiked(!isLiked)}
                    className="text-[#65676b] cursor-pointer select-none"
                  >
                    {likesCount} likes
                  </span>{" "}
                </span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    {" "}
                    <Icon icon="hugeicons:repost" width={16} height={16} />
                    {post.sharesCount} shares
                  </span>
                  <button type="button">{post.commentsCount} comments</button>
                  {variant === "feed" && (
                    <button
                      type="button"
                      className="rounded-md px-2 py-1 text-xs font-bold text-[#1877f2] hover:bg-[#e7f3ff]"
                    >
                      <Link to={`/postDetails/${post._id}`}>View details</Link>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
          {variant === "feed" && (
            <>
              <div className="grid grid-cols-3 gap-1 px-1 py-1.5">
                <LikeButton
                  initiallyLiked={post.likes.includes(userDetails?._id ?? "")}
                  initialLikes={post.likesCount}
                  postId={post._id}
                  onLikesCountChange={setLikesCount}
                />
                <button
                  type="button"
                  onClick={() => setShowAllComments((prev) => !prev)}
                  className="flex cursor-pointer h-10 items-center justify-center gap-2 rounded-md text-sm font-semibold text-[#65676b] transition hover:bg-[#f0f2f5]"
                >
                  <Icon icon="lucide:message-circle" width={18} height={18} />
                  Comment
                </button>

                <button
                  type="button"
                  className="flex cursor-pointer h-10 items-center justify-center gap-2 rounded-md text-sm font-semibold text-[#65676b] transition hover:bg-[#f0f2f5]"
                >
                  <Icon icon="lucide:share-2" width={18} height={18} />
                  Share
                </button>
              </div>
              <section
                aria-label="Comments"
                className="border-t border-[#e4e6eb]"
              >
                {allComments.length === 0 && !showAllComments ? null : (
                  <div>
                    {allComments.length > 0 &&
                    !showAllComments &&
                    post.topComment ? (
                      <div className="rounded-2xl border m-4 border-slate-200 p-3 bg-[#f0f2f5]">
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                          Top Comment
                        </p>
                        <div
                          key={post.topComment._id}
                          className="flex items-start gap-2"
                        >
                          <img
                            src={post.topComment.commentCreator?.photo}
                            alt={post.topComment.commentCreator?.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                          <div className="min-w-0 flex-1 rounded-2xl bg-white px-3 py-2 shadow-sm">
                            <p className="truncate text-xs font-bold text-slate-900">
                              {post.topComment.commentCreator?.name}
                            </p>
                            <p className="mt-0.5 whitespace-pre-wrap text-sm text-slate-700">
                              {post.topComment.content}
                            </p>
                            {post.topComment.image && (
                              <img
                                className="mt-2 max-h-52 w-full rounded-lg object-cover"
                                src={post.topComment.image}
                                alt=""
                              />
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAllComments(true)}
                          className="mt-2 text-xs font-bold text-[#1877f2] hover:underline cursor-pointer"
                        >
                          View all comments
                        </button>
                      </div>
                    ) : (
                      <div className="bg-[#f0f2f5] p-4 space-y-3">
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2">
                              <h2 className="text-sm font-extrabold tracking-wide text-slate-700">
                                Comments
                              </h2>
                              <span className="rounded-full bg-[#e7f3ff] px-2 py-0.5 text-[11px] font-bold text-[#1877f2]">
                                {allComments.length}
                              </span>
                            </div>
                            <label className="flex items-center gap-1.5 text-sm text-[#65676b]">
                              <span className="sr-only">Sort comments</span>
                              <select className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 outline-none ring-[#1877f2]/20 focus:border-[#1877f2] focus:bg-white focus:ring-2 cursor-pointer">
                                <option value="relevant">Most relevant</option>
                                <option value="newest">Newest</option>
                              </select>
                            </label>
                          </div>

                          <div>
                            {allComments.length === 0 ? (
                              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center">
                                <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#eef3ff] text-[#1877f2]">
                                  <Icon
                                    icon="boxicons:message-circle"
                                    width={24}
                                    height={24}
                                  />
                                </div>
                                <p className="text-lg font-extrabold text-slate-800">
                                  No comments yet
                                </p>
                                <p className="mt-1 text-sm font-medium text-slate-500">
                                  Be the first to comment.
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-3 pt-1">
                                {allComments
                                  .slice(0, visibleCount)
                                  .map((comment) => (
                                    <div
                                      key={comment._id}
                                      className="flex items-start gap-2.5"
                                    >
                                      <img
                                        src={comment.commentCreator.photo}
                                        alt={comment.commentCreator.name}
                                        className="h-8 w-8 shrink-0 rounded-full object-cover"
                                      />
                                      <div className="min-w-0 flex-1">
                                        <div className="inline-block max-w-full rounded-2xl bg-white px-3.5 py-2.5 shadow-sm border border-slate-100">
                                          <p className="truncate text-xs font-bold text-slate-900">
                                            {comment.commentCreator.name}
                                          </p>
                                          <p className="text-[11px] text-slate-400 mb-1">
                                            @{comment.commentCreator.username} ·{" "}
                                            {moment(comment.createdAt).format(
                                              "MMM D, h:mm A",
                                            )}
                                          </p>
                                          {editingCommentId === comment._id ? (
                                            <div className="mt-2 space-y-2">
                                              <textarea
                                                value={editCommentContent}
                                                onChange={(e) =>
                                                  setEditCommentContent(
                                                    e.target.value,
                                                  )
                                                }
                                                rows={3}
                                                className="w-full resize-y rounded-lg border border-slate-300 p-2 text-sm outline-none focus:border-[#1877f2] focus:ring-2 focus:ring-blue-100"
                                                placeholder="Edit your comment..."
                                                disabled={isUpdatingComment}
                                              />

                                              <div className="flex justify-end gap-2">
                                                <button
                                                  type="button"
                                                  disabled={isUpdatingComment}
                                                  onClick={() => {
                                                    setEditingCommentId(null);
                                                    setEditCommentContent("");
                                                  }}
                                                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                                                >
                                                  Cancel
                                                </button>

                                                <button
                                                  type="button"
                                                  disabled={
                                                    isUpdatingComment ||
                                                    !editCommentContent.trim()
                                                  }
                                                  onClick={() =>
                                                    handleUpdateComment(
                                                      comment._id,
                                                    )
                                                  }
                                                  className="rounded-lg bg-[#1877f2] px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                                                >
                                                  {isUpdatingComment
                                                    ? "Saving..."
                                                    : "Save"}
                                                </button>
                                              </div>
                                            </div>
                                          ) : (
                                            <p className="whitespace-pre-wrap text-sm leading-snug text-slate-800">
                                              {comment.content}
                                            </p>
                                          )}
                                          {comment.image && (
                                            <img
                                              className="mt-2 max-h-52 w-full rounded-lg object-cover"
                                              src={comment.image}
                                              alt=""
                                            />
                                          )}
                                        </div>

                                        <div className="mt-1 flex items-center justify-between px-2 text-xs font-semibold text-slate-500">
                                          <div className="flex items-center gap-3">
                                            <span>
                                              {moment(comment.createdAt).format(
                                                "MMM D, h:mm A",
                                              )}
                                            </span>
                                            <LikeCommentButton
                                              postId={comment.post}
                                              commentId={comment._id}
                                              initialLikes={
                                                comment.likes?.length || 0
                                              }
                                              initiallyLiked={comment.likes?.some(
                                                (like) =>
                                                  like === userDetails?._id,
                                              )}
                                            />
                                            <button
                                              type="button"
                                              className="hover:text-[#1877f2] hover:underline"
                                            >
                                              Reply
                                            </button>
                                          </div>
                                          {comment.commentCreator._id ===
                                          userDetails?._id ? (
                                            <>
                                              <Dropdown>
                                                <Button
                                                  type="button"
                                                  aria-label="More post options"
                                                  className="grid size-9 place-items-center rounded-full text-[#65676b] bg-transparent transition hover:bg-[#f0f2f5]"
                                                >
                                                  <Icon
                                                    icon="lucide:ellipsis"
                                                    width={21}
                                                    height={21}
                                                  />
                                                </Button>
                                                <Dropdown.Popover>
                                                  <Dropdown.Menu
                                                    onAction={(key) =>
                                                      console.log(
                                                        `Selected: ${key}`,
                                                      )
                                                    }
                                                  >
                                                    <Dropdown.Item
                                                      id="edit-comment"
                                                      textValue="Edit comment"
                                                      onClick={() => {
                                                        setEditingCommentId(
                                                          comment._id,
                                                        );
                                                        setEditCommentContent(
                                                          comment.content,
                                                        );
                                                      }}
                                                    >
                                                      <Icon
                                                        icon="boxicons:pencil"
                                                        width={15}
                                                        height={15}
                                                      />
                                                      <Label>Edit</Label>
                                                    </Dropdown.Item>
                                                    <Dropdown.Item
                                                      id="delete-comment"
                                                      textValue="Delete comment"
                                                      variant="danger"
                                                      onClick={() => {
                                                        setSelectedCommentId(
                                                          comment._id,
                                                        );
                                                        setShowDeleteCommentDialog(
                                                          true,
                                                        );
                                                      }}
                                                    >
                                                      <Icon
                                                        icon="akar-icons:trash-can"
                                                        className="text-rose-600"
                                                        width={15}
                                                        height={15}
                                                      />
                                                      <Label>Delete</Label>
                                                    </Dropdown.Item>
                                                  </Dropdown.Menu>
                                                </Dropdown.Popover>
                                              </Dropdown>
                                            </>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                <AlertDialog isOpen={showDeleteCommentDialog}>
                                  <AlertDialog.Backdrop>
                                    <AlertDialog.Container>
                                      <AlertDialog.Dialog className="sm:max-w-[500px] p-0">
                                        <AlertDialog.Header className="m-0 flex flex-row items-center justify-between border-b border-slate-200 px-4 py-3">
                                          <AlertDialog.Heading className="m-0 text-base font-extrabold text-slate-900">
                                            Confirm action
                                          </AlertDialog.Heading>

                                          <AlertDialog.CloseTrigger
                                            onClick={() =>
                                              setShowDeleteCommentDialog(false)
                                            }
                                            className="m-0 self-center"
                                          />
                                        </AlertDialog.Header>

                                        <AlertDialog.Body className="flex items-start gap-3 p-4">
                                          <AlertDialog.Icon status="danger" />

                                          <div>
                                            <h5 className="text-sm font-extrabold text-slate-900">
                                              Delete this comment?
                                            </h5>

                                            <p className="text-sm text-slate-600">
                                              This comment will be permanently
                                              deleted. This action cannot be
                                              undone.
                                            </p>
                                          </div>
                                        </AlertDialog.Body>

                                        <AlertDialog.Footer className="flex items-center justify-end gap-2 border-t border-slate-200 px-4 py-3">
                                          <Button
                                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
                                            onClick={() =>
                                              setShowDeleteCommentDialog(false)
                                            }
                                            variant="tertiary"
                                          >
                                            Cancel
                                          </Button>

                                          <Button
                                            onClick={async () => {
                                              if (!selectedCommentId) return;

                                              await handleDeleteComment(
                                                selectedCommentId,
                                              );
                                              setShowDeleteCommentDialog(false);
                                              setSelectedCommentId(null);
                                            }}
                                            className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-rose-700"
                                            variant="danger"
                                          >
                                            Delete Comment
                                          </Button>
                                        </AlertDialog.Footer>
                                      </AlertDialog.Dialog>
                                    </AlertDialog.Container>
                                  </AlertDialog.Backdrop>
                                </AlertDialog>

                                {visibleCount < allComments.length && (
                                  <div className="text-center pt-2">
                                    <button
                                      type="button"
                                      disabled={isLoading}
                                      onClick={() => {
                                        setIsLoading(true);
                                        setTimeout(() => {
                                          setVisibleCount((prev) => prev + 5);
                                          setIsLoading(false);
                                        }, 500);
                                      }}
                                      className="rounded-full cursor-pointer border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60 flex items-center justify-center gap-2 mx-auto"
                                    >
                                      {isLoading && (
                                        <Icon
                                          icon="lucide:loader-circle"
                                          className="animate-spin"
                                          width={14}
                                          height={14}
                                        />
                                      )}
                                      {isLoading
                                        ? "Loading..."
                                        : "View more comments"}
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <PostComment
                            postId={post._id}
                            getComments={getComments}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </article>
    );
  }
}
