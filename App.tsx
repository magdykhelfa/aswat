import React, { useState, useEffect } from 'react';
import { ParticipationStatus, Participant, User } from './types';
import Home from './pages/Home';
import Register from './pages/Register';
import Terms from './pages/Terms';
import AdminDashboard from './pages/AdminDashboard';
import Results from './pages/Results';
import Login from './pages/Login';

const INITIAL_PARTICIPANTS: Participant[] = [];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');

  /* =========================
     🔹 المستخدم (الأدمن)
  ========================= */
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('aswat_admin');
    return saved ? JSON.parse(saved) : null;
  });

  /* =========================
     🔹 الإعدادات العامة
  ========================= */
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

  const [deadline, setDeadline] = useState<Date>(() => {
    const saved = localStorage.getItem('aswat_deadline');
    return saved ? new Date(saved) : new Date('2026-06-30T23:59:59');
  });

  /* =========================
     🔹 تحميل الموعد من الشيت
  ========================= */
  useEffect(() => {
    fetch('https://script.google.com/macros/s/AKfycbwpX1VObGTQ9ZnKH1F41CUFJP-L8vU6j_P2AIWuAFA9lthACDJ1XVzA1LFXPzQPtOxP/exec?action=getSettings')
      .then(res => res.json())
      .then(settings => {
        if (settings.deadline) {
          setDeadline(new Date(settings.deadline));
        }
      })
      .catch(() => {});
  }, []);

  /* =========================
     🔹 حفظ الحالات
  ========================= */
  useEffect(() => {
    localStorage.setItem('aswat_participants', JSON.stringify(participants));
  }, [participants]);

  useEffect(() => {
    localStorage.setItem('aswat_deadline', deadline.toISOString());
  }, [deadline]);

  useEffect(() => {
    localStorage.setItem('aswat_show_results', showCurrentResults.toString());
  }, [showCurrentResults]);

  useEffect(() => {
    localStorage.setItem('aswat_last_year', JSON.stringify(lastYearWinners));
  }, [lastYearWinners]);

  /* =========================
     🔹 تسجيل الدخول
  ========================= */
  const handleLogin = (username: string, pass: string) => {
    if (username === 'magdy' && pass === '5518') {
      const adminUser: User = {
        id: 'admin-1',
        name: 'مجدي (المشرف العام)',
        role: 'admin',
      };
      setCurrentUser(adminUser);
      localStorage.setItem('aswat_admin', JSON.stringify(adminUser));
      setCurrentPage('admin');
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('aswat_admin');
    setCurrentPage('home');
  };

  /* =========================
     🔹 المشاركين
  ========================= */
  const addParticipant = (newParticipant: Participant) => {
    setParticipants(prev => [newParticipant, ...prev]);
    setCurrentPage('results');
  };

  const deleteParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  const updateParticipantStatus = (id: string, status: ParticipationStatus) => {
    setParticipants(prev =>
      prev.map(p => (p.id === id ? { ...p, status } : p))
    );
  };

  const addRating = (participantId: string, score: number) => {
    if (!currentUser) return;
    setParticipants(prev =>
      prev.map(p => {
        if (p.id === participantId) {
          const newRatings = [
            ...p.ratings.filter(r => r.judgeId !== currentUser.id),
            {
              judgeId: currentUser.id,
              judgeName: currentUser.name,
              score,
            },
          ];
          const avg =
            newRatings.reduce((a, b) => a + b.score, 0) /
            newRatings.length;
          return {
            ...p,
            ratings: newRatings,
            averageScore: avg,
            status: ParticipationStatus.Qualified,
          };
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

  /* =========================
     🔹 التنقل
  ========================= */
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} deadline={deadline} />;
      case 'register':
        return (
          <Register
            onNavigate={setCurrentPage}
            onRegister={addParticipant}
            deadline={deadline}
          />
        );
      case 'terms':
        return <Terms onNavigate={setCurrentPage} />;
      case 'login':
        return <Login onLogin={handleLogin} onNavigate={setCurrentPage} />;
      case 'admin':
        return currentUser?.role === 'admin' ? (
          <AdminDashboard
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
        ) : (
          <Login onLogin={handleLogin} onNavigate={setCurrentPage} />
        );
      case 'results':
        return (
          <Results
            participants={participants}
            onNavigate={setCurrentPage}
            showCurrentResults={showCurrentResults}
            lastYearWinners={lastYearWinners}
          />
        );
      default:
        return <Home onNavigate={setCurrentPage} deadline={deadline} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">{renderPage()}</main>
    </div>
  );
};

export default App;
