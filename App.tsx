import React, { useState, useEffect } from 'react';
import { ParticipationStatus, Participant, User } from './types';
import Home from './pages/Home';
import Register from './pages/Register';
import Terms from './pages/Terms';
import AdminDashboard from './pages/AdminDashboard';
import Results from './pages/Results';
import Login from './pages/Login';

const INITIAL_PARTICIPANTS: Participant[] = [];

const SETTINGS_API =
  "https://script.google.com/macros/s/AKfycbwpX1VObGTQ9ZnKH1F41CUFJP-L8vU6j_P2AIWuAFA9lthACDJ1XVzA1LFXPzQPtOxP/exec?action=getSettings";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  /* =========================
     🔹 الإعدادات العامة (من السيرفر)
  ========================= */
  const [deadline, setDeadline] = useState<Date>(
    new Date('2026-06-30T23:59:59') // fallback فقط
  );

  const [showCurrentResults, setShowCurrentResults] = useState<boolean>(false);

  const [lastYearWinners, setLastYearWinners] = useState<string[]>(
    Array(10).fill('')
  );

  /* =========================
     🔹 المشاركين
  ========================= */
  const [participants, setParticipants] = useState<Participant[]>([]);

  /* =========================
     🔹 تحميل الإعدادات مرة واحدة من Google Sheet
  ========================= */
  useEffect(() => {
    fetch(SETTINGS_API)
      .then(res => res.json())
      .then(settings => {
        if (settings.deadline) {
          setDeadline(new Date(settings.deadline));
        }

        if (settings.show_results !== undefined) {
          setShowCurrentResults(
            settings.show_results === true ||
            settings.show_results === "true"
          );
        }

        const winners = [
          settings.winner_1,
          settings.winner_2,
          settings.winner_3,
          settings.winner_4,
          settings.winner_5,
          settings.winner_6,
          settings.winner_7,
          settings.winner_8,
          settings.winner_9,
          settings.winner_10,
        ].map(w => w || "");

        setLastYearWinners(winners);
      })
      .catch(err => {
        console.error("فشل تحميل الإعدادات من السيرفر", err);
      });
  }, []);

  /* =========================
     🔹 تسجيل الدخول
  ========================= */
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
              score
            }
          ];

          const avg =
            newRatings.reduce((acc, r) => acc + r.score, 0) /
            newRatings.length;

          return {
            ...p,
            ratings: newRatings,
            averageScore: avg,
            status: ParticipationStatus.Qualified
          };
        }
        return p;
      })
    );
  };

  const importData = (data: Participant[]) => {
    setParticipants(prev => {
      const ids = new Set(prev.map(p => p.id));
      const newOnes = data.filter(p => !ids.has(p.id));
      return [...prev, ...newOnes];
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
