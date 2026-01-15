type JsonLdObject = Record<string, unknown>;
type JsonLd = JsonLdObject | JsonLdObject[];

export default function SeoJsonLd({ json }: { json: JsonLd }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
