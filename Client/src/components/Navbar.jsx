import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <div className="navbar bg-base-200 px-6 shadow-md">
      <div className="flex-1">
        <Link to="/dashboard" className="text-xl font-bold text-primary">
          🔍DevLens
        </Link>
      </div>
      <div className="flex-none gap-2">
        {user ? (
          <>
            <span className="text-sm hidden sm:block">
              Hey {user.userName} 🙌
            </span>
            <Link to="/review" className="btn btn-primary btn-sm">
              New Review
            </Link>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
