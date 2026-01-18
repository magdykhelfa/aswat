
import React from 'react';
import { Participant } from '../types';

interface ResultsProps {
  participants: Participant[];
  onNavigate: (page: string) => void;
  showCurrentResults: boolean;
  lastYearWinners: string[];
}

const Results: React.FC<ResultsProps> = ({ participants, showCurrentResults, lastYearWinners }) => {
  const rankedParticipants = [...participants]
    .filter(p => p.ratings.length > 0)
    .sort((a, b) => b.averageScore - a.averageScore);

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        
        {showCurrentResults ? (
          <div>
            <div className="text-center mb-16">
              <div className="inline-block p-3 bg-emerald-100 rounded-full text-emerald-600 mb-4">
                <i className="fa-solid fa-medal text-3xl"></i>
              </div>
              <h2 className="text-4xl font-bold text-emerald-900 font-amiri mb-2">نتائج مسابقة 2026 المعتمدة</h2>
              <p className="text-slate-600">محافظة كفر الشيخ - دورة الأستاذ عادل خلفه</p>
            </div>

            <div className="space-y-4">
              {rankedParticipants.length > 0 ? (
                rankedParticipants.map((p, idx) => (
                  <div key={p.id} className="bg-white p-6 rounded-2xl shadow-sm flex justify-between items-center border-r-8 border-emerald-600">
                    <div className="flex items-center gap-6">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${idx < 3 ? 'bg-amber-400 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {idx + 1}
                      </div>
                      <h3 className="text-xl font-bold text-slate-800">{p.fullName}</h3>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-emerald-700">{p.averageScore.toFixed(1)}</div>
                      <div className="text-[10px] text-slate-400">الدرجة</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white p-12 rounded-3xl text-center text-slate-400 italic">جاري مراجعة نتائج 2026...</div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-16">
              <div className="inline-block p-3 bg-amber-100 rounded-full text-amber-600 mb-4 animate-bounce">
                <i className="fa-solid fa-trophy text-3xl"></i>
              </div>
              <h2 className="text-4xl font-bold text-emerald-900 font-amiri mb-2">لوحة شرف أوائل العام الماضي 2025</h2>
              <p className="text-slate-600">ترقبوا إعلان نتائج عام 2026 قريباً</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-amber-100">
              <div className="bg-amber-500 p-4 text-center text-emerald-950 font-black">قائمة الـ 10 الأوائل - مسابقة 2025</div>
              <div className="divide-y divide-amber-50">
                {lastYearWinners.map((name, i) => (
                  name && (
                    <div key={i} className="p-5 flex items-center gap-4 hover:bg-amber-50/50 transition">
                      <div className="w-8 h-8 rounded-full bg-emerald-900 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0">
                        {i + 1}
                      </div>
                      <span className="text-lg font-bold text-slate-700 font-amiri">{name}</span>
                      <i className="fa-solid fa-star text-amber-400 mr-auto opacity-30"></i>
                    </div>
                  )
                ))}
              </div>
              {!lastYearWinners.some(n => n !== '') && (
                <div className="p-12 text-center text-slate-400 italic">بانتظار رفع قائمة أوائل 2025 من الإدارة</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
