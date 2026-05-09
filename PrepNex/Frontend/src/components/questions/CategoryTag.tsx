interface CategoryTagProps {
  category: string;
}

export function CategoryTag({ category }: CategoryTagProps) {
  return (
    <span className="text-xs px-2 py-0.5 rounded bg-gray-700/60 text-gray-300 border border-gray-600/50">
      {category}
    </span>
  );
}
