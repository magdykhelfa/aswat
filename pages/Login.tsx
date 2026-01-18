
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (user: string, pass: string) => boolean;
  onNavigate: (page: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(username, password);
    if (!success) {
      setError('بيانات الدخول غير صحيحة، يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-spiritual-green p-8 text-center text-white">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            <i className="fa-solid fa-lock"></i>
          </div>
          <h2 className="text-2xl font-bold font-amiri">تسجيل دخول الإدارة</h2>
          <p className="text-emerald-100 text-sm mt-2">مخصص للمشرفين والمحكمين فقط</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 animate-bounce">
              <i className="fa-solid fa-circle-exclamation ml-2"></i>
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 mr-1">اسم المستخدم</label>
            <div className="relative">
              <i className="fa-solid fa-user absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input 
                required
                type="text" 
                className="w-full pr-12 pl-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                placeholder="اسم المستخدم"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 mr-1">كلمة المرور</label>
            <div className="relative">
              <i className="fa-solid fa-key absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input 
                required
                type="password" 
                className="w-full pr-12 pl-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-spiritual-green text-white font-bold rounded-2xl hover:bg-emerald-800 transition shadow-lg transform active:scale-95"
          >
            دخول للنظام
          </button>

          <button 
            type="button"
            onClick={() => onNavigate('home')}
            className="w-full text-slate-400 text-sm hover:text-emerald-700 transition"
          >
            العودة للرئيسية
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
