
import React, { useState, useEffect } from 'react';
import { ParticipationType, ParticipationStatus, Participant } from '../types';

interface RegisterProps {
  onNavigate: (page: string) => void;
  onRegister: (participant: Participant) => void;
  deadline: Date;
}

const Register: React.FC<RegisterProps> = ({ onNavigate, onRegister, deadline }) => {
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (new Date() > deadline) {
      setIsExpired(true);
    }
  }, [deadline]);

  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    district: 'مسير',
    whatsapp: '',
    email: '',
    type: ParticipationType.Quran,
    agreed: false
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (isExpired) {
    alert('نعتذر، لقد تم إغلاق باب التسجيل');
    return;
  }

  if (!formData.agreed || !file) {
    alert('يرجى استكمال البيانات ورفع الملف');
    return;
  }

  setIsSubmitting(true);

  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = async () => {
    const base64 = reader.result?.toString().split(',')[1];

    const payload = {
      fullName: formData.fullName,
      age: formData.age,
      district: formData.district,
      whatsapp: formData.whatsapp,
      email: formData.email,
      type: formData.type,
      file: base64,
      fileName: `${formData.fullName}.${file.name.split('.').pop()}`,
      fileType: file.type
    };

    try {
      await fetch("https://script.google.com/macros/s/AKfycbyIic09bQb9T3mtIIIvlyN15Hfgut8c2GnvM8e6K4L1HY5haPnTp5O7qEHpXGzmS_a5/exec", {
        method: "POST",
        body: new URLSearchParams(payload)
      });

      alert("تم تسجيل مشاركتك ورفع الملف بنجاح");
      setIsSubmitting(false);
    } catch {
      alert("حدث خطأ أثناء الإرسال");
      setIsSubmitting(false);
    }
  };
};



  const finalizeSubmission = () => {
    const newParticipant: Participant = {
      id: Math.random().toString(36).substr(2, 9),
      fullName: formData.fullName,
      age: parseInt(formData.age),
      country: `محافظة كفر الشيخ - ${formData.district}`,
      whatsapp: formData.whatsapp,
      email: formData.email,
      type: formData.type,
      fileUrl: file ? URL.createObjectURL(file) : '', 
      status: ParticipationStatus.Pending,
      ratings: [],
      averageScore: 0,
      submittedAt: new Date()
    };
    
    onRegister(newParticipant);
    setIsSubmitting(false);
    alert('تم رفع ملفك بنجاح وحفظ بياناتك. بالتوفيق!');
  };

  if (isExpired) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md border-t-8 border-red-500">
          <i className="fa-solid fa-calendar-xmark text-6xl text-red-500 mb-6"></i>
          <h2 className="text-3xl font-bold font-amiri mb-4 text-slate-800">التسجيل مغلق</h2>
          <p className="text-slate-500 leading-relaxed mb-8">
            نأسف لإبلاغكم بأن موعد استقبال المشاركات قد انتهى. جاري الآن أعمال التقييم والاختبارات.
          </p>
          <button onClick={() => onNavigate('home')} className="bg-spiritual-green text-white px-8 py-3 rounded-xl font-bold">العودة للرئيسية</button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-spiritual-green p-6 md:p-8 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold font-amiri mb-2">تسجيل متسابقي محافظة كفر الشيخ</h2>
            <p className="text-emerald-100 opacity-80 text-sm md:text-base">أهلاً بك في رحاب القرآن والإنشاد</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-5 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">الاسم الكامل</label>
                <input required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="الاسم رباعي" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">العمر</label>
                <input required type="number" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">المركز/المدينة</label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 bg-white" value={formData.district} onChange={(e) => setFormData({...formData, district: e.target.value})}>
                    <option value="مسير">مسير</option>
                    <option value="كفر الشيخ (المدينة)">كفر الشيخ (المدينة)</option>
                    <option value="دسوق">دسوق</option>
                    <option value="فوه">فوه</option>
                    <option value="مطوبس">مطوبس</option>
                    <option value="قلين">قلين</option>
                    <option value="سيدي سالم">سيدي سالم</option>
                    <option value="الرياض">الرياض</option>
                    <option value="بيلا">بيلا</option>
                    <option value="الحامول">الحامول</option>
                    <option value="بلطيم">بلطيم</option>
                    <option value="سيدي غازي">سيدي غازي</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">رقم واتساب</label>
                <input required type="tel" className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-left focus:ring-2 focus:ring-emerald-500" dir="ltr" placeholder="01xxxxxxxxx" value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">نوع المشاركة</label>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <button type="button" onClick={() => setFormData({...formData, type: ParticipationType.Quran})} className={`py-4 rounded-xl border-2 transition font-bold text-sm md:text-base ${formData.type === ParticipationType.Quran ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm' : 'border-slate-100 bg-slate-50 text-slate-500'}`}>تلاوة قرآن</button>
                <button type="button" onClick={() => setFormData({...formData, type: ParticipationType.Inshad})} className={`py-4 rounded-xl border-2 transition font-bold text-sm md:text-base ${formData.type === ParticipationType.Inshad ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-sm' : 'border-slate-100 bg-slate-50 text-slate-500'}`}>إنشاد ديني</button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">رفع الملف (فيديو/صوت)</label>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 md:p-8 text-center bg-slate-50 relative hover:bg-slate-100 transition">
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="audio/*,video/*" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
                <div className="text-emerald-800 text-3xl md:text-4xl mb-3 md:mb-4"><i className="fa-solid fa-cloud-arrow-up"></i></div>
                <p className="font-bold text-slate-600 text-sm md:text-base">{file ? file.name : 'اختر ملف المشاركة'}</p>
                <p className="text-[10px] md:text-xs text-slate-400 mt-2">مسموح بـ MP3, MP4 بحد أقصى 50 ميجا</p>
              </div>
              {uploadProgress > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-emerald-700 font-bold">جاري الرفع...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full transition-all duration-300" style={{width: `${uploadProgress}%`}}></div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <input id="agreed" type="checkbox" className="mt-1 w-5 h-5 accent-emerald-600 shrink-0" checked={formData.agreed} onChange={(e) => setFormData({...formData, agreed: e.target.checked})} />
              <label htmlFor="agreed" className="text-xs md:text-sm text-slate-600 leading-relaxed cursor-pointer">
                أقر بأنني من أبناء محافظة كفر الشيخ وأوافق على شروط المسابقة واستخدام بياناتي للتواصل.
              </label>
            </div>

            <button disabled={isSubmitting} type="submit" className={`w-full py-4 md:py-5 rounded-2xl bg-spiritual-green text-white font-black text-lg md:text-xl shadow-xl transition transform active:scale-95 ${isSubmitting ? 'opacity-70 cursor-wait' : 'hover:bg-emerald-800'}`}>
              {isSubmitting ? 'جاري الحفظ...' : 'إرسال المشاركة'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
