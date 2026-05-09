import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { InterviewPage } from './pages/InterviewPage';
import { SetupPage } from './pages/SetupPage';
import { SessionPage } from './pages/SessionPage';
import { FeedbackPage } from './pages/FeedbackPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/questions/:id" element={<InterviewPage />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/session/:sessionId" element={<SessionPage />} />
        <Route path="/session/:sessionId/feedback" element={<FeedbackPage />} />
      </Routes>
    </BrowserRouter>
  );
}
