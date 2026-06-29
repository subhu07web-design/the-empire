import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot, addDoc, updateDoc, doc, getDocs, deleteDoc, orderBy } from "firebase/firestore";
import { db, OperationType, handleFirestoreError } from "./firebase";
import { INITIAL_MENU } from "./data/menu";
import { MenuItem, CartItem, Order, Reservation, Feedback, AppNotification, OrderStatus, ReservationStatus } from "./types";
import Header from "./components/Header";
import MenuSection from "./components/MenuSection";
import TableBooking from "./components/TableBooking";
import FeedbackSection from "./components/Feedback";
import AdminPanel from "./components/AdminPanel";
import Cart from "./components/Cart";
import FloatingButtons from "./components/FloatingButtons";
import { NotificationBanner } from "./components/NotificationCenter";
import { LogIn, User, MapPin, Phone, Mail, Clock, ShieldCheck, Utensils, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Navigation tabs: "menu" | "booking" | "feedback" | "admin"
  const [activeTab, setActiveTab] = useState<string>("menu");
  
  // Real-time Firestore States
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  
  // Local active state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  // Mobile Notification Banner simulation
  const [activeNotification, setActiveNotification] = useState<AppNotification | null>(null);

  // Authentication/Identity simulation
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginName, setLoginName] = useState("");

  // Contact details
  const empirePhone = "+919999900000";
  const empireWhatsApp = "+919999900000";

  // 1. Synchronize Menu Items from Firestore with Robust Seeding & De-duplication
  useEffect(() => {
    let isSeeding = false;

    const seedMenuIfNeeded = async () => {
      if (isSeeding) return;
      isSeeding = true;
      try {
        const menuColl = collection(db, "menu");
        const snapshot = await getDocs(menuColl);
        const existingNames = new Set<string>();
        
        snapshot.forEach((docRef) => {
          const data = docRef.data();
          if (data && data.name) {
            existingNames.add(data.name.toLowerCase());
          }
        });

        // Delete any duplicate seeded items in Firestore to clean up the database
        const seen = new Set<string>();
        const toDelete: string[] = [];
        snapshot.forEach((docRef) => {
          const data = docRef.data();
          const nameLower = (data.name || "").toLowerCase();
          if (seen.has(nameLower)) {
            toDelete.push(docRef.id);
          } else {
            seen.add(nameLower);
          }
        });

        for (const docId of toDelete) {
          try {
            await deleteDoc(doc(db, "menu", docId));
          } catch (e) {
            console.error("Error deleting duplicate document:", e);
          }
        }

        // Add any missing menu items from INITIAL_MENU
        for (const item of INITIAL_MENU) {
          if (!seen.has(item.name.toLowerCase())) {
            await addDoc(menuColl, item);
          }
        }
      } catch (error) {
        console.error("Error seeding menu:", error);
      } finally {
        isSeeding = false;
      }
    };

    seedMenuIfNeeded();

    // Setup the active live listener with deduplicated state values
    const q = query(collection(db, "menu"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const itemsList: MenuItem[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Overwrite nested ID with Firestore doc.id to guarantee uniqueness and compatibility with admin deletion
        itemsList.push({ ...data, id: doc.id } as MenuItem);
      });

      // Front-end state safeguard de-duplication
      const uniqueItems: MenuItem[] = [];
      const seenIds = new Set<string>();
      itemsList.forEach((item) => {
        if (!seenIds.has(item.id)) {
          seenIds.add(item.id);
          uniqueItems.push(item);
        }
      });

      setMenuItems(uniqueItems);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "menu");
    });

    return () => unsubscribe();
  }, []);

  // 2. Synchronize Orders in Real Time
  useEffect(() => {
    const q = query(collection(db, "orders"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersList: Order[] = [];
      snapshot.forEach((doc) => {
        ordersList.push({ id: doc.id, ...doc.data() } as Order);
      });
      // Sort orders by timestamp descending safely
      ordersList.sort((a, b) => {
        const timeA = a.timestamp?.seconds ? a.timestamp.seconds * 1000 : new Date(a.timestamp).getTime();
        const timeB = b.timestamp?.seconds ? b.timestamp.seconds * 1000 : new Date(b.timestamp).getTime();
        return timeB - timeA;
      });
      
      // Real-time Push Notification trigger logic for User/Customer when Order Status changes!
      if (orders.length > 0 && ordersList.length > 0) {
        ordersList.forEach((newOrder) => {
          const oldOrder = orders.find((o) => o.id === newOrder.id);
          if (oldOrder && oldOrder.status !== newOrder.status) {
            triggerNotification(
              "order",
              `Order Status Updated!`,
              `Your order #${newOrder.id.slice(-5)} is now [${newOrder.status}].`
            );
          }
        });
      }

      setOrders(ordersList);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "orders");
    });
    return () => unsubscribe();
  }, [orders]);

  // 3. Synchronize Table Reservations in Real Time
  useEffect(() => {
    const q = query(collection(db, "reservations"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const resList: Reservation[] = [];
      snapshot.forEach((doc) => {
        resList.push({ id: doc.id, ...doc.data() } as Reservation);
      });
      // Sort descending safely
      resList.sort((a, b) => {
        const timeA = a.timestamp?.seconds ? a.timestamp.seconds * 1000 : new Date(a.timestamp).getTime();
        const timeB = b.timestamp?.seconds ? b.timestamp.seconds * 1000 : new Date(b.timestamp).getTime();
        return timeB - timeA;
      });

      // Real-time notification trigger when Reservation Status changes!
      if (reservations.length > 0 && resList.length > 0) {
        resList.forEach((newRes) => {
          const oldRes = reservations.find((r) => r.id === newRes.id);
          if (oldRes && oldRes.status !== newRes.status) {
            triggerNotification(
              "booking",
              `Table Reservation Confirmed!`,
              `Your table reservation for ${newRes.tableNumber} is now [${newRes.status}].`
            );
          }
        });
      }

      setReservations(resList);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "reservations");
    });
    return () => unsubscribe();
  }, [reservations]);

  // 4. Synchronize Feedback Logs in Real Time
  useEffect(() => {
    const q = query(collection(db, "feedbacks"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const feedbackList: Feedback[] = [];
      snapshot.forEach((doc) => {
        feedbackList.push({ id: doc.id, ...doc.data() } as Feedback);
      });
      // Sort descending safely
      feedbackList.sort((a, b) => {
        const timeA = a.timestamp?.seconds ? a.timestamp.seconds * 1000 : new Date(a.timestamp).getTime();
        const timeB = b.timestamp?.seconds ? b.timestamp.seconds * 1000 : new Date(b.timestamp).getTime();
        return timeB - timeA;
      });
      setFeedbacks(feedbackList);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "feedbacks");
    });
    return () => unsubscribe();
  }, []);

  // Helpers to push custom push-style notifications (In-App Simulation + browser Notification API support)
  const triggerNotification = (type: 'order' | 'booking' | 'feedback' | 'system', title: string, body: string) => {
    const newNotif: AppNotification = {
      id: Math.random().toString(36).slice(2, 9),
      title,
      body,
      timestamp: Date.now(),
      read: false,
      type
    };

    setNotifications((prev) => [newNotif, ...prev]);
    setActiveNotification(newNotif);

    // native browser notification fallback
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body });
    }
  };

  // Ask for notification permission on start
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Cart operations
  const handleAddToCart = (item: MenuItem, qty: number, instructions?: string) => {
    const existing = cartItems.find((c) => c.menuItem.id === item.id);
    if (existing) {
      setCartItems(
        cartItems.map((c) =>
          c.menuItem.id === item.id
            ? { ...c, quantity: c.quantity + qty, customInstructions: instructions || c.customInstructions }
            : c
        )
      );
    } else {
      setCartItems([...cartItems, { menuItem: item, quantity: qty, customInstructions: instructions }]);
    }
    
    // Slide down push notification for cart add
    triggerNotification(
      "system",
      "Item Added to Cart",
      `${qty}x ${item.name} added successfully!`
    );
  };

  const handleUpdateCartQuantity = (menuId: string, delta: number) => {
    setCartItems(
      cartItems
        .map((c) => (c.menuItem.id === menuId ? { ...c, quantity: Math.max(1, c.quantity + delta) } : c))
    );
  };

  const handleRemoveCartItem = (menuId: string) => {
    const item = cartItems.find((c) => c.menuItem.id === menuId);
    setCartItems(cartItems.filter((c) => c.menuItem.id !== menuId));
    if (item) {
      triggerNotification(
        "system",
        "Item Removed",
        `${item.menuItem.name} removed from your cart.`
      );
    }
  };

  // Submit Order logic to Firestore
  const handlePlaceOrder = async (details: {
    userName: string;
    userEmail: string;
    phone: string;
    tableNumber?: string;
    paymentMethod: 'Cash' | 'Card' | 'UPI';
    deliveryMethod: 'DineIn' | 'Delivery' | 'Takeaway';
    address?: string;
  }) => {
    // Save user identity locally if not logged in
    if (!userEmail) {
      setUserEmail(details.userEmail);
    }

    const orderPayload = {
      userId: userEmail || "guest_" + Math.random().toString(36).slice(2, 9),
      userName: details.userName,
      userEmail: details.userEmail,
      phone: details.phone,
      items: cartItems.map((c) => ({
        id: c.menuItem.id,
        name: c.menuItem.name,
        price: c.menuItem.price,
        quantity: c.quantity,
      })),
      totalAmount: cartItems.reduce((acc, c) => acc + c.menuItem.price * c.quantity, 0),
      status: "Pending" as OrderStatus,
      timestamp: new Date().toISOString(),
      tableNumber: details.tableNumber || "",
      paymentMethod: details.paymentMethod,
      paymentStatus: details.paymentMethod === "UPI" ? "Paid" : "Pending" as const,
    };

    try {
      // Add doc to Firestore real-time collection
      const docRef = await addDoc(collection(db, "orders"), orderPayload);

      // Clean cart
      setCartItems([]);

      // Push Notification
      triggerNotification(
        "order",
        "New Order Placed!",
        `Your order #${docRef.id.slice(-5)} total ₹${orderPayload.totalAmount} is placed successfully!`
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "orders");
    }
  };

  // Submit Booking Table logic to Firestore
  const handleBookTable = async (details: {
    userName: string;
    userEmail: string;
    userPhone: string;
    date: string;
    time: string;
    guests: number;
    tableNumber: string;
    specialRequests?: string;
  }) => {
    if (!userEmail) {
      setUserEmail(details.userEmail);
    }

    const reservationPayload = {
      userId: userEmail || "guest_" + Math.random().toString(36).slice(2, 9),
      userName: details.userName,
      userEmail: details.userEmail,
      userPhone: details.userPhone,
      date: details.date,
      time: details.time,
      guests: details.guests,
      tableNumber: details.tableNumber,
      status: "Pending" as ReservationStatus,
      timestamp: new Date().toISOString(),
      specialRequests: details.specialRequests || "",
    };

    try {
      await addDoc(collection(db, "reservations"), reservationPayload);

      // Push Notification
      triggerNotification(
        "booking",
        "Table Booking Requested",
        `Reserved ${details.tableNumber} for ${details.guests} guests on ${details.date} at ${details.time}.`
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "reservations");
    }
  };

  // Submit Feedback Review logic to Firestore
  const handleAddFeedback = async (details: {
    userName: string;
    userEmail: string;
    rating: number;
    comment: string;
  }) => {
    if (!userEmail) {
      setUserEmail(details.userEmail);
    }

    const feedbackPayload = {
      userId: userEmail || "guest_" + Math.random().toString(36).slice(2, 9),
      userName: details.userName,
      userEmail: details.userEmail,
      rating: details.rating,
      comment: details.comment,
      timestamp: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, "feedbacks"), feedbackPayload);

      triggerNotification(
        "feedback",
        "Review Shared",
        `Thank you ${details.userName}! Your review was posted successfully.`
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "feedbacks");
    }
  };

  // ADMIN OPERATIONS
  const handleAdminLogin = async (email: string, pass: string): Promise<boolean> => {
    // Custom admin entry restriction logic supporting both subhu7web@gmail.com and subhu07web@gmail.com
    const formattedEmail = email.toLowerCase().trim();
    if ((formattedEmail === "subhu7web@gmail.com" || formattedEmail === "subhu07web@gmail.com") && pass === "admin 2026") {
      setIsAdmin(true);
      triggerNotification(
        "system",
        "Admin Logged In",
        "Live control panel session unlocked successfully."
      );
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    triggerNotification(
      "system",
      "Admin Logged Out",
      "Live control panel session ended."
    );
    setActiveTab("menu");
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const orderDoc = doc(db, "orders", orderId);
      await updateDoc(orderDoc, { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const handleUpdateReservationStatus = async (resId: string, status: ReservationStatus) => {
    try {
      const resDoc = doc(db, "reservations", resId);
      await updateDoc(resDoc, { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `reservations/${resId}`);
    }
  };

  const handleAddMenuItem = async (item: Omit<MenuItem, "id" | "rating">) => {
    try {
      const fullItem = { ...item, rating: 5.0 };
      await addDoc(collection(db, "menu"), fullItem);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "menu");
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    try {
      const itemDoc = doc(db, "menu", id);
      await deleteDoc(itemDoc);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `menu/${id}`);
    }
  };

  // Sign In modal helper
  const handleUserLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail) {
      setUserEmail(loginEmail);
      setIsLoginModalOpen(false);
      triggerNotification("system", "Identity Connected", `Logged in as ${loginEmail.split('@')[0]}.`);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans antialiased relative">
      
      {/* Real-time In-App Floating Notification Banner */}
      <AnimatePresence>
        {activeNotification && (
          <NotificationBanner
            activeNotif={activeNotification}
            onDismiss={() => setActiveNotification(null)}
          />
        )}
      </AnimatePresence>

      {/* Main Header navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartItems.reduce((acc, c) => acc + c.quantity, 0)}
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        notifications={notifications}
        onMarkAsRead={(id) => setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))}
        onClearAllNotifications={() => setNotifications([])}
        isAdmin={isAdmin}
        onAdminLogout={handleAdminLogout}
        userEmail={userEmail}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Body Views Render */}
      <main className="min-h-[calc(100vh-160px)]">
        {activeTab === "menu" && (
          <MenuSection
            menuItems={menuItems}
            onAddToCart={handleAddToCart}
          />
        )}

        {activeTab === "booking" && (
          <TableBooking
            onBookTable={handleBookTable}
            defaultUserEmail={userEmail || ""}
          />
        )}

        {activeTab === "feedback" && (
          <FeedbackSection
            feedbacks={feedbacks}
            onAddFeedback={handleAddFeedback}
            defaultUserEmail={userEmail || ""}
          />
        )}

        {activeTab === "admin" && (
          <AdminPanel
            isAdmin={isAdmin}
            onAdminLogin={handleAdminLogin}
            onAdminLogout={handleAdminLogout}
            orders={orders}
            reservations={reservations}
            feedbacks={feedbacks}
            menuItems={menuItems}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onUpdateReservationStatus={handleUpdateReservationStatus}
            onAddMenuItem={handleAddMenuItem}
            onDeleteMenuItem={handleDeleteMenuItem}
          />
        )}
      </main>

      {/* Floating Buttons: Call & WhatsApp */}
      <FloatingButtons
        phoneNumber={empirePhone}
        whatsappNumber={empireWhatsApp}
      />

      {/* Cart Drawer */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onPlaceOrder={handlePlaceOrder}
        defaultUserEmail={userEmail || ""}
      />

      {/* Professional Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-16 text-slate-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Col 1: Brand details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-amber-500 rounded-lg">
                <Utensils className="w-4 h-4 text-slate-950" />
              </div>
              <span className="text-sm font-extrabold text-white uppercase tracking-wider">The Empire</span>
            </div>
            <p className="leading-relaxed text-slate-500 max-w-xs text-[11px]">
              Kolkata's finest landmark restaurant offering authentic imperial delicacies, live royal table reservation, and instant hot deliveries.
            </p>
          </div>

          {/* Col 2: Timings */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold uppercase tracking-widest text-[11px]">Royal Opening Hours</h4>
            <ul className="space-y-2 text-[11px] text-slate-500">
              <li className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Lunch: 12:00 PM - 3:30 PM</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Dinner: 7:00 PM - 11:30 PM</span>
              </li>
              <li className="text-amber-500 font-semibold uppercase tracking-wider text-[9px] mt-1">Open All 7 Days</li>
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold uppercase tracking-widest text-[11px]">Contact & Support</h4>
            <ul className="space-y-2 text-[11px] text-slate-500">
              <li className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                <span>Call Us: +91 99999 00000</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                <span>daskajaldas780@gmail.com</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500 mt-0.5" />
                <span>12, Royal Plaza, Park Street, Kolkata, WB, India</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold uppercase tracking-widest text-[11px]">User Navigations</h4>
            <div className="flex flex-col gap-2">
              <button onClick={() => { setActiveTab("menu"); window.scrollTo(0,0); }} className="text-left hover:text-amber-400 transition-colors text-slate-500">
                🍽️ Browse Menu
              </button>
              <button onClick={() => { setActiveTab("booking"); window.scrollTo(0,0); }} className="text-left hover:text-amber-400 transition-colors text-slate-500">
                🛋️ Book Royal Table
              </button>
              <button onClick={() => { setActiveTab("feedback"); window.scrollTo(0,0); }} className="text-left hover:text-amber-400 transition-colors text-slate-500">
                💬 Guest Reviews
              </button>
              <button onClick={() => { setActiveTab("admin"); window.scrollTo(0,0); }} className="text-left hover:text-amber-400 transition-colors text-slate-500">
                🔐 Live Control Panel
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-900 text-center text-slate-600 text-[10px] uppercase tracking-wider">
          <p>© 2026 The Empire Restaurant • Built with Real-time Firestore & High Quality Modern Craft</p>
        </div>
      </footer>

      {/* User Login/Identity Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <>
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50" onClick={() => setIsLoginModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-sm shadow-2xl z-50 text-white"
            >
              <h3 className="text-base font-extrabold mb-4 text-slate-200">Connect Your Identity</h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Connect your email to save your orders history and receive real-time table status updates.
              </p>
              <form onSubmit={handleUserLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Your Email Address
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-amber-500 text-slate-200 placeholder:text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Guest Patron"
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:outline-none focus:border-amber-500 text-slate-200 placeholder:text-slate-700"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsLoginModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 text-slate-950 font-black text-xs rounded-lg hover:bg-amber-600 transition-colors"
                  >
                    Connect
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
