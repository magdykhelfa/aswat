
import React, { useState, useEffect } from 'react';
import { Participant, User, ParticipationStatus } from '../types';

interface JudgingPanelProps {
  participants: Participant[];
  currentUser: User;
  onRate: (participantId: string, score: number) => void;
  onLogout: () => void;
}

const JudgingPanel: React.FC<JudgingPanelProps> = ({ participants, currentUser, onRate, onLogout }) => {
  // تصفية المتسابقين الذين لم يتم رفضهم فقط
  const judgingQueue = participants.filter(p => p.status !== ParticipationStatus.Rejected);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState<number>(8); // قيمة افتراضية متوسطة
  const [showSuccess, setShowSuccess] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const current = judgingQueue[currentIndex];

  // التحقق مما إذا كان المتسابق الحالي تم تقييمه مسبقاً من هذا المحكم
  useEffect(() => {
    if (current) {
      const existingRating = current.ratings.find(r => r.judgeId === currentUser.id);
      if (existingRating) {
        setScore(existingRating.score);
      } else {
        setScore(8);
      }
    }
  }, [currentIndex, current, currentUser.id]);

  const handleRate = () => {
    if (current) {
      onRate(current.id, score);
      
      // إظهار رسالة نجاح مؤقتة
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      // الانتقال للتالي أو إنهاء الجلسة
      if (currentIndex < judgingQueue.length - 1) {
        setTimeout(() => {
          setCurrentIndex(currentIndex + 1);
        }, 500);
      } else {
        setTimeout(() => {
          setIsFinished(true);
        }, 500);
      }
    }
  };

  if (judgingQueue.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-center p-8">
        <div className="animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-clipboard-check text-5xl text-slate-300"></i>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 font-amiri">لا توجد مشاركات للتقييم حالياً</h2>
          <p className="text-slate-500 mt-2">سيتم إخطارك عند توفر مشاركات جديدة مقبولة من الإدارة.</p>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] p-4">
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl text-center max-w-lg border-b-8 border-emerald-600 animate-in slide-in-from-bottom duration-700">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            <i className="fa-solid fa-star"></i>
          </div>
          <h2 className="text-3xl font-bold font-amiri text-emerald-900 mb-4">تم بحمد الله</h2>
          <p className="text-slate-600 leading-relaxed mb-8 text-lg">
            لقد انتهيت من تقييم جميع المشاركات المتاحة في القائمة حالياً. جزاكم الله خيراً على جهودكم.
          </p>
          <div className="flex gap-4 flex-col sm:flex-row">
            <button 
              onClick={() => { setIsFinished(false); setCurrentIndex(0); }}
              className="flex-1 bg-slate-100 text-slate-700 px-8 py-4 rounded-2xl font-bold hover:bg-slate-200 transition"
            >
              مراجعة التقييمات
            </button>
            <button 
              onClick={() => window.location.reload()} 
              className="flex-1 bg-spiritual-green text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:bg-emerald-800 transition"
            >
              العودة للوحة الإدارة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 bg-slate-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* تنبيه النجاح العائم */}
        {showSuccess && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <i className="fa-solid fa-circle-check text-xl"></i>
            <span className="font-bold">تم اعتماد تقييم {current.fullName} بنجاح</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* الجانب الأيمن: قائمة المتسابقين للتبديل السريع */}
          <div className="lg:w-1/3 order-2 lg:order-1">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
              <div className="bg-slate-50 p-5 border-b border-slate-200">
                <h3 className="font-black text-slate-800 flex items-center gap-2">
                  <i className="fa-solid fa-list-ol text-emerald-600"></i>
                  قائمة التحكيم الحالية
                </h3>
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                {judgingQueue.map((p, idx) => {
                  const isRated = p.ratings.some(r => r.judgeId === currentUser.id);
                  return (
                    <button 
                      key={p.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-full p-4 text-right flex items-center gap-4 border-b border-slate-50 transition ${currentIndex === idx ? 'bg-emerald-50 border-r-4 border-r-emerald-600' : 'hover:bg-slate-50'}`}
                    >
                      <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold ${isRated ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                        {isRated ? <i className="fa-solid fa-check"></i> : idx + 1}
                      </div>
                      <div className="overflow-hidden">
                        <div className={`font-bold truncate text-sm ${currentIndex === idx ? 'text-emerald-900' : 'text-slate-700'}`}>{p.fullName}</div>
                        <div className="text-[10px] text-slate-400">{p.type}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* الجانب الأيسر: منطقة التقييم النشطة */}
          <div className="lg:w-2/3 order-1 lg:order-2">
            <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-white">
              <div className="p-6 md:p-10 bg-gradient-to-r from-emerald-900 to-emerald-800 text-white relative">
                 <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/islamic-art.png')]"></div>
                 <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-white/20 backdrop-blur-md rounded-[2rem] flex items-center justify-center text-white text-4xl md:text-5xl border border-white/30 shadow-2xl">
                       <i className={current.type.includes('قرآن') ? 'fa-solid fa-book-quran' : 'fa-solid fa-microphone-lines'}></i>
                    </div>
                    <div className="text-center md:text-right">
                       <span className="inline-block px-3 py-1 bg-amber-500 text-emerald-950 text-[10px] font-black rounded-full mb-3 uppercase tracking-widest">مشاركة نشطة</span>
                       <h3 className="text-2xl md:text-4xl font-bold font-amiri mb-2">{current.fullName}</h3>
                       <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                          <span className="text-emerald-100 text-xs md:text-sm bg-white/10 px-3 py-1 rounded-lg"><i className="fa-solid fa-location-dot ml-1"></i> {current.country}</span>
                          <span className="text-emerald-100 text-xs md:text-sm bg-white/10 px-3 py-1 rounded-lg"><i className="fa-solid fa-user ml-1"></i> {current.age} عاماً</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-6 md:p-10 space-y-10">
                              
                {/* نظام الدرجات المحسن */}
                <div>
                  <h4 className="font-black text-slate-700 mb-8 flex items-center gap-3">
                    <div className="w-2 h-6 bg-emerald-600 rounded-full"></div>
                    منح الدرجة النهائية (من 10)
                  </h4>
                  
                  <div className="flex flex-col items-center gap-10">
                    {/* عرض الرقم الكبير */}
                    <div className="relative group">
                       <div className="w-32 h-32 md:w-40 md:h-40 bg-emerald-900 text-white rounded-[3rem] flex flex-col items-center justify-center shadow-2xl transform group-hover:scale-105 transition duration-500">
                          <span className="text-5xl md:text-7xl font-black font-amiri">{score}</span>
                          <span className="text-xs font-bold opacity-60 tracking-widest uppercase mt-1">درجة</span>
                       </div>
                       <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-emerald-900 shadow-xl border-4 border-white">
                          <i className="fa-solid fa-check-double"></i>
                       </div>
                    </div>

                    {/* أزرار الدرجات السريعة */}
                    <div className="grid grid-cols-5 md:grid-cols-10 gap-2 md:gap-3 w-full">
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <button 
                          key={n}
                          onClick={() => setScore(n)}
                          className={`py-4 rounded-2xl font-black text-lg transition-all duration-300 ${score === n ? 'bg-emerald-600 text-white shadow-xl scale-110 -translate-y-1' : 'bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-100'}`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>

                    {/* زر الاعتماد النهائي */}
                    <div className="w-full pt-6 border-t border-slate-100 flex flex-col md:flex-row gap-4">
                      <button 
                        disabled={currentIndex === 0}
                        onClick={() => setCurrentIndex(currentIndex - 1)}
                        className="flex-1 py-5 border-2 border-slate-200 text-slate-400 font-black rounded-2xl hover:bg-slate-50 transition disabled:opacity-20"
                      >
                        <i className="fa-solid fa-chevron-right ml-2"></i>
                        المتسابق السابق
                      </button>
                      
                      <button 
                        onClick={handleRate}
                        className="flex-[2] py-5 bg-spiritual-green text-white font-black text-xl rounded-2xl hover:bg-emerald-800 transition shadow-2xl flex items-center justify-center gap-4 active:scale-95 group"
                      >
                        <span>اعتماد التقييم والحفظ</span>
                        <i className="fa-solid fa-paper-plane group-hover:translate-x-[-5px] transition-transform"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="mt-8 text-center text-slate-400 text-xs font-medium">
              <i className="fa-solid fa-shield-halved ml-2"></i>
              تقييمك يتم حفظه بشكل فوري وتراكمي في سجلات المسابقة الرسمية.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JudgingPanel;
