import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { InterviewPage } from './pages/InterviewPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/questions/:id" element={<InterviewPage />} />
      </Routes>
    </BrowserRouter>
  );
}
