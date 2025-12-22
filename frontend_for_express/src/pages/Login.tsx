export default function Login() {
  const handleLogin = () => {
    // Redirect user to backend Google auth
    window.location.href =
      `${import.meta.env.VITE_BASE_URL}/api/auth/google`;
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
      >
        Sign in with Google
      </button>
    </div>
  );
}
