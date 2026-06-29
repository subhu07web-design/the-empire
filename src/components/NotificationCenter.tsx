import React, { useState, useEffect } from "react";
import { Bell, X, ShieldAlert, ShoppingBag, Calendar, MessageSquare, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AppNotification } from "../types";

interface NotificationCenterProps {
  notifications: AppNotification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

export default function NotificationCenter({
  notifications,
  onMarkAsRead,
  onClearAll,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingBag className="w-4 h-4 text-amber-500" />;
      case "booking":
        return <Calendar className="w-4 h-4 text-emerald-500" />;
      case "feedback":
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      default:
        return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        id="notification-bell-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-slate-400 hover:text-amber-500 bg-slate-900 hover:bg-slate-800 rounded-full transition-all border border-slate-800"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-950 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop to close */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              id="notification-panel"
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-3 w-80 md:w-96 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-500" />
                  <h3 className="font-semibold text-slate-200 text-sm">
                    Live Notifications
                  </h3>
                  <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                    {unreadCount} New
                  </span>
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={onClearAll}
                    className="text-xs text-slate-400 hover:text-amber-500 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-800/50">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No recent notifications</p>
                    <p className="text-xs mt-1">Updates on orders or bookings will appear here.</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3.5 transition-colors flex gap-3 ${
                        notif.read ? "bg-transparent" : "bg-slate-950/40 border-l-2 border-amber-500"
                      }`}
                    >
                      <div className="flex-shrink-0 mt-1">
                        <div className="p-1.5 bg-slate-800 rounded-lg">
                          {getIcon(notif.type)}
                        </div>
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <p className={`text-xs font-semibold ${notif.read ? 'text-slate-300' : 'text-slate-100'}`}>
                            {notif.title}
                          </p>
                          {!notif.read && (
                            <button
                              onClick={() => onMarkAsRead(notif.id)}
                              className="text-[10px] text-amber-500 hover:underline flex-shrink-0"
                            >
                              Mark read
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                          {notif.body}
                        </p>
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Push notification setup banner */}
              <div className="p-3 bg-slate-950 border-t border-slate-800 text-center">
                <p className="text-[10px] text-slate-500">
                  ⚡ Mobile push-style simulation active.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Global In-app Phone Push Notifications Simulator Component
export function NotificationBanner({
  activeNotif,
  onDismiss,
}: {
  activeNotif: AppNotification | null;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (activeNotif) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [activeNotif, onDismiss]);

  if (!activeNotif) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4">
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        className="bg-slate-900/95 backdrop-blur-md border border-amber-500/30 text-white p-3.5 rounded-2xl shadow-2xl flex gap-3 items-start relative overflow-hidden"
      >
        {/* Glowing top line representing mobile accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600 animate-pulse" />

        <div className="flex-shrink-0 mt-0.5 p-2 bg-slate-800 rounded-xl border border-slate-700">
          <Bell className="w-5 h-5 text-amber-500" />
        </div>

        <div className="flex-grow min-w-0 pr-4">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
              THE EMPIRE PUSH
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-500" />
            <span className="text-[10px] text-slate-400">just now</span>
          </div>
          <h4 className="text-xs font-bold text-slate-100 mt-0.5">
            {activeNotif.title}
          </h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {activeNotif.body}
          </p>
        </div>

        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
