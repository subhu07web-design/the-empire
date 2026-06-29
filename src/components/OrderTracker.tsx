import React, { useState, useEffect } from "react";
import { Search, ShoppingBag, CheckCircle2, Clock, Truck, ChefHat, XCircle, Calendar, ArrowRight, ShieldCheck, Mail, Phone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Order, Reservation, OrderStatus } from "../types";

interface OrderTrackerProps {
  orders: Order[];
  reservations: Reservation[];
  defaultUserEmail?: string;
  onOpenLoginModal?: () => void;
}

export default function OrderTracker({
  orders,
  reservations,
  defaultUserEmail = "",
  onOpenLoginModal,
}: OrderTrackerProps) {
  const [searchEmail, setSearchEmail] = useState(() => {
    return defaultUserEmail || localStorage.getItem("empire_userEmail") || "";
  });
  const [activeSubTab, setActiveSubTab] = useState<"orders" | "reservations">("orders");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Keep search email in sync with signed in user email
  useEffect(() => {
    if (defaultUserEmail) {
      setSearchEmail(defaultUserEmail);
    }
  }, [defaultUserEmail]);

  // Filter orders and reservations matching email
  const trimmedEmail = searchEmail.trim().toLowerCase();
  const filteredOrders = orders
    .filter((order) => order.userEmail && order.userEmail.toLowerCase().trim() === trimmedEmail)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const filteredReservations = reservations
    .filter((res) => res.userEmail && res.userEmail.toLowerCase().trim() === trimmedEmail)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Auto-select first order if none selected
  useEffect(() => {
    if (filteredOrders.length > 0 && !selectedOrderId) {
      setSelectedOrderId(filteredOrders[0].id);
    }
  }, [filteredOrders, selectedOrderId]);

  const getStatusStep = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return 1;
      case "Preparing":
        return 2;
      case "OutForDelivery":
        return 3;
      case "Completed":
        return 4;
      default:
        return 0; // Cancelled
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "Preparing":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "OutForDelivery":
        return "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";
      case "Completed":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "Cancelled":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      default:
        return "text-slate-400 bg-slate-500/10 border-slate-500/20";
    }
  };

  const getStatusProgressWidth = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return "w-[12%]";
      case "Preparing":
        return "w-[50%]";
      case "OutForDelivery":
        return "w-[85%]";
      case "Completed":
        return "w-[100%]";
      default:
        return "w-0";
    }
  };

  const selectedOrder = filteredOrders.find((o) => o.id === selectedOrderId) || filteredOrders[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Title Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
          Live Tracking Hub
        </h1>
        <p className="text-slate-400 mt-2 text-sm md:text-base max-w-xl mx-auto">
          Monitor your royal culinary preparations and bookings in real-time.
        </p>
      </div>

      {/* Email Identification Section */}
      <div className="max-w-xl mx-auto mb-10">
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800/80 shadow-2xl">
          <label className="block text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">
            Enter your Email to Load History
          </label>
          <div className="relative">
            <input
              type="email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="e.g. customer@example.com"
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-xl px-4 py-3 pl-11 text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all font-medium"
            />
            <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
          {!defaultUserEmail && (
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>Not logged in? Register or Sign In to sync across devices.</span>
              {onOpenLoginModal && (
                <button
                  onClick={onOpenLoginModal}
                  className="text-amber-400 hover:text-amber-300 font-semibold underline transition-all"
                >
                  Sign In Now
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Inner Hub Grid */}
      {trimmedEmail ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Side Tabs and Left List panel (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Tab switchers */}
            <div className="flex bg-slate-900/40 p-1.5 rounded-xl border border-slate-800/60">
              <button
                onClick={() => setActiveSubTab("orders")}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  activeSubTab === "orders"
                    ? "bg-amber-500 text-slate-950 shadow-lg font-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                Orders ({filteredOrders.length})
              </button>
              <button
                onClick={() => setActiveSubTab("reservations")}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  activeSubTab === "reservations"
                    ? "bg-amber-500 text-slate-950 shadow-lg font-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Calendar className="w-4 h-4" />
                Bookings ({filteredReservations.length})
              </button>
            </div>

            {/* List panel */}
            <div className="bg-slate-900/20 rounded-2xl border border-slate-800/50 max-h-[500px] overflow-y-auto custom-scrollbar p-3 space-y-2">
              {activeSubTab === "orders" ? (
                filteredOrders.length === 0 ? (
                  <div className="text-center py-10 px-4">
                    <ShoppingBag className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm font-medium">No order records found.</p>
                    <p className="text-xs text-slate-600 mt-1">Place your first premium order today!</p>
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <button
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col gap-2 ${
                        selectedOrder?.id === order.id
                          ? "bg-slate-850 border-amber-500/40 shadow-xl"
                          : "bg-slate-900/40 border-slate-800/60 hover:bg-slate-900/80 hover:border-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-400">
                          #{order.id.slice(-6).toUpperCase()}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 line-clamp-1">
                        {order.items.map((it) => `${it.quantity}x ${it.name}`).join(", ")}
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/50 mt-1">
                        <span className="text-slate-500">
                          {new Date(order.timestamp).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="font-bold text-amber-400">₹{order.totalAmount}</span>
                      </div>
                    </button>
                  ))
                )
              ) : filteredReservations.length === 0 ? (
                <div className="text-center py-10 px-4">
                  <Calendar className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm font-medium">No table reservations found.</p>
                  <p className="text-xs text-slate-600 mt-1">Book a premium table in the booking tab!</p>
                </div>
              ) : (
                filteredReservations.map((res) => (
                  <div
                    key={res.id}
                    className="p-4 rounded-xl border bg-slate-900/40 border-slate-800/60 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-amber-500" />
                        <span>Res #{res.id.slice(-6).toUpperCase()}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${
                        res.status === "Confirmed"
                          ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                          : res.status === "Cancelled"
                          ? "text-red-400 bg-red-500/10 border-red-500/20"
                          : "text-blue-400 bg-blue-500/10 border-blue-500/20"
                      }`}>
                        {res.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 mt-1">
                      <div>
                        <span className="text-slate-500 block">Date & Time</span>
                        <span className="font-medium text-slate-200">{res.date} at {res.time}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Guests & Table</span>
                        <span className="font-medium text-slate-200">{res.guests} Guests (T-{res.tableNumber})</span>
                      </div>
                    </div>

                    {res.specialRequests && (
                      <p className="text-[11px] text-slate-500 bg-slate-950 p-2 rounded-lg border border-slate-800/40 mt-1 italic">
                        "{res.specialRequests}"
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Detailed panel (8 cols) */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {activeSubTab === "orders" && selectedOrder ? (
                <motion.div
                  key={selectedOrder.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-slate-900/40 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-slate-800/60 shadow-2xl space-y-8"
                >
                  {/* Status header with live pulse */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md">
                          ORDER ID: #{selectedOrder.id.toUpperCase()}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Real-time Connection Stable</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-slate-100 mt-2">
                        Placed on {new Date(selectedOrder.timestamp).toLocaleDateString(undefined, {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-500 font-medium">Status:</span>
                      <span className={`text-xs px-3.5 py-1.5 rounded-xl border font-bold uppercase tracking-wider ${getStatusColor(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                  </div>

                  {/* STEPPER METRIC BAR */}
                  {selectedOrder.status === "Cancelled" ? (
                    <div className="bg-red-950/20 border border-red-500/20 p-5 rounded-2xl flex items-center gap-4">
                      <XCircle className="w-10 h-10 text-red-500 shrink-0" />
                      <div>
                        <h4 className="font-bold text-red-400">Order Cancelled</h4>
                        <p className="text-slate-400 text-xs mt-0.5">
                          This order was cancelled. If you paid via UPI or Card, refunds are initiated immediately to your source account.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative">
                        {/* Progress Background bar */}
                        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 rounded-full z-0" />
                        {/* Interactive dynamic status highlight bar */}
                        <div className={`absolute top-1/2 left-0 h-1 bg-gradient-to-r from-amber-500 to-amber-300 -translate-y-1/2 rounded-full z-0 transition-all duration-1000 ${getStatusProgressWidth(selectedOrder.status)}`} />

                        {/* Stepper bubbles */}
                        <div className="relative z-10 flex justify-between">
                          {[
                            { stepNum: 1, label: "Placed", icon: CheckCircle2, statusVal: "Pending" },
                            { stepNum: 2, label: "Preparing", icon: ChefHat, statusVal: "Preparing" },
                            { stepNum: 3, label: "Dispatch", icon: Truck, statusVal: "OutForDelivery" },
                            { stepNum: 4, label: "Delivered", icon: CheckCircle2, statusVal: "Completed" },
                          ].map((node) => {
                            const currentStep = getStatusStep(selectedOrder.status);
                            const isCompleted = currentStep >= node.stepNum;
                            const isActive = currentStep === node.stepNum;
                            const IconComp = node.icon;

                            return (
                              <div key={node.stepNum} className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                                  isActive
                                    ? "bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 scale-110"
                                    : isCompleted
                                    ? "bg-emerald-500 text-slate-950"
                                    : "bg-slate-900 border-2 border-slate-800 text-slate-500"
                                }`}>
                                  <IconComp className="w-5 h-5" />
                                </div>
                                <span className={`text-[10px] md:text-xs font-bold uppercase mt-2 tracking-wider ${
                                  isActive ? "text-amber-400" : isCompleted ? "text-emerald-400" : "text-slate-500"
                                }`}>
                                  {node.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Items Ordered List summary */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Order Summary
                    </h4>
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850/80 divide-y divide-slate-900">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            <span className="text-amber-500 font-bold text-sm bg-amber-500/10 px-2 py-0.5 rounded">
                              {item.quantity}x
                            </span>
                            <span className="text-slate-200 text-sm font-semibold">{item.name}</span>
                          </div>
                          <span className="text-slate-300 font-medium text-sm">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional info footer (Table #, Delivery status, Payment) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                    <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">
                        Dining Mode
                      </span>
                      <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-500" />
                        {selectedOrder.tableNumber ? `Dine-In (Table ${selectedOrder.tableNumber})` : "Delivery / Takeaway"}
                      </span>
                    </div>

                    <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">
                        Payment Status
                      </span>
                      <span className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${selectedOrder.paymentStatus === "Paid" ? "bg-emerald-500" : "bg-amber-500"}`} />
                        {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})
                      </span>
                    </div>

                    <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 md:col-span-2 lg:col-span-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">
                        Primary Contact
                      </span>
                      <span className="text-sm font-semibold text-slate-200 truncate block">
                        {selectedOrder.phone || selectedOrder.userName || "Customer Profile"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : activeSubTab === "orders" ? (
                <div className="bg-slate-900/10 border border-dashed border-slate-800 rounded-3xl p-16 text-center">
                  <ShoppingBag className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                  <h3 className="text-slate-400 font-bold text-lg">Select an Order from the sidebar</h3>
                  <p className="text-slate-500 text-sm mt-1">
                    Select any order to view detailed real-time preparation steps.
                  </p>
                </div>
              ) : (
                <div className="bg-slate-900/10 border border-dashed border-slate-800 rounded-3xl p-16 text-center">
                  <Calendar className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                  <h3 className="text-slate-400 font-bold text-lg">Live Bookings Status</h3>
                  <p className="text-slate-500 text-sm mt-1">
                    All your reservations are synchronized live. Watch status change when the host confirms!
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900/20 border border-slate-800/60 rounded-3xl p-8 max-w-xl mx-auto shadow-xl">
          <Mail className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <h3 className="text-slate-300 font-bold text-lg">No Email Specified</h3>
          <p className="text-slate-500 text-sm mt-1 mb-6">
            Please type your email above or sign in to verify your real-time orders status.
          </p>
        </div>
      )}
    </div>
  );
}
