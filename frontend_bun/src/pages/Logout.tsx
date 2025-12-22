import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "../auth";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    authClient.signOut().then(() => {
      navigate("/login");
    });
  }, []);

  return <div className="flex items-center justify-center min-h-screen">Logging out...</div>;
};

export default Logout;
