import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Chat from "./pages/Chat";
import { authClient } from "./auth";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  // useSession handles the loading state and unwraps res.data for you
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Verifying session...</span>
      </div>
    );
  }

  // If session is null, it means no user is logged in
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/logout", element: <Logout /> },
  { 
    path: "/", 
    element: <ProtectedRoute><Chat /></ProtectedRoute> 
  },
  { 
    path: "/chat", 
    element: <ProtectedRoute><Chat /></ProtectedRoute> 
  },
]);