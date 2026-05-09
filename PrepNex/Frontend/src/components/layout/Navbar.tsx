import { Link } from 'react-router-dom';

interface NavbarProps {
  questionTitle?: string;
  children?: React.ReactNode;
}

export function Navbar({ questionTitle, children }: NavbarProps) {
  return (
    <header className="h-12 shrink-0 bg-gray-900 border-b border-gray-800 flex items-center px-4 gap-4 z-10">
      <Link
        to="/"
        className="flex items-center gap-2 text-white font-bold tracking-tight hover:opacity-80 transition-opacity"
      >
        <span className="text-blue-500 text-lg">⌬</span>
        <span>PrepNex</span>
      </Link>

      {questionTitle && (
        <>
          <span className="text-gray-700">/</span>
          <span className="text-sm text-gray-400 truncate max-w-xs">{questionTitle}</span>
        </>
      )}

      <div className="ml-auto flex items-center gap-3">
        {children}
        <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">MVP</span>
      </div>
    </header>
  );
}
