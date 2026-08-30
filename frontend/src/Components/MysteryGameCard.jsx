import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Trophy, LockKeyhole } from "lucide-react";

const MysteryGameCard = () => {
  const navigate = useNavigate();

  return (
    <div className="group relative overflow-hidden rounded-3xl border-2 border-[#e8dcc8] bg-gradient-to-br from-[#fffaf7] to-[#f8eadf] p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      
      {/* Decorative Background */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#f5dfb8]/40 blur-2xl" />
      <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-[#a45a24]/10 blur-2xl" />
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#b8860b]/40 to-transparent" />

      {/* Header */}
      <div className="relative z-10 flex items-start justify-between mb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8eadf] border border-[#e8dcc8] text-[#965034] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Game
          </div>
          <h3 className="text-2xl font-extrabold text-[#2d1a14] font-serif">Maharashtra Mystery</h3>
          <p className="text-sm text-[#8b7355] mt-1">Solve riddles, unlock clues, earn XP!</p>
        </div>
        
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#a45a24]/10 border border-[#a45a24]/20">
          <LockKeyhole className="h-6 w-6 text-[#a45a24]" />
        </div>
      </div>

      {/* Fun stats (Placeholder) */}
      <div className="relative z-10 flex items-center gap-4 mb-5">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-[#e8dcc8] text-xs font-bold text-[#965034]">
          <Trophy className="w-3.5 h-3.5" />
          500+ XP
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-[#e8dcc8] text-xs font-bold text-[#965034]">
          <Sparkles className="w-3.5 h-3.5" />
          3 Clues
        </div>
      </div>

      {/* Description */}
      <p className="relative z-10 text-sm text-[#72574c] leading-relaxed mb-6">
        Can you guess the hidden secret of Maharashtra? Use clues wisely and become a top explorer!
      </p>

      {/* CTA */}
      <div className="relative z-10">
        <button
          onClick={() => navigate("/mystery")} // Change this to your actual route path
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7f3f2b] to-[#a45a24] px-5 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.02]"
        >
          Play Mystery
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
};

export default MysteryGameCard;