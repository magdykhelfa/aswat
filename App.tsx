import React, { useState, useEffect } from 'react';
import { ParticipationType, ParticipationStatus, Participant, User } from './types';
import { CountdownTimer, THEME } from './constants';
import Home from './pages/Home';
import Register from './pages/Register';
import Terms from './pages/Terms';
import AdminDashboard from './pages/AdminDashboard';
import JudgingPanel from './pages/JudgingPanel';
import Results from './pages/Results';
import Login from './pages/Login';

const INITIAL_PARTICIPANTS: Participant[] = [{} as Participant];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [deadline, setDeadline] = useState<Date>(
  new Date('2026-06-30T23:59:59')
);

  const [showCurrentResults, setShowCurrentResults] = useState<boolean>(() => {
    return localStorage.getItem('aswat_show_results') === 'true';
  });

  const [lastYearWinners, setLastYearWinners] = useState<string[]>(() => {
    const saved = localStorage.getItem('aswat_last_year');
    return saved ? JSON.parse(saved) : Array(10).fill('');
  });

  const [participants, setParticipants] = useState<Participant[]>(() => {
    const saved = localStorage.getItem('aswat_participants');
    return saved ? JSON.parse(saved) : INITIAL_PARTICIPANTS;
  });

  useEffect(() => {
    fetch("https://script.google.com/macros/s/AKfycbwpX1VObGTQ9ZnKH1F41CUFJP-L8vU6j_P2AIWuAFA9lthACDJ1XVzA1LFXPzQPtOxP/exec")
      .then(res => res.json())
      .then(settings => {
        if (settings.deadline) {
          setDeadline(new Date(settings.deadline));
        } else {
          // fallback علشان الموقع ميموتش
          setDeadline(new Date('2026-06-30T23:59:59'));
        }
      })
      .catch(() => {
        setDeadline(new Date('2026-06-30T23:59:59'));
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('aswat_show_results', showCurrentResults.toString());
  }, [showCurrentResults]);

  useEffect(() => {
    localStorage.setItem('aswat_last_year', JSON.stringify(lastYearWinners));
  }, [lastYearWinners]);

  const handleLogin = (username: string, pass: string) => {
    if (username === 'magdy' && pass === '5518') {
      const adminUser: User = {
        id: 'admin-1',
        name: 'مجدي (المشرف العام)',
        role: 'admin'
      };
      setCurrentUser(adminUser);
      setCurrentPage('admin');
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const addParticipant = (newParticipant: Participant) => {
    setParticipants(prev => [newParticipant, ...prev]);
    setCurrentPage('results');
  };

  const deleteParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  const updateParticipantStatus = (id: string, status: ParticipationStatus) => {
    setParticipants(prev =>
      prev.map(p => p.id === id ? { ...p, status } : p)
    );
  };

  const addRating = (participantId: string, score: number) => {
    if (!currentUser) return;
    setParticipants(prev =>
      prev.map(p => {
        if (p.id === participantId) {
          const newRatings = [
            ...p.ratings.filter(r => r.judgeId !== currentUser.id),
            { judgeId: currentUser.id, judgeName: currentUser.name, score }
          ];
          const avg =
            newRatings.reduce((a, b) => a + b.score, 0) / newRatings.length;
          return { ...p, ratings: newRatings, averageScore: avg, status: ParticipationStatus.Qualified };
        }
        return p;
      })
    );
  };

  const importData = (data: Participant[]) => {
    setParticipants(prev => {
      const ids = new Set(prev.map(p => p.id));
      return [...prev, ...data.filter(p => !ids.has(p.id))];
    });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} deadline={deadline} />;
      case 'register':
        return <Register onNavigate={setCurrentPage} onRegister={addParticipant} deadline={deadline} />;
      case 'terms':
        return <Terms onNavigate={setCurrentPage} />;
      case 'login':
        return <Login onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case 'admin':
        return currentUser?.role === 'admin'
          ? <AdminDashboard
              participants={participants}
              onUpdateStatus={updateParticipantStatus}
              onDelete={deleteParticipant}
              onLogout={logout}
              onRate={addRating}
              onImportData={importData}
              currentUser={currentUser}
              deadline={deadline}
              onUpdateDeadline={setDeadline}
              showCurrentResults={showCurrentResults}
              onToggleResults={setShowCurrentResults}
              lastYearWinners={lastYearWinners}
              onUpdateLastYear={setLastYearWinners}
            />
          : <Login onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case 'results':
        return <Results
          participants={participants}
          onNavigate={setCurrentPage}
          showCurrentResults={showCurrentResults}
          lastYearWinners={lastYearWinners}
        />;
      default:
        return <Home onNavigate={setCurrentPage} deadline={deadline} />;
    }
  };
     
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md sticky top-0 z-50 h-16 md:h-20">
        <div className="max-w-7xl mx-auto px-3 md:px-4 h-full flex items-center justify-between">

          <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="w-9 h-9 md:w-12 md:h-12 bg-spiritual-green rounded-full flex items-center justify-center text-amber-400">
              <i className="fa-solid fa-mosque"></i>
            </div>
            <div>
              <h1 className="text-sm md:text-xl font-bold text-emerald-900 font-amiri">أصوات من الجنة</h1>
              <p className="text-[8px] md:text-[10px] text-amber-600 font-bold">محافظة كفر الشيخ</p>
            </div>
          </div>

          <nav className="hidden lg:flex gap-8 font-medium text-slate-600">
            <button
              onClick={() => setCurrentPage('home')}
              className={`hover:text-emerald-800 transition ${
                currentPage === 'home' ? 'text-emerald-800 font-bold border-b-2 border-emerald-800' : ''
              }`}
            >
              الرئيسية
            </button>

            <button
              onClick={() => setCurrentPage('results')}
              className={`hover:text-emerald-800 transition ${
                currentPage === 'results' ? 'text-emerald-800 font-bold border-b-2 border-emerald-800' : ''
              }`}
            >
              النتائج
            </button>

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setCurrentPage('admin')}
                className={`flex items-center gap-2 px-4 py-1 rounded-lg transition ${
                  currentPage === 'admin'
                    ? 'bg-emerald-800 text-white font-bold'
                    : 'text-emerald-700 font-bold hover:bg-emerald-50'
                }`}
              >
                <i className="fa-solid fa-gauge-high"></i>
                لوحة التحكم
              </button>
            )}
          </nav>

          <div className="flex gap-2">
            {!currentUser ? (
              <button
                onClick={() => setCurrentPage('login')}
                className="bg-spiritual-green text-white px-4 py-1.5 rounded-full text-xs font-bold"
              >
                الدخول
              </button>
            ) : (
              <button
                onClick={logout}
                className="bg-red-50 text-red-500 w-8 h-8 rounded-full"
              >
                <i className="fa-solid fa-power-off"></i>
              </button>
            )}
          </div>

        </div>
      </header>

      <main className="flex-grow">{renderPage()}</main>

      <footer className="bg-slate-900 text-white py-8 text-center">
        <p className="font-amiri text-lg text-amber-400">أصوات من الجنة - محافظة كفر الشيخ</p>
        <p className="text-[10px] text-slate-500">&copy; 2026</p>
      </footer>
    </div>
  );
};

export default App;
