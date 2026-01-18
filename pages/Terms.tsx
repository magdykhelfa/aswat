
import React from 'react';

interface TermsProps {
  onNavigate: (page: string) => void;
}

const Terms: React.FC<TermsProps> = ({ onNavigate }) => {
  const sections = [
    {
      title: "أولاً: الشروط العامة",
      items: [
        "المسابقة حصرياً لأبناء محافظة كفر الشيخ (إقامة أو ميلاداً).",
        "يجب أن يتراوح عمر المتسابق بين 7 إلى 40 عاماً.",
        "الالتزام بالآداب العامة والزي المحتشم عند تصوير الفيديو.",
        "لا يجوز للمتسابق الاشتراك بأكثر من مقطع واحد في نفس الفرع."
      ]
    },
    {
      title: "ثانياً: الضوابط الفنية",
      items: [
        "يجب أن تكون المادة المسجلة بصوت المتسابق نفسه بدون أي مؤثرات صوتية تخفي طبيعة الصوت.",
        "مدة التسجيل لا تزيد عن 3 دقائق ولا تقل عن دقيقة واحدة.",
        "وضوح الصوت والصورة شرط أساسي للقبول في مرحلة الفرز.",
        "في تلاوة القرآن: يجب الالتزام بأحكام التجويد ومخارج الحروف الصحيحة."
      ]
    },
    {
      title: "ثالثاً: مراحل المسابقة والتحكيم 2026",
      items: [
        "المرحلة الأولى: الفرز الأولي للتأكد من الانتماء للمحافظة ومطابقة الشروط.",
        "المرحلة الثانية: تقييم المحكمين للمشاركات المقبولة إلكترونياً.",
        "المرحلة الثالثة: التصفيات النهائية المباشرة والمقابلة الشخصية.",
        "قرار لجنة التحكيم نهائي ومعتمد من المشرف العام."
      ]
    }
  ];

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-emerald-900 font-amiri mb-4">شروط مسابقة 2026</h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto rounded-full"></div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
          <p className="text-lg text-slate-600 mb-10 text-center leading-relaxed">
            يرجى قراءة الشروط التالية بعناية، حيث أن المسابقة مخصصة حصرياً للموهوبين من أبناء <span className="text-emerald-800 font-bold">محافظة كفر الشيخ</span> لعام 2026.
          </p>

          <div className="space-y-10">
            {sections.map((section, idx) => (
              <div key={idx}>
                <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-sm">{idx + 1}</span>
                  {section.title}
                </h3>
                <ul className="space-y-4 pr-11">
                  {section.items.map((item, iIdx) => (
                    <li key={iIdx} className="text-slate-700 flex items-start gap-2">
                      <span className="text-amber-500 mt-1"><i className="fa-solid fa-circle-check"></i></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button 
              onClick={() => onNavigate('register')}
              className="bg-spiritual-green text-white px-12 py-4 rounded-full font-bold text-lg hover:bg-emerald-800 transition shadow-lg"
            >
              أوافق على الشروط، سجلني الآن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
