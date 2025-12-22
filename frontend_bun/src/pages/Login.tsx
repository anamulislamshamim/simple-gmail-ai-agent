import { authClient } from "../auth";

const Login = () => {
  const handleLogin = async () => {
    try {
      await authClient.signIn.social({ 
        provider: "google",
        // USE THE FULL URL OF YOUR FRONTEND
        callbackURL: "http://localhost:5173/chat" 
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-3xl font-bold">Login</h1>
      <button
        onClick={handleLogin}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Login with Google
      </button>
    </div>
  );
};

export default Login;
