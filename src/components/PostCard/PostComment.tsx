import { Icon } from "@iconify/react";
import { useContext, useState } from "react";
import { creatPostComment } from "../../services/comments.service";
import toast from "react-hot-toast";
import { UserContext, type UserContextType } from "../context/UserContext";

export default function PostComment({
  postId,
  getComments,
}: {
  postId: string;
  getComments: (postId: string) => void;
}) {
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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

  async function handleSubmit() {
    const formData = new FormData();
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }
    try {
      const { data } = await creatPostComment(postId, formData);
      toast.success(data.message);
      getComments(postId);
      setContent("");
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await handleSubmit();
  }

  const isButtonDisabled = !content.trim() && !image;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); 
      if (!isButtonDisabled) {
        handleSubmit();
      }
    }
  };

  return (
    <>
      <form onSubmit={handleFormSubmit}>
        <div className="flex items-start gap-2.5 pt-2">
          <img
            className="size-8 shrink-0 rounded-full object-cover object-[66%_40%]"
            src={userDetails?.photo}
            alt={userDetails?.name}
          />
          <div className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:border-[#1877f2] focus-within:ring-2 focus-within:ring-[#1877f2]/20">
            <textarea
              aria-label={`Comment as ${userDetails?.name}`}
              placeholder={`Comment as ${userDetails?.name}...`}
              className="max-h-[140px] min-h-[40px] w-full resize-none bg-transparent text-sm leading-5 outline-none placeholder:text-slate-400"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown} 
            />
            <div className="mt-1 flex items-center justify-between border-t border-slate-100 pt-1.5">
              <div className="flex items-center gap-1">
                <label className="inline-flex cursor-pointer items-center justify-center rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-emerald-600">
                  <input
                    accept="image/*"
                    type="file"
                    className="sr-only"
                    onChange={handleImage}
                  />
                  <Icon icon="lucide:image" width={18} height={18} />
                </label>

                <button
                  type="button"
                  aria-label="Add an emoji"
                  className="inline-flex cursor-pointer items-center justify-center rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-amber-500"
                >
                  <Icon icon="lucide:smile" width={18} height={18} />
                </button>
              </div>

              <button
                type="submit"
                disabled={isButtonDisabled}
                aria-label="Send comment"
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#1877f2] text-white transition hover:bg-[#166fe5] disabled:cursor-not-allowed disabled:bg-[#9ec5ff]"
              >
                <Icon icon="lucide:send" width={15} height={15} />
              </button>
            </div>
          </div>
        </div>

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
      </form>
    </>
  );
}
