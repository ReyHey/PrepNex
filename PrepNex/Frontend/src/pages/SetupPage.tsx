import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionService } from '../api/sessionService';
import { Navbar } from '../components/layout/Navbar';
import { Button } from '../components/ui/Button';

const POSITIONS = [
  'Junior Developer',
  'Mid-level Developer',
  'Senior Developer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
];

const SKILLS = ['C#', '.NET', 'JavaScript', 'TypeScript', 'React', 'SQL', 'OOP', 'SOLID', 'REST API', 'Python'];

export function SetupPage() {
  const navigate = useNavigate();
  const [position, setPosition] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const handleStart = async () => {
    if (!position) return;
    setLoading(true);
    try {
      const session = await sessionService.createSession(position, selectedSkills);
      navigate(`/session/${session.id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0d0d0d]">
      <Navbar />

      <div className="flex-1 overflow-y-auto flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-1">Start Interview Session</h1>
            <p className="text-sm text-gray-400">
              Choose a position and optional skills. We'll build a curated set of questions for your session.
            </p>
          </div>

          <div className="space-y-6">
            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Position <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {POSITIONS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPosition(p)}
                    className={`px-4 py-2.5 rounded-lg border text-sm text-left transition-all cursor-pointer
                      ${
                        position === p
                          ? 'bg-blue-600/20 border-blue-500 text-white'
                          : 'bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-500'
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Technical Skills{' '}
                <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-full border text-xs transition-all cursor-pointer
                      ${
                        selectedSkills.includes(skill)
                          ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                          : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
                      }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => navigate('/')}
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
              >
                ← Back to library
              </button>
              <Button
                variant="primary"
                size="md"
                onClick={handleStart}
                disabled={!position}
                loading={loading}
              >
                Start Session →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
