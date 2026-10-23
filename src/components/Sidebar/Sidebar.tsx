import { Icon } from "@iconify/react";

const links = [
  { id: "feed", label: "Feed", icon: "lucide:newspaper" },
  { id: "posts", label: "My Posts", icon: "lucide:sparkles" },
  { id: "community", label: "Community", icon: "lucide:globe" },
  { id: "saved", label: "Saved", icon: "lucide:bookmark" },
];

export default function Sidebar({ activeLink, setActiveLink }) {
  return (
    <aside className="rounded-2xl bg-white p-3 shadow-sm">
      <ul className="grid grid-cols-2 gap-2 xl:grid-cols-1">
        {links.map((link) => {
          const isActive = link.id === activeLink;

          return (
            <li key={link.id}>
              <button
                type="button"
                onClick={() => setActiveLink(link.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                  isActive
                    ? "bg-[#E7F3FF] text-[#1877f2]"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon icon={link.icon} width={18} height={18} />
                {link.label}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}