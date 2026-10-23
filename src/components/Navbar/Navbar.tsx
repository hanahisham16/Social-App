import { Icon } from "@iconify/react";
import logo from "../../assets/route.png";
import { Button, Dropdown } from "@heroui/react";
import { useContext } from "react";
import { TokenContext } from "../context/tokenContext";
import { Link, useLocation, useNavigate } from "react-router";
import { UserContext, type UserContextType } from "../context/UserContext";

function Navbar() {
  const { setToken } = useContext(TokenContext);
    const { userDetails }: UserContextType = useContext(UserContext);
  
  const location = useLocation();
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("userToken");
    setToken(null);
    navigate("/login");
  }

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-2 py-1.5 sm:gap-3 sm:px-3">
        
        <div className="nav-logo items-center flex gap-2">
          <img
            src={logo}
            className="h-9 w-9 rounded-xl object-cover"
            alt="logo"
          />
          <p className="hidden text-xl font-extrabold text-slate-900 sm:block">
            Route Posts
          </p>
        </div>

        <div className="nav-link">
          <div className="bg-[#f8fafc] border border-slate-200/60 p-1.5 rounded-full flex items-center gap-1 max-w-md">
            
            <Link
              to="/feed"
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                isActive("/feed")
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-700 hover:bg-white/60 hover:text-slate-900"
              }`}
            >
              <Icon icon="ant-design:home-outlined" width="20" />
              <span className="hidden sm:block">Feed</span>
            </Link>

            <Link
              to="/profile"
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                isActive("/profile")
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-700 hover:bg-white/60 hover:text-slate-900"
              }`}
            >
              <Icon icon="carbon:user" width="20" />
              <span className="hidden sm:block">Profile</span>
            </Link>

            <Link
              to="/notification"
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                isActive("/notification")
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-700 hover:bg-white/60 hover:text-slate-900"
              }`}
            >
              <Icon icon="boxicons:message-bubble" width="20" />
              <span className="hidden sm:block">Notifications</span>
            </Link>

          </div>
        </div>

        <div className="nav-action">
          <Dropdown>
            <Button
              aria-label="Menu"
              variant="secondary"
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-5 transition hover:bg-slate-100"
            >
              <img
                src={userDetails?.photo}
                alt={userDetails?.name}
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="text-sm hidden md:block font-semibold text-slate-800">
                {userDetails?.name}
              </span>
              <Icon
                icon="heroicons:bars-3"
                className="w-4 h-4 text-slate-600"
              />
            </Button>

            <Dropdown.Popover className="mt-2 w-52 bg-white rounded-2xl p-2 shadow-lg border border-slate-100/80">
              <Dropdown.Menu
                onAction={(key) => {
                  if (key === "profile") navigate("/profile");
                  if (key === "settings") navigate("/settings");
                  if (key === "logout") logout();
                }}
              >
                <Dropdown.Section showDivider className="border-b border-slate-100 pb-1 mb-1">
                  <Dropdown.Item
                    id="profile"
                    textValue="Profile"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
                  >
                    <Icon icon="carbon:user" width="20" />
                    <span>Profile</span>
                  </Dropdown.Item>

                  <Dropdown.Item
                    id="settings"
                    textValue="Settings"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-700 font-medium hover:bg-slate-50 cursor-pointer"
                  >
                    <Icon icon="carbon:settings" width="20" />
                    <span>Settings</span>
                  </Dropdown.Item>
                </Dropdown.Section>

                <Dropdown.Item
                  id="logout"
                  textValue="Logout"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-rose-600 font-medium hover:bg-rose-50/60 cursor-pointer transition-colors"
                >
                  <Icon icon="solar:logout-2-outline" width="20" />
                  <span>Logout</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </div>

      </div>
    </div>
  );
}

export default Navbar;