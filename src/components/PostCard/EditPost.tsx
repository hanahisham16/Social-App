import { Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { updatePost } from "../../services/post.service";

export default function EditPost({getAllPost,
 postId , setShowEditPost,
}: {getAllPost:()=>void , postId:string,
  setShowEditPost: (arg0:boolean) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const formData = new FormData();
    const isButtonDisabled = !content.trim() && !image;

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
      const { data } = await updatePost(postId ,formData);
      toast.success(data.message);
      setContent("");
      setImage(null);
      setImagePreview(null);
      setShowEditPost(false)
      getAllPost();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="p-4">
      <textarea
              value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={`What's on your mind,`}
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

            <input onChange={handleImage} type="file" accept="image/*,video/*" className="sr-only" />
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

        <div className="mt-2 flex items-center justify-end gap-2">
          <button
            onClick={() => setShowEditPost(false)}
            className="cursor-pointer rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="cursor-pointer rounded-full bg-[#1877f2] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#166fe5] disabled:opacity-60"
          >
            {isLoading ? (
              <div className="flex gap-2 items-center">
                <Spinner size="sm" className="text-white" />
                <span>editing.....</span>
              </div>
            ) : (
              <>Edit Post</>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
