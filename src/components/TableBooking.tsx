import React, { useState } from "react";
import { Calendar as CalendarIcon, Clock, Users, Gift, Sofa, User, Phone, Mail, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

interface TableBookingProps {
  onBookTable: (bookingDetails: {
    userName: string;
    userEmail: string;
    userPhone: string;
    date: string;
    time: string;
    guests: number;
    tableNumber: string;
    specialRequests?: string;
  }) => void;
  defaultUserEmail?: string;
}

const TABLES_DATA = [
  { id: "T1", name: "Table 1", capacity: 2, type: "Couple Cozy Corner", desc: "Intimate table perfect for couples next to the garden glass window." },
  { id: "T2", name: "Table 2", capacity: 2, type: "Classic Bistro", desc: "Elegant standard table overlooking the live music stage." },
  { id: "T3", name: "Table 3", capacity: 4, type: "Family Dining", desc: "Spacious round table ideal for intimate family lunches or dinners." },
  { id: "T4", name: "Table 4", capacity: 4, type: "Imperial Booth", desc: "Plush leather booth seating with custom mood lighting." },
  { id: "T5", name: "Table 5 (VIP)", capacity: 6, type: "The Royal Lounge", desc: "Premium elevated table service with dedicated butler support." },
  { id: "TA", name: "VIP Lounge Table A", capacity: 8, type: "Empire Boardroom", desc: "Ultra-luxury isolated room with soundproof glass and premium décor." }
];

const TIME_SLOTS = [
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM"
];

export default function TableBooking({ onBookTable, defaultUserEmail = "" }: TableBookingProps) {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState(defaultUserEmail);
  const [userPhone, setUserPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [selectedTable, setSelectedTable] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Set minimum date to today
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail || !userPhone || !date || !time || !selectedTable) return;

    setIsSubmitting(true);
    try {
      await onBookTable({
        userName,
        userEmail,
        userPhone,
        date,
        time,
        guests,
        tableNumber: selectedTable,
        specialRequests,
      });
      setIsSuccess(true);
      // Reset form fields
      setUserName("");
      setSpecialRequests("");
      setSelectedTable("");
      setTime("");
      setDate("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="table-booking-section" className="py-12 bg-slate-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sofa className="w-3.5 h-3.5" />
            LIVE TABLE RESERVATION
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
            Reserve Your <span className="text-amber-500 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">Royal Throne</span>
          </h1>
          <p className="text-slate-400 text-sm">
            Avoid waiting in lines. Choose your preferred table on our live seating layout and book your dining slot instantly.
          </p>
        </div>

        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto bg-slate-900 border border-emerald-500/30 p-8 rounded-3xl text-center shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500" />
            <div className="mx-auto w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mb-6">
              <CheckCircle2 className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h2 className="text-2xl font-black text-slate-100 mb-2">Reservation Request Sent!</h2>
            <p className="text-xs uppercase tracking-wider text-emerald-400 font-bold mb-4">
              Pending Confirmation from Host
            </p>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Thank you for choosing <span className="text-amber-400 font-bold">The Empire</span>. We have received your booking and our table hosts are reviewing availability. You will receive a live notification once confirmed.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-all"
            >
              Book Another Table
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Visual Seating Layout & Table Details */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-900 rounded-3xl p-6 lg:p-8 space-y-6">
              <h2 className="text-lg font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
                <Sofa className="w-5 h-5 text-amber-500" />
                Select Your Desired Seating
              </h2>
              
              {/* Visual Grid Representing Restaurant Floor */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative">
                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 text-[10px] text-slate-400 font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                  Live Music Stage / Garden View
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-10">
                  {TABLES_DATA.map((table) => {
                    const isSelected = selectedTable === table.name;
                    return (
                      <button
                        key={table.id}
                        type="button"
                        id={`seating-table-${table.id}`}
                        onClick={() => setSelectedTable(table.name)}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-between transition-all ${
                          isSelected
                            ? "bg-amber-500/10 border-amber-500 text-amber-400 shadow-xl shadow-amber-500/5"
                            : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                        }`}
                      >
                        <Sofa className={`w-8 h-8 mb-2 ${isSelected ? 'text-amber-400' : 'text-slate-600'}`} />
                        <span className="text-xs font-bold text-slate-100">{table.name}</span>
                        <span className="text-[10px] text-slate-500 font-semibold mt-1 uppercase tracking-wider">
                          Max {table.capacity} Guests
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 flex flex-wrap gap-4 justify-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-slate-900 border border-slate-800" />
                    Available
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-amber-500/10 border border-amber-500" />
                    Selected
                  </div>
                </div>
              </div>

              {/* Show selected table details if any */}
              {selectedTable && (
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 flex gap-4 items-start animate-fadeIn">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
                    <Sofa className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider">
                      Selected: {selectedTable}
                    </h3>
                    <h4 className="text-xs font-bold text-slate-300 mt-0.5">
                      {TABLES_DATA.find((t) => t.name === selectedTable || selectedTable.startsWith(t.name))?.type}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {TABLES_DATA.find((t) => t.name === selectedTable || selectedTable.startsWith(t.name))?.desc}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-5">
              <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-900 rounded-3xl p-6 lg:p-8 space-y-5">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">
                  Reservation Form
                </span>

                {/* Name */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                      required
                      type="text"
                      placeholder="Jane Doe"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-slate-200 placeholder:text-slate-600"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
                      <input
                        required
                        type="email"
                        placeholder="jane@example.com"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-slate-200 placeholder:text-slate-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
                      <input
                        required
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        value={userPhone}
                        onChange={(e) => setUserPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-slate-200 placeholder:text-slate-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Select Date
                    </label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none" />
                      <input
                        required
                        type="date"
                        min={today}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-slate-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Preferred Time Slot
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none" />
                      <select
                        required
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-slate-200 appearance-none"
                      >
                        <option value="">Select Time</option>
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Guest Count */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Number of Guests
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none" />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-slate-200 appearance-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num}>{num} {num === 1 ? "Guest" : "Guests"}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Special Request */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Special Occasions & Requests
                  </label>
                  <div className="relative">
                    <Gift className="absolute left-3 top-3 text-slate-500 w-4 h-4 pointer-events-none" />
                    <textarea
                      rows={2}
                      placeholder="Anniversary decor, cake request, quiet table, wheelchair accessibility..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-slate-200 placeholder:text-slate-600 resize-none"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  id="book-table-submit-btn"
                  disabled={isSubmitting || !selectedTable}
                  className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-extrabold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xl shadow-amber-500/15 mt-2"
                >
                  {isSubmitting ? "Requesting Seat..." : selectedTable ? `Confirm Seat Booking at ${selectedTable}` : "Please Select a Table First"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
