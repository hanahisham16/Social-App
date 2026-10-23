import { Icon } from "@iconify/react";
import { Link } from "react-router";
import logo from "../../assets/route.png"; // Make sure the path matches your logo location

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f0f2f5] px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#e7f3ff] text-[#1877f2]">
          <Icon icon="lucide:file-question" width={40} height={40} />
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900">404</h1>
        <h2 className="mt-1 text-lg font-bold text-slate-800">Page Not Found</h2>
        
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          Sorry, the page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>

        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Link
            to="/feed"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#1877f2] px-5 py-2.5 text-sm font-extrabold text-white shadow-sm transition-colors hover:bg-[#166fe5]"
          >
            <Icon icon="ant-design:home-outlined" width={18} height={18} />
            Back to Feed
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 cursor-pointer"
          >
            <Icon icon="mdi:arrow-left" width={18} height={18} />
            Go Back
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-slate-400">
        <img src={logo} alt="Route" className="h-5 w-5 rounded-md object-cover" />
        <span>Route Posts © {new Date().getFullYear()}</span>
      </div>
    </div>
  );
}