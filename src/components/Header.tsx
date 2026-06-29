import React from "react";
import { Utensils, ShoppingCart, Calendar, ShieldCheck, LogIn, LogOut, User } from "lucide-react";
import NotificationCenter from "./NotificationCenter";
import { AppNotification } from "../types";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  onCartToggle: () => void;
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onClearAllNotifications: () => void;
  isAdmin: boolean;
  onAdminLogout: () => void;
  userEmail: string | null;
  onOpenLoginModal: () => void;
  onUserLogout: () => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  cartCount,
  onCartToggle,
  notifications,
  onMarkAsRead,
  onClearAllNotifications,
  isAdmin,
  onAdminLogout,
  userEmail,
  onOpenLoginModal,
  onUserLogout,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Name */}
          <div 
            onClick={() => setActiveTab("menu")} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="p-2.5 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg shadow-amber-500/10 group-hover:scale-105 transition-all">
              <Utensils className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl md:text-2xl font-black tracking-tight bg-gradient-to-r from-white via-amber-200 to-amber-500 bg-clip-text text-transparent uppercase font-sans">
                The Empire
              </span>
              <span className="block text-[10px] text-amber-500 font-semibold uppercase tracking-widest leading-none">
                Royalty Served Fresh
              </span>
            </div>
          </div>

          {/* Center Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              id="nav-menu-btn"
              onClick={() => setActiveTab("menu")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "menu"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent"
              }`}
            >
              Order Menu
            </button>
            <button
              id="nav-booking-btn"
              onClick={() => setActiveTab("booking")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "booking"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent"
              }`}
            >
              Table Reservation
            </button>
            <button
              id="nav-tracking-btn"
              onClick={() => setActiveTab("tracking")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "tracking"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent"
              }`}
            >
              Track Orders
            </button>
            <button
              id="nav-feedback-btn"
              onClick={() => setActiveTab("feedback")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "feedback"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent"
              }`}
            >
              Reviews & Feedback
            </button>
            <button
              id="nav-admin-btn"
              onClick={() => setActiveTab("admin")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === "admin"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : isAdmin
                  ? "text-amber-400 hover:bg-slate-900 border border-transparent"
                  : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
              }`}
            >
              {isAdmin && <ShieldCheck className="w-4 h-4 text-amber-500" />}
              Admin Panel
            </button>
          </nav>

          {/* Right Interactions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <NotificationCenter
              notifications={notifications}
              onMarkAsRead={onMarkAsRead}
              onClearAll={onClearAllNotifications}
            />

            {/* Cart Icon */}
            <button
              id="cart-toggle-btn"
              onClick={onCartToggle}
              className="relative p-2.5 text-slate-400 hover:text-amber-500 bg-slate-900 hover:bg-slate-800 rounded-full transition-all border border-slate-800 flex items-center justify-center"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-950 animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin/User Sign in Indicator */}
            {isAdmin ? (
              <button
                id="admin-logout-btn"
                onClick={onAdminLogout}
                className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-900/40 rounded-lg text-[10px] md:text-xs font-semibold transition-all"
                title="Logout from Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout Admin</span>
                <span className="sm:hidden">Logout</span>
              </button>
            ) : userEmail ? (
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[10px] md:text-xs font-semibold text-slate-300">
                  <User className="w-3.5 h-3.5 text-amber-500" />
                  <span className="max-w-[55px] sm:max-w-[100px] truncate">{userEmail.split('@')[0]}</span>
                </div>
                <button
                  id="user-logout-btn"
                  onClick={onUserLogout}
                  className="flex items-center justify-center p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-red-400 transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="header-login-btn"
                onClick={onOpenLoginModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-[10px] md:text-xs font-semibold transition-all"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-500" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-around py-3 border-t border-slate-900/50">
          <button
            onClick={() => setActiveTab("menu")}
            className={`text-xs font-semibold px-2 py-1.5 rounded-md transition-all ${
              activeTab === "menu" ? "text-amber-400 bg-slate-900" : "text-slate-400"
            }`}
          >
            Menu
          </button>
          <button
            onClick={() => setActiveTab("booking")}
            className={`text-xs font-semibold px-2 py-1.5 rounded-md transition-all ${
              activeTab === "booking" ? "text-amber-400 bg-slate-900" : "text-slate-400"
            }`}
          >
            Book Table
          </button>
          <button
            onClick={() => setActiveTab("tracking")}
            className={`text-xs font-semibold px-2 py-1.5 rounded-md transition-all ${
              activeTab === "tracking" ? "text-amber-400 bg-slate-900" : "text-slate-400"
            }`}
          >
            Track
          </button>
          <button
            onClick={() => setActiveTab("feedback")}
            className={`text-xs font-semibold px-2 py-1.5 rounded-md transition-all ${
              activeTab === "feedback" ? "text-amber-400 bg-slate-900" : "text-slate-400"
            }`}
          >
            Feedback
          </button>
          <button
            onClick={() => setActiveTab("admin")}
            className={`text-xs font-semibold px-2 py-1.5 rounded-md transition-all ${
              activeTab === "admin" ? "text-amber-400 bg-slate-900" : "text-slate-400"
            }`}
          >
            Admin
          </button>
        </div>
      </div>
    </header>
  );
}
