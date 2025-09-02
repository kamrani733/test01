import Container from "@/components/shared/Container";
import CustomButton from "@/components/shared/CustomButton";
import { Heading } from "@/components/ui/Heading";
import { getSettings } from "@/core/lib/api/main/setting";
import { getDictionaryServer } from "@/core/lib/dictionary";
import { Mail, MapPin, Phone, Smartphone } from "lucide-react";

export async function generateMetadata() {
  const { dictionary } = await getDictionaryServer();

  return {
    title: dictionary.ui.pages.contactUsTitle,
    description: dictionary.ui.pages.contactUsDescription,
  };
}

export default async function ContactUsPage() {
  const settings = await getSettings();
  console.log(settings);

  const { dictionary } = await getDictionaryServer();

  return (
    <Container className="space-y-6 mt-10">
      <div className="space-y-3">
        <Heading level={1} className="text-lg">
          {dictionary.ui.pages.contactUsTitle}
        </Heading>
        <p className="text-sm text-primary-600">
          {dictionary.ui.pages.contactUsDescription}
        </p>
      </div>
      <div className="space-y-3">
        <a
          href={`mailto:${settings?.admin_email}`}
          className="bg-primary-100 rounded-sm flex items-center px-4 py-3 gap-2 transition"
        >
          <Mail className="size-4" />
          <Heading level={4}>{dictionary.forms.adminEmail}</Heading>
          <p className="text-primary-600">{settings?.admin_email || "-"}</p>
        </a>

        <a
          href={`tel:${settings?.company_phone}`}
          className="bg-primary-100 rounded-sm flex items-center px-4 py-3 gap-2 transition"
        >
          <Phone className="size-4" />
          <Heading level={4}>{dictionary.forms.companyPhone}</Heading>
          <p className="text-primary-600">{settings?.company_phone || "-"}</p>
        </a>

        <a
          href={`tel:${settings?.company_mobile}`}
          className="bg-primary-100 rounded-sm flex items-center px-4 py-3 gap-2 transition"
        >
          <Smartphone className="size-4" />
          <Heading level={4}>{dictionary.forms.companyMobile}</Heading>
          <p className="text-primary-600">{settings?.company_mobile || "-"}</p>
        </a>

        <div className="bg-primary-100 rounded-sm flex items-center px-4 py-3 transition justify-between">
          <div className="gap-2 flex items-center">
            <MapPin className="size-4" />
            <Heading level={4}>{dictionary.forms.companyAddress}</Heading>
            <p className="text-primary-600">
              {settings?.company_address || "-"}
            </p>
          </div>

          <div className="gap-2 flex items-center">
            <CustomButton size="sm" asChild variant="black">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://www.google.com/maps?q=${settings?.company_lat},${settings?.company_lon}`}
              >
                {dictionary.ui.pages.neshan}
              </a>
            </CustomButton>

            <CustomButton size="sm" asChild variant="black">
              <a
                href={`https://map.neshan.org/search?term=${
                  settings?.company_address || ""
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {dictionary.ui.pages.goolgemap}
              </a>
            </CustomButton>
          </div>
        </div>
      </div>
      <iframe
        title="Company Location"
        width="100%"
        height="300px"
        loading="lazy"
        allowFullScreen
        src={`https://www.google.com/maps?q=${settings?.company_lat},${settings?.company_lon}&hl=fa&z=15&output=embed`}
        className="rounded-md border"
      />
    </Container>
  );
}
