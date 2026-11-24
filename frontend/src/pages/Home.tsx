import { useState } from "react";
import Page from "./Page";
import HomeSection from "../components/sections/specific/HomeSection";
import HistorySection from "../components/sections/specific/HistorySection";
import AccordionContent from "../components/accordions/AccordionContent";
import { lgSectionIdealWidth } from "../services/utils";
import AccountRedirect from "../components/navigation/redirects/AccountRedirect";
import MyListRedirect from "../components/navigation/redirects/MyListRedirect";
import LoginRedirect from "../components/navigation/redirects/Login";
import { isAuthenticated } from "../services/authStorage";
import NavLink from "../components/navigation/redirects/NavLink";

export default function Home() {

  const [isHistoryAccordionOpen, setIsHistoryAccordionOpen] = useState<boolean>(false);

  const reverseButtons = false; // TODO : user parameter
  const isLoggedIn = isAuthenticated();

  return (
    <Page
      title="Accueil"
      idealWidthLandscape={lgSectionIdealWidth}
      idealWidthPortrait={lgSectionIdealWidth}
    >
      <NavLink soloButton={!isLoggedIn} reverseDirection={reverseButtons}>
        {isLoggedIn &&
          <>
            <AccountRedirect reverseDirection />
            <MyListRedirect />
          </>
        }
        {!isLoggedIn && <LoginRedirect />}
      </NavLink>

      <div className="no-gap">
        <HomeSection
          open={isHistoryAccordionOpen}
          setOpen={setIsHistoryAccordionOpen}
        />

        <AccordionContent
          open={isHistoryAccordionOpen}
          topSpace="lg"
        >
          <HistorySection />
        </AccordionContent>
      </div>
    </Page>
  );
}
