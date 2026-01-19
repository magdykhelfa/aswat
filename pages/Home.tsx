import React, { useState, useEffect } from 'react';
import { CountdownTimer } from '../constants';

interface HomeProps {
  onNavigate: (page: string) => void;
  deadline: Date | null;
}

const Home: React.FC<HomeProps> = ({ onNavigate, deadline }) => {
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!deadline) return;

    const checkExpiry = () => {
      const now = new Date();
      setIsExpired(now > deadline);
    };

    checkExpiry();
    const timer = setInterval(checkExpiry, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  return (
    <div className="animate-in fade-in duration-700">
      <section className="relative min-h-[90vh] md:h-[95vh] flex items-center justify-center overflow-hidden py-12 md:py-0">
        <img 
          src="https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=2000&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover object-center" 
          alt="خلفية قرآنية"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/95 via-emerald-950/80 to-emerald-950/95"></div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto w-full">
          <div className="inline-block px-4 py-2 md:px-8 md:py-3 bg-amber-500/90 border border-amber-300 rounded-xl md:rounded-2xl text-emerald-950 text-[10px] md:text-sm font-black mb-6 md:mb-8 shadow-xl animate-pulse">
             دورة عام 2026 - محافظة كفر الشيخ
          </div>
          
          <h1 className="text-4xl md:text-8xl font-bold text-white mb-4 md:mb-6 font-amiri tracking-wide drop-shadow-2xl">
            أصوات من <span className="text-amber-400">الجنة</span>
          </h1>
          
          <p className="text-lg md:text-3xl text-slate-200 mb-8 md:mb-12 leading-relaxed font-light px-2">
            مسابقة القرآن الكريم والإنشاد الديني بـ <span className="text-amber-400 font-bold underline decoration-amber-500 underline-offset-4 md:underline-offset-8">محافظة كفر الشيخ</span>
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-12 md:mb-16 w-full max-w-md mx-auto md:max-w-none">
            {!isExpired ? (
              <button 
                onClick={() => onNavigate('register')}
                className="w-full md:w-auto px-12 py-5 md:py-6 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-black text-xl md:text-3xl rounded-2xl md:rounded-3xl shadow-xl transition transform active:scale-95 border-b-4 md:border-b-8 border-amber-700"
              >
                اشترك الآن 2026
              </button>
            ) : (
              <button 
                onClick={() => onNavigate('results')}
                className="w-full md:w-auto px-12 py-5 md:py-6 bg-emerald-700 text-white font-black text-xl md:text-2xl rounded-2xl md:rounded-3xl shadow-xl transition transform active:scale-95 border-b-4 md:border-b-8 border-emerald-900"
              >
                عرض النتائج
              </button>
            )}
            <button 
              onClick={() => onNavigate('terms')}
              className="w-full md:w-auto px-10 py-4 md:py-6 bg-white/10 hover:bg-white/20 text-white font-bold text-lg md:text-2xl rounded-2xl md:rounded-3xl border border-white/30 backdrop-blur-xl transition"
            >
              دليل المسابقة
            </button>
          </div>

          <div className="bg-black/40 backdrop-blur-md p-4 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-white/10 inline-block w-full md:w-auto min-w-[300px]">
            {!deadline ? (
              <>
                <p className="text-amber-200 mb-3 md:mb-4 text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] md:tracking-[0.4em]">
                  جاري تحميل الموعد
                </p>
                <div className="text-white font-bold text-lg animate-pulse">
                  انتظر قليلاً...
                </div>
              </>
            ) : !isExpired ? (
              <>
                <p className="text-amber-200 mb-3 md:mb-4 text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] md:tracking-[0.4em]">
                  متبقي على إغلاق باب التسجيل لعام 2026
                </p>
                <CountdownTimer targetDate={deadline} />
              </>
            ) : (
              <div className="py-2 px-4">
                <div className="text-amber-400 text-2xl md:text-4xl font-amiri mb-2 flex items-center justify-center gap-3">
                   <i className="fa-solid fa-hourglass-end"></i>
                   تم إغلاق باب التسجيل 2026
                </div>
                <p className="text-white/80 text-sm md:text-lg font-light leading-relaxed">
                  نعتذر، انتهى موعد استقبال المشاركات بمحافظة كفر الشيخ. جاري الآن مراجعة الأعمال من قبل لجنة التحكيم.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h3 className="text-emerald-800 font-black text-xs md:text-lg mb-6 md:mb-8 tracking-[0.2em] uppercase">الراعي الرسمي والحصري</h3>
          
          <div className="bg-gradient-to-br from-emerald-50 to-white p-6 md:p-20 rounded-[2rem] md:rounded-[4rem] border-2 md:border-4 border-amber-100 md:border-amber-200 shadow-xl w-full max-w-5xl mx-auto">
             <div className="mb-4 md:mb-6">
                <i className="fa-solid fa-award text-4xl md:text-6xl text-amber-500"></i>
             </div>
             
             <h2 className="text-3xl md:text-7xl font-bold text-emerald-950 font-amiri mb-2 md:mb-4 leading-tight">
                مؤسسة الخديوي
             </h2>
             
             <div className="h-1 w-20 md:w-40 bg-amber-500 mx-auto rounded-full mb-6 md:mb-8"></div>
             
             <p className="text-emerald-800 text-sm md:text-3xl font-medium leading-relaxed mb-8 md:mb-10 px-2">
                للمقاولات العامة والتوريدات العمومية والتوكيلات التجارية
             </p>
             
             <div className="inline-block px-6 py-4 md:px-10 md:py-6 bg-emerald-950 rounded-2xl md:rounded-3xl shadow-2xl w-full md:w-auto">
                <p className="text-amber-200 text-xs md:text-lg mb-1 md:mb-2">لصاحبها ومديرها</p>
                <p className="text-white text-xl md:text-5xl font-amiri font-bold">
                   الأستاذ / <span className="text-amber-400">عادل خلفه</span>
                </p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
