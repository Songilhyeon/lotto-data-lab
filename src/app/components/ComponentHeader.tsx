interface ComponentHeaderProps {
  title: string;
  content: string;
  srOnly?: boolean; // ✅ 추가
}

export default function ComponentHeader({
  title,
  content,
  srOnly = false,
}: ComponentHeaderProps) {
  if (srOnly) {
    return (
      <>
        <h1 className="sr-only">{title}</h1>
        <p className="sr-only">{content}</p>
      </>
    );
  }

  return (
    <div className="bg-white shadow-sm rounded-xl p-3 sm:p-4 border border-gray-200">
      <h1 className="text-lg sm:text-2xl font-bold text-gray-800 tracking-tight">
        {title}
      </h1>
      <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed whitespace-pre-line">
        {content}
      </p>
    </div>
  );
}
