
import React, { useState, useEffect, useRef } from 'react';
import { Participant, ParticipationStatus, User } from '../types';
import JudgingPanel from './JudgingPanel';

interface AdminDashboardProps {
  participants: Participant[];
  onUpdateStatus: (id: string, status: ParticipationStatus) => void;
  onDelete: (id: string) => void;
  onLogout: () => void;
  onRate: (participantId: string, score: number) => void;
  onImportData: (data: Participant[]) => void;
  currentUser: User;
  deadline: Date;
  onUpdateDeadline: (date: Date) => void;
  showCurrentResults: boolean;
  onToggleResults: (val: boolean) => void;
  lastYearWinners: string[];
  onUpdateLastYear: (winners: string[]) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  participants, 
  onDelete, 
  onLogout, 
  onRate,
  onImportData,
  currentUser,
  deadline,
  onUpdateDeadline,
  showCurrentResults,
  onToggleResults,
  lastYearWinners,
  onUpdateLastYear
}) => {
  const [activeTab, setActiveTab] = useState<'management' | 'judging' | 'settings' | 'backup'>('management');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [tempWinners, setTempWinners] = useState<string[]>(lastYearWinners);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const confirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  // وظيفة تصدير البيانات (Backup)
  const handleExport = () => {
    const backupData = {
      participants,
      showCurrentResults,
      lastYearWinners,
      deadline: deadline.toISOString(),
      exportDate: new Date().toISOString()
    };
    const dataStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aswat_full_backup_${new Date().toLocaleDateString('ar-EG')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // وظيفة استيراد البيانات (Restore)
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        
        // التحقق من صحة البيانات (دعم التنسيق القديم والجديد)
        const participantsList = Array.isArray(importedData) ? importedData : importedData.participants;
        
        if (Array.isArray(participantsList)) {
          onImportData(participantsList);
          
          // إذا كان الملف يحتوي على إعدادات إضافية نقوم بتحديثها
          if (importedData.lastYearWinners) onUpdateLastYear(importedData.lastYearWinners);
          if (importedData.showCurrentResults !== undefined) onToggleResults(importedData.showCurrentResults);
          
          alert('✅ تم استعادة البيانات والأسماء بنجاح!');
        } else {
          alert('❌ الملف المرفوع غير مدعوم أو تالف.');
        }
      } catch (err) {
        alert('❌ حدث خطأ أثناء قراءة الملف. تأكد أنه ملف JSON صحيح.');
      }
    };
    reader.readAsText(file);
    // تصفير قيمة المدخل للسماح برفع نفس الملف مرة أخرى إذا لزم الأمر
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleWinnerChange = (idx: number, val: string) => {
    const newWinners = [...tempWinners];
    newWinners[idx] = val;
    setTempWinners(newWinners);
  };

  const saveWinners = () => {
    onUpdateLastYear(tempWinners);
    alert('✅ تم حفظ قائمة أوائل العام الماضي.');
  };

  const getLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getLocalTimeString = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const [tempDate, setTempDate] = useState(getLocalDateString(deadline));
  const [tempTime, setTempTime] = useState(getLocalTimeString(deadline));

  useEffect(() => {
    setTempDate(getLocalDateString(deadline));
    setTempTime(getLocalTimeString(deadline));
  }, [deadline]);

  const handleDeadlineSave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const [year, month, day] = tempDate.split('-').map(Number);
      const [hours, minutes] = tempTime.split(':').map(Number);
      const newDeadline = new Date(year, month - 1, day, hours, minutes, 0);
      onUpdateDeadline(newDeadline);
      alert('✅ تم تحديث موعد الإغلاق.');
    } catch (err) { alert('خطأ في البيانات'); }
  };

  const filteredParticipants = participants.filter(p => 
    p.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-100 min-h-screen pb-20 animate-in fade-in duration-500">
      
      {/* نافذة تأكيد الحذف */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-sm w-full overflow-hidden">
            <div className="bg-red-50 p-6 text-center">
              <i className="fa-solid fa-triangle-exclamation text-3xl text-red-600 mb-4"></i>
              <h3 className="text-xl font-bold text-slate-800">تأكيد الحذف</h3>
              <p className="text-slate-500 text-sm mt-2">هل تريد حذف هذا المتسابق نهائياً؟</p>
            </div>
            <div className="p-6 flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-3 bg-slate-100 font-bold rounded-xl">إلغاء</button>
              <button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl">حذف</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border-b border-slate-200 sticky top-16 md:top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto">
          <button onClick={() => setActiveTab('management')} className={`px-6 py-4 font-bold text-sm border-b-2 ${activeTab === 'management' ? 'border-emerald-600 text-emerald-700' : 'border-transparent'}`}>الإدارة</button>
          <button onClick={() => setActiveTab('judging')} className={`px-6 py-4 font-bold text-sm border-b-2 ${activeTab === 'judging' ? 'border-emerald-600 text-emerald-700' : 'border-transparent'}`}>التحكيم</button>
          <button onClick={() => setActiveTab('settings')} className={`px-6 py-4 font-bold text-sm border-b-2 ${activeTab === 'settings' ? 'border-emerald-600 text-emerald-700' : 'border-transparent'}`}>الإعدادات</button>
          <button onClick={() => setActiveTab('backup')} className={`px-6 py-4 font-bold text-sm border-b-2 ${activeTab === 'backup' ? 'border-emerald-600 text-emerald-700' : 'border-transparent'}`}>النسخ والأمان</button>
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        {activeTab === 'management' && (
          <div>
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-2xl font-bold font-amiri">المشاركات ({participants.length})</h2>
               <input type="text" placeholder="بحث بالاسم..." className="px-4 py-2 rounded-xl border" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-right">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-4">المتسابق</th>
                    <th className="p-4">التقييم</th>
                    <th className="p-4 text-center">حذف</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredParticipants.map(p => (
                    <tr key={p.id}>
                      <td className="p-4 font-bold">{p.fullName}</td>
                      <td className="p-4 text-emerald-700 font-black">{p.averageScore.toFixed(1)}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => setDeleteId(p.id)} className="text-red-500 hover:text-red-700"><i className="fa-solid fa-trash"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'judging' && (
          <JudgingPanel participants={participants} onRate={onRate} onLogout={onLogout} currentUser={currentUser} />
        )}

        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100">
              <h3 className="text-xl font-bold mb-6 text-emerald-900 border-b pb-4">إعدادات العرض العام</h3>
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl">
                <div>
                  <p className="font-bold text-emerald-900">إظهار نتائج العام الحالي</p>
                  <p className="text-xs text-emerald-600">تفعيل هذا الخيار سيجعل التقييمات مرئية للجمهور فوراً.</p>
                </div>
                <button 
                  onClick={() => onToggleResults(!showCurrentResults)}
                  className={`w-14 h-8 rounded-full relative transition-colors ${showCurrentResults ? 'bg-emerald-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${showCurrentResults ? 'right-7' : 'right-1'}`}></div>
                </button>
              </div>

              <form onSubmit={handleDeadlineSave} className="mt-8 space-y-4">
                <p className="font-bold text-slate-700">تعديل موعد إغلاق التسجيل:</p>
                <div className="grid grid-cols-2 gap-4">
                  <input type="date" className="p-3 border rounded-xl" value={tempDate} onChange={e => setTempDate(e.target.value)} />
                  <input type="time" className="p-3 border rounded-xl" value={tempTime} onChange={e => setTempTime(e.target.value)} />
                </div>
                <button type="submit" className="w-full py-3 bg-spiritual-green text-white font-bold rounded-xl">حفظ الموعد</button>
              </form>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-amber-100">
              <h3 className="text-xl font-bold mb-6 text-amber-900 border-b pb-4">أوائل العام الماضي (10 مراكز)</h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {tempWinners.map((name, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-8 h-8 flex items-center justify-center bg-amber-100 text-amber-700 rounded-lg text-xs font-bold">#{i+1}</span>
                    <input 
                      type="text" 
                      placeholder={`اسم الفائز بالمركز ${i+1}`}
                      className="flex-1 p-3 border rounded-xl text-sm"
                      value={name}
                      onChange={e => handleWinnerChange(i, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <button onClick={saveWinners} className="w-full mt-6 py-3 bg-amber-500 text-emerald-950 font-bold rounded-xl">حفظ القائمة</button>
            </div>
          </div>
        )}

        {activeTab === 'backup' && (
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* قسم التحميل */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 text-center">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                <i className="fa-solid fa-cloud-arrow-down"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">حفظ نسخة احتياطية</h3>
              <p className="text-slate-500 text-sm mb-8">قم بتحميل ملف يحتوي على جميع البيانات الحالية لضمان عدم فقدانها.</p>
              <button 
                onClick={handleExport}
                className="w-full py-4 bg-spiritual-green text-white rounded-2xl font-bold shadow-lg hover:bg-emerald-800 transition flex items-center justify-center gap-3"
              >
                <i className="fa-solid fa-download"></i>
                تحميل ملف النسخة (JSON)
              </button>
            </div>

            {/* قسم الرفع */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200 text-center">
              <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                <i className="fa-solid fa-cloud-arrow-up"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">استعادة من ملف</h3>
              <p className="text-slate-500 text-sm mb-8">اختر ملف النسخة الاحتياطية من جهازك لاسترجاع البيانات والأسماء.</p>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImport} 
                accept=".json" 
                className="hidden" 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 bg-amber-500 text-emerald-950 rounded-2xl font-black shadow-lg hover:bg-amber-600 transition flex items-center justify-center gap-3"
              >
                <i className="fa-solid fa-upload"></i>
                رفع ملف الاستعادة
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
