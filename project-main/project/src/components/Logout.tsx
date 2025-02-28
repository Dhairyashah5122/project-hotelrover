import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    navigate("/login");
  }, [navigate]);

  return (
    <div className="h-screen flex justify-center items-center">
      <h1 className="text-xl font-bold">Logging you out...</h1>
    </div>
  );
}
