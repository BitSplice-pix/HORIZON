import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage     from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MeditationPage from './pages/MeditationPage';
import MoodPage      from './pages/MoodPage';
import JournalPage   from './pages/JournalPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Navigate to="/login" replace />} />
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/meditation" element={<MeditationPage />} />
        <Route path="/mood"      element={<MoodPage />} />
        <Route path="/journal"   element={<JournalPage />} />
      </Routes>
    </BrowserRouter>
  );
}
