import { getFooterItems } from '@/core/lib/api/main/menu-api';
import FooterList from './FooterList';
import Newsletter from './Newsletter';
import { Separator } from '@/components/ui/separator';
import SelectLanguage from '@/components/account/SelectLanguage';
import SocialMedia from './SocialMedia';
import Container from '@/components/shared/Container';

export default async function Footer() {
  const footerItems = await getFooterItems();
  console.log(footerItems);
  

  return (
    <footer className="bg-[#2F2F2F] text-[#F5F5F5] mt-10">
      <Container className="pt-10 pb-5 space-y-5">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-9">
            <FooterList footerItems={footerItems} />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <Newsletter />
          </div>
        </div>
        <div>
          <SocialMedia />
        </div>
        <Separator className="bg-[#F5F5F5]/20" />
        <div>
          <a
            referrerPolicy="origin"
            target="_blank"
            href="https://trustseal.enamad.ir/?id=641760&Code=HXhY4I3opre6zXlmrxaw6JdWlEVgURft"
          >
            <img
              referrerPolicy="origin"
              src="https://trustseal.enamad.ir/logo.aspx?id=641760&Code=HXhY4I3opre6zXlmrxaw6JdWlEVgURft"
              alt=""
              style={{ cursor: 'pointer' }}
              //@ts-ignore
              code="HXhY4I3opre6zXlmrxaw6JdWlEVgURft"
            />
          </a>
        </div>
        <div className="flex items-center justify-center">
          <SelectLanguage />
        </div>
        <div className="flex items-center justify-center flex-col md:flex-row md:justify-between">
          <p className="text-[#F5F5F5]/80 text-sm">
            کوکی‌ها | قوانین و شرایط | سیاست حفظ حریم خصوصی
          </p>
          <p className="text-[#F5F5F5]/80 text-sm">
            فروشگاه مبلمان ارم هوم | تمامی حقوق محفوظ است 2025
          </p>
        </div>
      </Container>
    </footer>
  );
}
