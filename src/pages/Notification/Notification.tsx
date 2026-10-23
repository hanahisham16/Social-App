import { useState } from "react";
import { Icon } from "@iconify/react";

function Notification() {
  const [activeTab, setActiveTab] = useState("all");

  const [notifications, setNotifications] = useState([]);
  const unreadNotifications = notifications.filter((n) => !n.isRead);
  return (
    <div className="mx-auto max-w-7xl px-3 py-3.5">
      <main className="min-w-0">
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm sm:rounded-2xl">
          <div className="border-b border-slate-200 p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">
                  Notifications
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Realtime updates for likes, comments, shares, and follows.
                </p>
              </div>

              <button
                type="button"
                onClick={() => console.log("Mark all as read")}
                disabled={notifications.length === 0}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <Icon icon="bi:check-all" width={16} height={16} />
                Mark all as read
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:items-center">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`rounded-full px-4 py-1.5 text-sm font-bold transition cursor-pointer ${
                  activeTab === "all"
                    ? "bg-[#1877f2] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                All
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("unread")}
                className={`rounded-full px-4 py-1.5 text-sm font-bold transition cursor-pointer ${
                  activeTab === "unread"
                    ? "bg-[#1877f2] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                Unread
              </button>
            </div>
          </div>

          <div className="space-y-2 p-3 sm:p-4">
            {activeTab === "all" ? (
              notifications.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
                  <p className="text-sm font-medium text-slate-500">
                    No notifications yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3"></div>
              )
            ) :
            unreadNotifications.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
                <p className="text-sm font-medium text-slate-500">
                  No unread notifications yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Notification;
