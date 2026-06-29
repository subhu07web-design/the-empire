export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  isVegetarian: boolean;
  isPopular: boolean;
  prepTime: string; // e.g., "15-20 min"
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  customInstructions?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Preparing' | 'OutForDelivery' | 'Completed' | 'Cancelled';

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  timestamp: any; // firestore Timestamp or Date
  tableNumber?: string;
  paymentMethod: 'Cash' | 'Card' | 'UPI';
  paymentStatus: 'Pending' | 'Paid';
  phone?: string;
}

export type ReservationStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';

export interface Reservation {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  guests: number;
  tableNumber: string;
  status: ReservationStatus;
  timestamp: any;
  specialRequests?: string;
}

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  timestamp: any;
  orderId?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
  type: 'order' | 'booking' | 'feedback' | 'system';
}
