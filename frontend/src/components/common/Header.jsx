import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FormInput, LogOut, User, LayoutDashboard } from "lucide-react";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/85 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 font-bold text-foreground text-lg hover:opacity-95 transition-opacity">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-indigo-500/10">
            <FormInput className="h-5 w-5" />
          </div>
          <span className="font-heading tracking-tight">FormManager</span>
        </Link>

        {/* Navigation */}
        {user && (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link to="/" className="flex items-center gap-1.5 hover:text-primary transition-colors">
              <LayoutDashboard className="h-4 w-4" />
              <span>Quản lý Form</span>
            </Link>
          </nav>
        )}

        {/* User profile / Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-semibold text-foreground">{user.fullname}</span>
                <span className="text-xs text-primary font-medium capitalize">{user.role?.toLowerCase()}</span>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground border border-border">
                <User className="h-5 w-5" />
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                title="Đăng xuất"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow hover:bg-indigo-700 transition-colors"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
