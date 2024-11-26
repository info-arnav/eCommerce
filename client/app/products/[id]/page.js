import MetaTags from "@/components/metaTags";

export const metadata = MetaTags();

export default async function Page({ params }) {
  const id = (await params).id;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "a",
    image: "a",
    description: "a",
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      My Post: {id}
    </div>
  );
}
