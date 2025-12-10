export default function ComponentHeader({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-200">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
        {title}
      </h1>
      <p className="text-sm text-gray-500 mt-1">{content}</p>
    </div>
  );
}
