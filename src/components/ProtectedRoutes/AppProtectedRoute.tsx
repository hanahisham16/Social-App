import React, { useContext, useEffect} from "react";
import { useNavigate } from "react-router";
import { TokenContext } from "../context/tokenContext";

export default function AppProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token } = useContext(TokenContext);

  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/auth/login");
    }
  }, [token]);

  return <>{children}</>;
}
