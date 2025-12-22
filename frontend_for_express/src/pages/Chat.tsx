import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatBox from "../components/ChatBox";

export default function Chat() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simple session check via backend ping (optional)
    fetch(`${import.meta.env.VITE_BASE_URL}/api/chat`, {
      method: "OPTIONS",
      credentials: "include",
    }).catch((err) => {
      console.log(err);
      navigate("/login");
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-center text-2xl font-bold pt-6">
        Gmail AI Agent
      </h1>
      <ChatBox />
    </div>
  );
}
