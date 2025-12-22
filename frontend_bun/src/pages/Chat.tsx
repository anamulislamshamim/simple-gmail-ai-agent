import { useEffect, useState } from "react";
import { authClient } from "../auth";
import ChatBox from "../components/ChatBox";


// chat.tsx
const Chat = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    authClient.getSession().then((res) => {
      if (res?.data) {
        setUser(res.data.user);
      }
    });
  }, []);

  if (!user) return <div>Loading Chat Data...</div>;

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        {/* Changed avatar_url to image */}
        <img src={user.image} alt="Profile" className="w-12 h-12 rounded-full" />
        <h2 className="text-xl font-semibold">{user.name}</h2>
        {/* ... */}
      </div>
      <div><ChatBox /></div>
      {/* ... */}
    </div>
  );
};

export default Chat;
