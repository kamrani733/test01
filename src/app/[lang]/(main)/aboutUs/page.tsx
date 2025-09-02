import Image from "next/image";
import Container from "@/components/shared/Container";
import { Heading } from "@/components/ui/Heading";
import { aboutUsInfo } from "@/core/lib/aboutUs-data";
import { Banner } from "@/components/main/widgets/Banner";
import { getSettings } from "@/core/lib/api/main/setting";

type Lang = "en" | "fa" | "ar";

const titleTranslations: Record<Lang, string> = {
  en: "About Us",
  fa: "درباره ما",
  ar: "عنا",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Lang }>;
}) {
  const resolvedParams = await params;
  const settings = await getSettings();

  const siteTitle = settings?.site_title || "Eram Home";

  const pageTitle = titleTranslations[resolvedParams.lang] || "About Us";

  return {
    title: `${siteTitle} | ${pageTitle}`,
  };
}

export default function AboutUsPage() {
  return (
    <Container className="flex flex-col gap-y-10">
      <Banner data={aboutUsInfo.section1.data}  />
      <section>
        <p className="text-primary-600 md:px-14 lg:px-30 text-justify">
          {aboutUsInfo.section2.description}
        </p>
      </section>
      <section className="md:px-14 lg:px-30">
        <Heading level={2}>{aboutUsInfo.section3.title}</Heading>
        <p className="text-primary-600">{aboutUsInfo.section3.description}</p>
      </section>
      <section className="grid md:grid-cols-3 gap-6">
        {aboutUsInfo.section4.map((item) => (
          <div key={item.id}>
            <figure className="mb-3">
              <Image src={item.imageSrc} alt={item.title} className="w-full" />
            </figure>
            <Heading level={3} className="mb-2">
              {item.title}
            </Heading>
            <p className="text-primary-600">{item.description}</p>
          </div>
        ))}
      </section>
      <Banner
        data={aboutUsInfo.section5.data}
      />
    </Container>
  );
}
