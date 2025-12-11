export default function LegalDocument({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">{title}</h1>
      <div className="prose prose-sm sm:prose-base text-gray-700 leading-relaxed">
        {children}
      </div>
    </div>
  );
}
