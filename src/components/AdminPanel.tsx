import React, { useState } from "react";
import { ShieldCheck, Lock, ShoppingBag, Calendar, ListFilter, Plus, Trash2, Utensils, MessageSquare, Star, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Order, Reservation, Feedback, MenuItem, OrderStatus, ReservationStatus } from "../types";

interface AdminPanelProps {
  isAdmin: boolean;
  onAdminLogin: (email: string, pass: string) => Promise<boolean>;
  onAdminLogout: () => void;
  orders: Order[];
  reservations: Reservation[];
  feedbacks: Feedback[];
  menuItems: MenuItem[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onUpdateReservationStatus: (resId: string, status: ReservationStatus) => void;
  onAddMenuItem: (item: Omit<MenuItem, "id" | "rating">) => void;
  onDeleteMenuItem: (id: string) => void;
}

export default function AdminPanel({
  isAdmin,
  onAdminLogin,
  onAdminLogout,
  orders,
  reservations,
  feedbacks,
  menuItems,
  onUpdateOrderStatus,
  onUpdateReservationStatus,
  onAddMenuItem,
  onDeleteMenuItem,
}: AdminPanelProps) {
  // Login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Panel states
  const [activeAdminTab, setActiveAdminTab] = useState<"orders" | "reservations" | "menu" | "feedback">("orders");

  // Menu item creator states
  const [newItemName, setNewItemName] = useState("");
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Main Course");
  const [newItemImage, setNewItemImage] = useState("");
  const [newItemVeg, setNewItemVeg] = useState(true);
  const [newItemPrep, setNewItemPrep] = useState("15-20 min");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    try {
      const success = await onAdminLogin(email, password);
      if (!success) {
        setLoginError("Invalid credentials. Entry strictly restricted!");
      } else {
        // Clear inputs on success
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      setLoginError("An error occurred during login.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleCreateMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemDesc || !newItemPrice) return;

    onAddMenuItem({
      name: newItemName,
      description: newItemDesc,
      price: Number(newItemPrice),
      category: newItemCategory,
      image: newItemImage || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600",
      isVegetarian: newItemVeg,
      isPopular: false,
      prepTime: newItemPrep,
    });

    // Reset inputs
    setNewItemName("");
    setNewItemDesc("");
    setNewItemPrice("");
    setNewItemImage("");
    setNewItemPrep("15-20 min");
    alert("New Imperial Menu Item Added!");
  };

  if (!isAdmin) {
    return (
      <div id="admin-login-screen" className="py-20 bg-slate-950 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-slate-900 border border-slate-800/80 p-8 rounded-3xl shadow-2xl relative"
        >
          {/* Glowing Top Border */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-t-3xl" />

          {/* Icon */}
          <div className="mx-auto w-12 h-12 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mb-6">
            <Lock className="w-6 h-6" />
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl font-black text-slate-100 uppercase tracking-tight">
              Admin Command Control
            </h2>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">
              Restricted Area • The Empire
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Admin Email Address
              </label>
              <input
                required
                type="email"
                placeholder="subhu7web@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-slate-200 placeholder:text-slate-700"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Access Password
              </label>
              <input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-slate-200 placeholder:text-slate-700"
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3.5 py-2 rounded-lg font-semibold">
                ⚠️ {loginError}
              </p>
            )}

            <button
              type="submit"
              id="admin-login-submit"
              disabled={isLoggingIn}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-800 text-slate-950 font-black text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xl shadow-amber-500/10"
            >
              {isLoggingIn ? "Authorizing Access..." : "Unlock Real-time Dashboard"}
            </button>
          </form>

          <p className="text-[10px] text-slate-600 text-center mt-6">
            Only authorized personnel may access the active orders, reservations, and feedback systems.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <section id="admin-panel-section" className="py-10 bg-slate-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title with stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              ROYAL COMMAND OVERVIEW
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-none text-slate-100">
              The Empire <span className="text-amber-500">Live Control</span> Room
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-1 uppercase tracking-wider">
              Connected Session: subhu7web@gmail.com • Real-time Sync Active
            </p>
          </div>

          <button
            id="admin-panel-logout-btn"
            onClick={onAdminLogout}
            className="px-4 py-2 bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/40 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            Logout Control Session
          </button>
        </div>

        {/* Real-time Counter Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-900 p-4 rounded-2xl flex items-center gap-4">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Live Orders</span>
              <span className="text-xl font-black text-slate-200">{orders.length}</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-900 p-4 rounded-2xl flex items-center gap-4">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Bookings</span>
              <span className="text-xl font-black text-slate-200">{reservations.length}</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-900 p-4 rounded-2xl flex items-center gap-4">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Feedbacks</span>
              <span className="text-xl font-black text-slate-200">{feedbacks.length}</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-900 p-4 rounded-2xl flex items-center gap-4">
            <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Active Menu</span>
              <span className="text-xl font-black text-slate-200">{menuItems.length} items</span>
            </div>
          </div>
        </div>

        {/* Command Navigation Tabs */}
        <div className="flex border-b border-slate-850 gap-2 mb-8 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveAdminTab("orders")}
            className={`px-4 py-2.5 text-xs font-extrabold uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${
              activeAdminTab === "orders"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            📋 Live Orders ({orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length} Active)
          </button>
          <button
            onClick={() => setActiveAdminTab("reservations")}
            className={`px-4 py-2.5 text-xs font-extrabold uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${
              activeAdminTab === "reservations"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            📅 Table Reservations
          </button>
          <button
            onClick={() => setActiveAdminTab("menu")}
            className={`px-4 py-2.5 text-xs font-extrabold uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${
              activeAdminTab === "menu"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            🍽️ Menu Manager
          </button>
          <button
            onClick={() => setActiveAdminTab("feedback")}
            className={`px-4 py-2.5 text-xs font-extrabold uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${
              activeAdminTab === "feedback"
                ? "border-amber-500 text-amber-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            💬 Feedbacks Log
          </button>
        </div>

        {/* Content Tabs render */}
        <div>
          {/* TAB 1: Real-time Live Orders */}
          {activeAdminTab === "orders" && (
            <div className="space-y-6">
              {orders.length === 0 ? (
                <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-900">
                  <ShoppingBag className="w-10 h-10 text-slate-700 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-slate-300">No Orders in Queues</h3>
                  <p className="text-xs text-slate-500">Wait for guests to checkout from their carts.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      id={`admin-order-card-${order.id}`}
                      className="bg-slate-900 border border-slate-900 p-5 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-start justify-between gap-6 hover:border-slate-800 transition-colors"
                    >
                      {/* Customer & Info block */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black bg-slate-950 text-amber-400 px-3 py-1.5 rounded-lg border border-slate-850 font-mono uppercase">
                            Order: #{order.id.slice(-5)}
                          </span>
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            order.status === "Pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                            order.status === "Preparing" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                            order.status === "OutForDelivery" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                            order.status === "Completed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                            "bg-red-500/10 text-red-450 border border-red-500/20"
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-extrabold text-slate-200">{order.userName}</h4>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                            <span>{order.userEmail}</span>
                            {order.phone && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-slate-700" />
                                <span className="font-mono">{order.phone}</span>
                              </>
                            )}
                          </p>
                          {order.tableNumber && (
                            <p className="text-xs text-amber-500 font-extrabold mt-1">
                              🍽️ Dine-In: {order.tableNumber}
                            </p>
                          )}
                        </div>

                        {/* Items list */}
                        <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl max-w-lg">
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Items Ordered</span>
                          <ul className="divide-y divide-slate-900 space-y-1">
                            {order.items.map((item, idx) => (
                              <li key={idx} className="flex justify-between text-xs py-1 text-slate-300">
                                <span>
                                  <span className="font-bold text-amber-400 font-mono">{item.quantity}x</span> {item.name}
                                </span>
                                <span className="font-bold">₹{item.price * item.quantity}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="flex justify-between text-xs pt-2 mt-2 border-t border-slate-900 font-bold">
                            <span className="text-slate-400">Total Amount:</span>
                            <span className="text-amber-500">₹{order.totalAmount}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action status handlers */}
                      <div className="md:self-stretch flex flex-col justify-between items-end gap-4 border-t md:border-t-0 md:border-l border-slate-850 pt-4 md:pt-0 md:pl-6">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Payment Status</span>
                          <span className={`text-xs font-extrabold font-mono uppercase ${order.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {order.paymentStatus} via {order.paymentMethod}
                          </span>
                        </div>

                        {/* Status Updater Buttons */}
                        <div className="space-y-1.5 w-full">
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Update Status</span>
                          <div className="flex flex-wrap gap-1.5 justify-end">
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, "Preparing")}
                              disabled={order.status === "Preparing"}
                              className="px-2.5 py-1.5 bg-blue-950/40 hover:bg-blue-900/40 text-blue-400 border border-blue-500/20 rounded-lg text-[10px] font-bold transition-colors"
                            >
                              Prepare
                            </button>
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, "OutForDelivery")}
                              disabled={order.status === "OutForDelivery"}
                              className="px-2.5 py-1.5 bg-purple-950/40 hover:bg-purple-900/40 text-purple-400 border border-purple-500/20 rounded-lg text-[10px] font-bold transition-colors"
                            >
                              Dispatch
                            </button>
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, "Completed")}
                              disabled={order.status === "Completed"}
                              className="px-2.5 py-1.5 bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-bold transition-colors"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => onUpdateOrderStatus(order.id, "Cancelled")}
                              disabled={order.status === "Cancelled"}
                              className="px-2.5 py-1.5 bg-red-950/40 hover:bg-red-900/40 text-red-450 border border-red-500/20 rounded-lg text-[10px] font-bold transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Real-time Live Bookings */}
          {activeAdminTab === "reservations" && (
            <div className="space-y-6">
              {reservations.length === 0 ? (
                <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-900">
                  <Calendar className="w-10 h-10 text-slate-700 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-slate-300">No Reservations Made Yet</h3>
                  <p className="text-xs text-slate-500">Wait for users to book tables from the booking panel.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reservations.map((res) => (
                    <div
                      key={res.id}
                      id={`admin-res-card-${res.id}`}
                      className="bg-slate-900 border border-slate-900 p-5 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-800 transition-colors"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black bg-slate-950 text-amber-500 px-2.5 py-1.5 rounded-lg border border-slate-850">
                            🏢 {res.tableNumber}
                          </span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                            res.status === "Pending" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                            res.status === "Confirmed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                            res.status === "Completed" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                            "bg-red-500/10 text-red-450 border border-red-500/20"
                          }`}>
                            {res.status}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-extrabold text-slate-200">{res.userName}</h4>
                          <p className="text-[11px] text-slate-400 font-mono">
                            Email: {res.userEmail} • Phone: {res.userPhone}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-300 font-semibold bg-slate-950 p-2.5 rounded-xl border border-slate-850 inline-block">
                          <span>📅 Date: <strong className="text-amber-500 font-mono">{res.date}</strong></span>
                          <span>⏰ Time: <strong className="text-amber-500 font-mono">{res.time}</strong></span>
                          <span>👥 Guests: <strong className="text-amber-500 font-mono">{res.guests}</strong></span>
                        </div>

                        {res.specialRequests && (
                          <p className="text-xs text-slate-400 italic bg-slate-950/40 p-2 rounded-lg border border-slate-850 max-w-xl">
                            ✍️ Notes: "{res.specialRequests}"
                          </p>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="flex gap-2 border-t md:border-t-0 md:border-l border-slate-850 pt-4 md:pt-0 md:pl-6">
                        <button
                          onClick={() => onUpdateReservationStatus(res.id, "Confirmed")}
                          disabled={res.status === "Confirmed"}
                          className="px-4 py-2 bg-emerald-950/40 hover:bg-emerald-900/40 disabled:bg-slate-800 disabled:text-slate-600 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => onUpdateReservationStatus(res.id, "Completed")}
                          disabled={res.status === "Completed"}
                          className="px-4 py-2 bg-blue-950/40 hover:bg-blue-900/40 disabled:bg-slate-800 disabled:text-slate-600 text-blue-400 border border-blue-500/20 rounded-xl text-xs font-bold transition-colors"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => onUpdateReservationStatus(res.id, "Cancelled")}
                          disabled={res.status === "Cancelled"}
                          className="px-4 py-2 bg-red-950/40 hover:bg-red-900/40 disabled:bg-slate-800 disabled:text-slate-600 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Menu management editor */}
          {activeAdminTab === "menu" && (
            <div className="space-y-8">
              {/* Add New Item Form */}
              <form onSubmit={handleCreateMenuItem} className="bg-slate-900 border border-slate-900 p-6 rounded-3xl space-y-4">
                <h3 className="text-base font-extrabold text-slate-200 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-amber-500" />
                  Add New Imperial Menu Item
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Item Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Empire Garlic Naan"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Price in INR (₹)
                    </label>
                    <input
                      required
                      type="number"
                      placeholder="e.g. 120"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Menu Category
                    </label>
                    <select
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-slate-200"
                    >
                      <option value="Starters">Starters</option>
                      <option value="Main Course">Main Course</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Drinks & Mocktails">Drinks & Mocktails</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://unsplash.com/... (optional)"
                      value={newItemImage}
                      onChange={(e) => setNewItemImage(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-slate-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Prep Time
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 15 min"
                        value={newItemPrep}
                        onChange={(e) => setNewItemPrep(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-slate-200"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Food Preference
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setNewItemVeg(true)}
                          className={`flex-grow py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                            newItemVeg
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : "bg-slate-950 text-slate-400 border border-slate-850"
                          }`}
                        >
                          Veg
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewItemVeg(false)}
                          className={`flex-grow py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                            !newItemVeg
                              ? "bg-red-500/10 text-red-400 border border-red-500/30"
                              : "bg-slate-950 text-slate-400 border border-slate-850"
                          }`}
                        >
                          Non-Veg
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Description
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Short description of taste, ingredients or portion size..."
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-slate-200 placeholder:text-slate-700 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl flex items-center gap-1 transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  Save to Empire Menu
                </button>
              </form>

              {/* Existing Items Table with Delete */}
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-4">
                  Active Menu Items ({menuItems.length})
                </span>

                <div className="bg-slate-900 border border-slate-900 rounded-3xl overflow-x-auto shadow-xl">
                  <table className="w-full min-w-[600px] text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-850">
                      <tr>
                        <th className="px-5 py-4">Dish</th>
                        <th className="px-5 py-4">Category</th>
                        <th className="px-5 py-4">Type</th>
                        <th className="px-5 py-4">Price</th>
                        <th className="px-5 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {menuItems.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                          <td className="px-5 py-3.5 flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-8 h-8 object-cover rounded-md border border-slate-800 flex-shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <strong className="text-slate-200 block text-xs">{item.name}</strong>
                              <span className="text-[10px] text-slate-500 max-w-xs truncate block">{item.description}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-slate-400 font-semibold">{item.category}</td>
                          <td className="px-5 py-3.5">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${item.isVegetarian ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/15 text-red-400 border border-red-500/20'}`}>
                              {item.isVegetarian ? 'VEG' : 'NON-VEG'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 font-bold text-amber-500">₹{item.price}</td>
                          <td className="px-5 py-3.5 text-right">
                            <button
                              id={`admin-delete-menu-${item.id}`}
                              onClick={() => {
                                if (confirm(`Delete "${item.name}" from active menu?`)) {
                                  onDeleteMenuItem(item.id);
                                }
                              }}
                              className="text-slate-500 hover:text-red-400 p-1 rounded hover:bg-slate-950 transition-colors"
                              title="Delete Item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Feedbacks list log */}
          {activeAdminTab === "feedback" && (
            <div className="space-y-6">
              {feedbacks.length === 0 ? (
                <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-900">
                  <MessageSquare className="w-10 h-10 text-slate-700 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-slate-300">No Feedbacks Logged Yet</h3>
                  <p className="text-xs text-slate-500">Wait for guests to submit reviews.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {feedbacks.map((f) => (
                    <div
                      key={f.id}
                      className="bg-slate-900 border border-slate-900 p-5 rounded-2xl flex gap-4 items-start relative hover:border-slate-850 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold flex-shrink-0">
                        {f.userName.charAt(0).toUpperCase()}
                      </div>

                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start gap-1">
                          <div>
                            <h4 className="text-xs font-bold text-slate-200">{f.userName}</h4>
                            <span className="text-[10px] text-slate-500 block font-mono">{f.userEmail}</span>
                          </div>
                          
                          {/* Stars */}
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  star <= f.rating
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-slate-800"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 mt-2 italic bg-slate-950/40 p-3 rounded-lg border border-slate-850 leading-relaxed">
                          "{f.comment}"
                        </p>

                        <span className="text-[10px] text-slate-500 mt-2 block font-mono">
                          Received: {new Date(f.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
