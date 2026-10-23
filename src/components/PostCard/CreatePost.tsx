import { Icon } from "@iconify/react";
import { useContext, useState } from "react";
import { creatPost } from "../../services/post.service";
import toast from "react-hot-toast";
import { Spinner } from "@heroui/react";
import { UserContext, type UserContextType } from "../context/UserContext";

export default function CreatePost({ getAllPost }: { getAllPost: () => void }) {
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const formData = new FormData();
    const isButtonDisabled = !content.trim() && !image;

  const { userDetails }: UserContextType = useContext(UserContext);

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function clearPreview() {
    setImagePreview(null);
    setImage(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    formData.append("body", content);
    if (image) {
      formData.append("image", image);
    }
    try {
      const { data } = await creatPost(formData);
      console.log(data);
      toast.success(data.message);
      setContent("");
      setImage(null);
      setImagePreview(null);
      getAllPost();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <header className="mb-3 flex items-start gap-3">
        <img
          alt={userDetails?.name}
          className="size-11 shrink-0 rounded-full object-cover"
          src={userDetails?.photo}
        />
        <div className="min-w-0">
          <p className="text-sm font-bold capitalize text-gray-900">
            {userDetails?.name}
          </p>
          <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
            <Icon
              icon="lucide:globe"
              width="12"
              height="12"
              aria-hidden="true"
            />
            <span className="sr-only">Post privacy</span>
            <select className="cursor-pointer bg-transparent outline-none">
              <option value="public">Public</option>
              <option value="followers">Followers</option>
              <option value="only-me">Only me</option>
            </select>
          </div>
        </div>
      </header>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={`What's on your mind, ${userDetails?.name.split(" ")[0]}?`}
        rows={4}
        className="w-full resize-none rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-gray-800 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-200"
      />

      {imagePreview && (
        <div className="relative mt-2">
          <img
            className="max-h-52 w-full rounded-lg object-cover"
            src={imagePreview}
            alt="Preview"
          />
          <button
            type="button"
            onClick={clearPreview}
            className="absolute cursor-pointer right-2 top-2 rounded-full bg-black/60 p-1 text-white"
          >
            <Icon icon="hugeicons:cancel-01" width={18} height={18} />
          </button>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-3">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
            <Icon
              icon="lucide:image"
              width="18"
              height="18"
              className="pointer-events-none text-emerald-500"
            />
            <span className="hidden sm:inline">Photo/video</span>

            <input
              type="file"
              onChange={handleImage}
              accept="image/*,video/*"
              className="sr-only"
            />
          </label>
          <button
            type="button"
            className="flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            <Icon
              icon="lucide:smile"
              width="18"
              height="18"
              className="pointer-events-none text-amber-500"
            />
            <span className="hidden sm:inline">Feeling/activity</span>
          </button>
        </div>

        <button
          type="submit"
          disabled={isButtonDisabled}
          className="flex items-center gap-2 cursor-pointer rounded-lg bg-[#1877f2] px-5 py-2 text-sm font-extrabold text-white shadow-sm transition-colors hover:bg-[#166fe5] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex gap-2 items-center">
              <Spinner size="sm" className="text-white" />
              <span>posting.....</span>
            </div>
          ) : (
            <>
              Post
              <Icon icon="lucide:send" width="14" height="14" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
