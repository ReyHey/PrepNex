import { useState } from 'react';
import type { Question } from '../../types';
import { DifficultyBadge } from '../questions/DifficultyBadge';
import { CategoryTag } from '../questions/CategoryTag';

interface QuestionPanelProps {
  question: Question;
}

type Tab = 'description' | 'hints';

export function QuestionPanel({ question }: QuestionPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('description');
  const [showHints, setShowHints] = useState(false);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-800">
        <h1 className="text-lg font-semibold text-white leading-snug">{question.title}</h1>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <DifficultyBadge difficulty={question.difficulty} size="md" />
          <CategoryTag category={question.category} />
          {question.topic && (
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
              {question.topic}
            </span>
          )}
        </div>
      </div>

      <div className="flex border-b border-gray-800">
        {(['description', 'hints'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors cursor-pointer
              ${activeTab === tab
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-200'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {activeTab === 'description' && (
          <>
            <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {question.description}
            </div>

            {question.examples && question.examples.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-200">Examples</h3>
                {question.examples.map((ex, i) => (
                  <div key={i} className="bg-gray-800/60 rounded-lg p-3 text-sm space-y-1.5">
                    <div>
                      <span className="text-gray-400">Input: </span>
                      <code className="text-green-400 font-mono">{ex.input}</code>
                    </div>
                    <div>
                      <span className="text-gray-400">Output: </span>
                      <code className="text-blue-400 font-mono">{ex.output}</code>
                    </div>
                    {ex.explanation && (
                      <div className="text-gray-400 text-xs">{ex.explanation}</div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {question.constraints && question.constraints.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-200 mb-2">Constraints</h3>
                <ul className="space-y-1">
                  {question.constraints.map((c, i) => (
                    <li key={i} className="text-xs text-gray-400 font-mono flex gap-2">
                      <span className="text-gray-600">•</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {activeTab === 'hints' && (
          <div>
            {question.hints && question.hints.length > 0 ? (
              <div className="space-y-3">
                {question.hints.map((hint, i) => (
                  <div key={i}>
                    <button
                      onClick={() => setShowHints(true)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors cursor-pointer
                        ${showHints
                          ? 'bg-gray-800 border-gray-700 text-gray-300'
                          : 'bg-yellow-400/5 border-yellow-400/20 text-yellow-400/70 hover:bg-yellow-400/10'
                        }`}
                    >
                      {showHints ? (
                        <span className="text-sm">{hint}</span>
                      ) : (
                        <span className="text-sm">Hint {i + 1} — click to reveal</span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No hints available for this question.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
