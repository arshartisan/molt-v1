import { Header } from "@/components/header";
import { BookingPopup } from "@/components/cal-inline";
import { Hero } from "@/components/sections/hero";
import { Explore } from "@/components/sections/explore";
import { Statement } from "@/components/sections/statement";
import { Everyday } from "@/components/sections/everyday";
import { DailyView } from "@/components/sections/daily-view";
import { TwoViews } from "@/components/sections/two-views";
import { How } from "@/components/sections/how";
import { Team } from "@/components/sections/team";
import { Together } from "@/components/sections/together";
import { Faq } from "@/components/sections/faq";
import { Demo } from "@/components/sections/demo";
import { Footer } from "@/components/sections/footer";

export default function Page() {
  return (
    <>
      <a href="#features" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-ink focus:p-3 focus:text-white">
        Skip to content
      </a>
      <Header />
      <BookingPopup />
      <main>
        <Hero />
        <Explore />
        <Statement />
        <Everyday />
        <DailyView />
        <TwoViews />
        <How />
        <Team />
        <Together />
        <Faq />
        <Demo />
      </main>
      <Footer />
    </>
  );
}
