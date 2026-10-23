import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import AuthLayout from "./Layouts/AuthLayout";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import MainLayout from "./Layouts/MainLayout";
import Newsfeed from "./pages/Newsfeed/Newsfeed";
import Profile from "./pages/Profile/Profile";
import Notification from "./pages/Notification/Notification";
import Notfound from "./pages/Notfound/Notfound";
import { Toaster } from "react-hot-toast";
import AppProtectedRoute from "./components/ProtectedRoutes/AppProtectedRoute";
import AuthProtectedRoute from "./components/ProtectedRoutes/AuthProtectedRoute";
import PostDetails from "./pages/PostDetails/PostDetails";
import Settings from "./pages/Settings/Settings";

function App() {
  const routes = createBrowserRouter([
    {
      path: "/auth",
      element: (
        <AuthProtectedRoute>
          <AuthLayout />
        </AuthProtectedRoute>
      ),
      children: [
        { index: true, element: <Navigate to="login" /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
      ],
    },
    {
      path: "",
      element: (
        <AppProtectedRoute>
          <MainLayout />
        </AppProtectedRoute>
      ),
      children: [
        { index: true, element: <Navigate to="feed" /> },
        { path: "feed", element: <Newsfeed /> },
        { path: "profile", element: <Profile /> },
        { path: "notification", element: <Notification /> },
        { path: "settings", element: <Settings/> },
        { path: "postDetails/:id", element: <PostDetails /> },
      ],
    },
    { path: "*", element: <Notfound /> },
  ]);

  return (
    <>
      <Toaster />

      <RouterProvider router={routes} />
    </>
  );
}

export default App;
