import Container from "@/components/shared/Container";
import { Heading } from "@/components/ui/Heading";
import { getPageBySlug } from "@/core/lib/api/main/main-pages";

type PageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  return (
    <Container>
      <Heading level={1} className="text-lg my-7">
        {page.title}
      </Heading>
      <article
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </Container>
  );
}
