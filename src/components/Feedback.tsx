import React, { useState } from "react";
import { MessageSquare, Star, User, Quote, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { Feedback as FeedbackType } from "../types";

interface FeedbackProps {
  feedbacks: FeedbackType[];
  onAddFeedback: (feedback: {
    userName: string;
    userEmail: string;
    rating: number;
    comment: string;
  }) => void;
  defaultUserEmail?: string;
}

export default function Feedback({ feedbacks, onAddFeedback, defaultUserEmail = "" }: FeedbackProps) {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState(defaultUserEmail);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Math for reviews stats
  const totalReviews = feedbacks.length;
  const averageRating = totalReviews > 0
    ? Number((feedbacks.reduce((acc, f) => acc + f.rating, 0) / totalReviews).toFixed(1))
    : 4.8; // Default to 4.8 if empty

  const ratingCounts = [1, 2, 3, 4, 5].reduce((acc, score) => {
    acc[score] = feedbacks.filter((f) => f.rating === score).length;
    return acc;
  }, {} as { [key: number]: number });

  const getPercent = (score: number) => {
    if (totalReviews === 0) {
      if (score === 5) return 80;
      if (score === 4) return 15;
      return 5;
    }
    return Math.round((ratingCounts[score] / totalReviews) * 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail || !comment || !rating) return;

    setIsSubmitting(true);
    try {
      await onAddFeedback({
        userName,
        userEmail,
        rating,
        comment,
      });
      setIsSuccess(true);
      setComment("");
      setRating(5);
      setUserName("");
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="feedback-section" className="py-12 bg-slate-950 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            PATRON TESTIMONIALS
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">
            Royal Reviews & <span className="text-amber-500 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">Feedbacks</span>
          </h1>
          <p className="text-slate-400 text-sm">
            We value your experience above all. Check out what our distinguished guests have to say, or share your own thoughts with us.
          </p>
        </div>

        {/* Dashboard grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Reviews Stats Panel */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-900 rounded-3xl p-6 lg:p-8 space-y-6">
            <h2 className="text-base font-extrabold tracking-tight text-slate-100">
              Overall Guest Rating
            </h2>

            <div className="flex items-center gap-4">
              <span className="text-5xl font-black text-amber-500 font-mono">
                {averageRating}
              </span>
              <div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(averageRating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-700"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-500 font-semibold mt-1 block">
                  Based on {totalReviews || 184} rating reviews
                </span>
              </div>
            </div>

            {/* Progress breakdown */}
            <div className="space-y-2 pt-2 border-t border-slate-800/60">
              {[5, 4, 3, 2, 1].map((score) => {
                const percent = getPercent(score);
                return (
                  <div key={score} className="flex items-center gap-3 text-xs">
                    <span className="w-3 text-slate-400 font-bold">{score}</span>
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />
                    <div className="flex-grow h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-slate-500 font-semibold">{percent}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Write a Review Panel */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-900 rounded-3xl p-6 lg:p-8">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center"
              >
                <div className="mx-auto w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 mb-4">
                  <CheckCircle2 className="w-7 h-7 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-bold text-slate-100">Review Submitted Successfully!</h3>
                <p className="text-xs text-emerald-400 mt-0.5 uppercase font-bold tracking-widest">
                  Thank you for your valuable response
                </p>
                <p className="text-xs text-slate-400 mt-3 max-w-sm mx-auto leading-relaxed">
                  Your feedback helps us refine the culinary experience at The Empire. It has been synchronized to the real-time admin command panel.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Leave an Imperial Review
                </h3>

                {/* Rating selection stars */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Your Rating Experience
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        id={`review-star-${star}`}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 rounded-md bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition-colors"
                      >
                        <Star
                          className={`w-6 h-6 transition-all ${
                            star <= (hoverRating ?? rating)
                              ? "text-amber-400 fill-amber-400 scale-105"
                              : "text-slate-700"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* User inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Your Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
                      <input
                        required
                        type="text"
                        placeholder="Jane Smith"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-slate-200 placeholder:text-slate-600"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="jane@example.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-slate-200 placeholder:text-slate-600"
                    />
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Your Review Comment
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe your dining, table reservation or delivery experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-amber-500 text-slate-200 placeholder:text-slate-600"
                  />
                </div>

                <button
                  type="submit"
                  id="review-submit-btn"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xl shadow-amber-500/15"
                >
                  {isSubmitting ? "Submitting Review..." : "Submit Royal Review"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Real-time Feedbacks Lists */}
        <div>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-6">
            Distinguished Guest Reviews ({feedbacks.length})
          </span>

          {feedbacks.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/10 border border-slate-900 rounded-3xl">
              <Quote className="w-10 h-10 text-slate-700 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-300">No Reviews Posted Yet</h3>
              <p className="text-xs text-slate-500 mt-1">Be the first to post a luxury review for The Empire!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {feedbacks.map((f) => (
                <div
                  key={f.id}
                  id={`review-card-${f.id}`}
                  className="bg-slate-900/60 border border-slate-900 rounded-2xl p-5 flex gap-4 items-start relative shadow-lg hover:border-slate-800 transition-colors"
                >
                  <Quote className="absolute top-4 right-4 text-slate-800 w-8 h-8 pointer-events-none" />
                  
                  {/* Avatar Icon */}
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold flex-shrink-0">
                    {f.userName.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-grow min-w-0">
                    <h4 className="text-xs font-extrabold text-slate-200">{f.userName}</h4>
                    
                    {/* Stars */}
                    <div className="flex gap-0.5 mt-1 mb-2">
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

                    <p className="text-xs text-slate-400 leading-relaxed italic pr-4">
                      "{f.comment}"
                    </p>

                    <span className="text-[10px] text-slate-500 font-semibold block mt-3 font-mono">
                      {new Date(f.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
