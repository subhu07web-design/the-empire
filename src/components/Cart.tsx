import React, { useState, useEffect } from "react";
import { X, Trash2, ShoppingBag, CreditCard, ChevronRight, User, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CartItem, MenuItem } from "../types";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (menuId: string, delta: number) => void;
  onRemoveItem: (menuId: string) => void;
  onPlaceOrder: (orderDetails: {
    userName: string;
    userEmail: string;
    phone: string;
    tableNumber?: string;
    paymentMethod: 'Cash' | 'Card' | 'UPI';
    deliveryMethod: 'DineIn' | 'Delivery' | 'Takeaway';
    address?: string;
  }) => void;
  defaultUserEmail?: string;
}

export default function Cart({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  defaultUserEmail = "",
}: CartProps) {
  const [step, setStep] = useState<1 | 2>(1); // 1 = Cart details, 2 = Checkout details
  const [userName, setUserName] = useState<string>(() => localStorage.getItem("empire_userName") || "");
  const [userEmail, setUserEmail] = useState<string>(() => defaultUserEmail || localStorage.getItem("empire_userEmail") || "");
  const [phone, setPhone] = useState<string>(() => localStorage.getItem("empire_userPhone") || "");
  const [tableNumber, setTableNumber] = useState<string>("");
  const [deliveryMethod, setDeliveryMethod] = useState<'DineIn' | 'Delivery' | 'Takeaway'>("DineIn");
  const [address, setAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'UPI'>("UPI");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (defaultUserEmail) {
      setUserEmail(defaultUserEmail);
    }
  }, [defaultUserEmail]);

  useEffect(() => {
    const savedName = localStorage.getItem("empire_userName");
    if (savedName && !userName) {
      setUserName(savedName);
    }
    const savedPhone = localStorage.getItem("empire_userPhone");
    if (savedPhone && !phone) {
      setPhone(savedPhone);
    }
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
  const serviceCharge = subtotal > 0 ? 30 : 0;
  const gst = Math.round(subtotal * 0.05); // 5% GST
  const total = subtotal + serviceCharge + gst;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail || !phone) return;
    if (deliveryMethod === "DineIn" && !tableNumber) return;
    if (deliveryMethod === "Delivery" && !address) return;

    setIsSubmitting(true);
    try {
      await onPlaceOrder({
        userName,
        userEmail,
        phone,
        tableNumber: deliveryMethod === "DineIn" ? tableNumber : undefined,
        paymentMethod,
        deliveryMethod,
        address: deliveryMethod === "Delivery" ? address : undefined,
      });
      // Save details to localStorage
      localStorage.setItem("empire_userName", userName);
      localStorage.setItem("empire_userEmail", userEmail);
      localStorage.setItem("empire_userPhone", phone);

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setStep(1);
        onClose();
      }, 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            id="cart-backdrop"
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            id="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col justify-between text-white"
          >
            {/* Header */}
            <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-black tracking-tight">Your Imperial Cart</h2>
              </div>
              <button
                id="close-cart-btn"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success Screen Overlay */}
            {isSuccess ? (
              <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-slate-950">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring" }}
                  className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500"
                >
                  <CheckCircle2 className="w-16 h-16 stroke-[1.5]" />
                </motion.div>
                <h3 className="text-xl font-extrabold text-slate-100">Order Placed Successfully!</h3>
                <p className="text-xs text-emerald-400 mt-1 uppercase font-bold tracking-widest">
                  The Empire is preparing your feast
                </p>
                <p className="text-sm text-slate-400 mt-4 max-w-xs leading-relaxed">
                  Your real-time order status is now active. Admins are processing your order right now.
                </p>
                <div className="w-full max-w-xs bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl mt-6 text-left">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mb-1">
                    Receipt Details
                  </span>
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Amount Paid:</span>
                    <span className="font-bold text-amber-500">₹{total}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-300 mt-1">
                    <span>Payment:</span>
                    <span className="font-bold text-slate-100">{paymentMethod}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-300 mt-1">
                    <span>Type:</span>
                    <span className="font-bold text-slate-100">{deliveryMethod}</span>
                  </div>
                </div>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center p-8 text-center bg-slate-900/50">
                <ShoppingBag className="w-12 h-12 text-slate-700 mb-3" />
                <h3 className="text-base font-bold text-slate-300">Your Cart is Empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                  Add some tasty starters or rich main courses from our Menu to begin your culinary experience.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-all hover:bg-amber-600 shadow-lg shadow-amber-500/10"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              /* Content Area depending on Step */
              <div className="flex-grow overflow-y-auto p-5">
                {step === 1 ? (
                  /* Step 1: Cart Items Listing */
                  <div className="space-y-4">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">
                      Selected Items ({cartItems.length})
                    </span>

                    <div className="divide-y divide-slate-800/50">
                      {cartItems.map((item) => (
                        <div key={item.menuItem.id} className="py-3 flex gap-3 first:pt-0 last:pb-0">
                          <img
                            src={item.menuItem.image}
                            alt={item.menuItem.name}
                            className="w-14 h-14 object-cover rounded-lg flex-shrink-0 border border-slate-800"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-grow min-w-0">
                            <div className="flex justify-between items-start gap-1">
                              <h4 className="text-xs font-bold text-slate-200 truncate">{item.menuItem.name}</h4>
                              <span className="text-xs font-black text-amber-500">₹{item.menuItem.price * item.quantity}</span>
                            </div>
                            {item.customInstructions && (
                              <p className="text-[10px] text-amber-400 bg-amber-500/5 border border-amber-500/10 rounded px-1.5 py-0.5 mt-1 inline-block">
                                ✍️ {item.customInstructions}
                              </p>
                            )}

                            {/* Quantity controller and Delete */}
                            <div className="flex items-center justify-between mt-2.5">
                              <div className="flex items-center border border-slate-800 bg-slate-950 rounded-md p-0.5">
                                <button
                                  onClick={() => onUpdateQuantity(item.menuItem.id, -1)}
                                  className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white rounded"
                                >
                                  -
                                </button>
                                <span className="w-6 text-center text-[11px] font-bold text-slate-200">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onUpdateQuantity(item.menuItem.id, 1)}
                                  className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white rounded"
                                >
                                  +
                                </button>
                              </div>

                              <button
                                onClick={() => onRemoveItem(item.menuItem.id)}
                                className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                                title="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Step 2: Checkout Form details */
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        CHECKOUT DETAILS
                      </span>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-xs text-amber-500 hover:underline"
                      >
                        Edit Items
                      </button>
                    </div>

                    {/* Method Selector */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                      {(["DineIn", "Delivery", "Takeaway"] as const).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setDeliveryMethod(method)}
                          className={`py-2 text-[10px] font-bold rounded-lg uppercase transition-all ${
                            deliveryMethod === method
                              ? "bg-amber-500 text-slate-950 font-black"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          {method === "DineIn" ? "Table" : method}
                        </button>
                      ))}
                    </div>

                    {/* Input Fields */}
                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                          <input
                            required
                            type="text"
                            placeholder="John Doe"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-amber-500 text-slate-200 placeholder:text-slate-600"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Email
                          </label>
                          <input
                            required
                            type="email"
                            placeholder="john@example.com"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-amber-500 text-slate-200 placeholder:text-slate-600"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Phone Number
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
                            <input
                              required
                              type="tel"
                              placeholder="+91 XXXXX XXXXX"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-amber-500 text-slate-200 placeholder:text-slate-600"
                            />
                          </div>
                        </div>
                      </div>

                      {/* DineIn Specific */}
                      {deliveryMethod === "DineIn" && (
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Table Number
                          </label>
                          <select
                            required
                            value={tableNumber}
                            onChange={(e) => setTableNumber(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-amber-500 text-slate-200"
                          >
                            <option value="">Select Table</option>
                            <option value="Table 1 (2 Seater)">Table 1 (2 Seater)</option>
                            <option value="Table 2 (2 Seater)">Table 2 (2 Seater)</option>
                            <option value="Table 3 (4 Seater)">Table 3 (4 Seater)</option>
                            <option value="Table 4 (4 Seater)">Table 4 (4 Seater)</option>
                            <option value="Table 5 (6 Seater Royal)">Table 5 (6 Seater Royal)</option>
                            <option value="VIP Lounge Table A">VIP Lounge Table A</option>
                          </select>
                        </div>
                      )}

                      {/* Delivery Specific */}
                      {deliveryMethod === "Delivery" && (
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            Delivery Address
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 text-slate-500 w-4 h-4" />
                            <textarea
                              required
                              rows={2}
                              placeholder="Apartment, Street Name, Landmark, Pin code"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-amber-500 text-slate-200 placeholder:text-slate-600 resize-none"
                            />
                          </div>
                        </div>
                      )}

                      {/* Payment Method Selector */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Payment Mode
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(["UPI", "Card", "Cash"] as const).map((method) => (
                            <button
                              key={method}
                              type="button"
                              onClick={() => setPaymentMethod(method)}
                              className={`py-2 px-1 border rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                                paymentMethod === method
                                  ? "bg-amber-500/10 border-amber-500 text-amber-400"
                                  : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                              }`}
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              {method === "Cash" ? "Cash/POD" : method}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Bottom Bill Summary and Submit Bar */}
            {!isSuccess && (
              <div className="p-5 bg-slate-950 border-t border-slate-800 space-y-4">
                {/* Cost Breakdown */}
                <div className="space-y-1.5 border-b border-slate-800/80 pb-3">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Subtotal:</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Service Charge:</span>
                    <span>₹{serviceCharge}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>GST (5%):</span>
                    <span>₹{gst}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-100 font-extrabold pt-1">
                    <span>Grand Total:</span>
                    <span className="text-amber-500 text-base">₹{total}</span>
                  </div>
                </div>

                {/* Submitting/Button */}
                {step === 1 ? (
                  <button
                    id="cart-next-btn"
                    onClick={() => setStep(2)}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xl shadow-amber-500/15"
                  >
                    Proceed to Checkout
                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                ) : (
                  <button
                    id="cart-submit-btn"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !userName || !userEmail || !phone || (deliveryMethod === "DineIn" && !tableNumber) || (deliveryMethod === "Delivery" && !address)}
                    className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-extrabold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xl shadow-amber-500/15"
                  >
                    {isSubmitting ? "Processing Payment..." : `Pay ₹${total} & Place Order`}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
